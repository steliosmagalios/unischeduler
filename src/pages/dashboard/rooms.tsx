import { buildClerkProps } from "@clerk/nextjs/server";
import { type Room } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import { z } from "zod";
import { useRowActions } from "~/components/data-table/row-actions";
import { LoadingPage } from "~/components/loader";
import ResourceLayout from "~/components/resource-layout";
import { api } from "~/utils/api";
import getCurrentUser from "~/utils/get-current-user";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getCurrentUser(ctx);

  if (user === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (user.role !== "Admin") {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    // Visit this in the future
    props: { userId: user.externalId, ...buildClerkProps(ctx.req) },
  };
};

const columns: ColumnDef<Room>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center">Type</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "capacity",
    header: () => <div className="text-center">Capacity</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("capacity")}</div>
    ),
  },
];

function Test({ item }: { item: Room }) {
  return <pre>{JSON.stringify(item, null, 2)}</pre>;
}

const schema = z.object({
  name: z.string(),
  type: z.enum(["Auditorium", "Laboratory"]),
  capacity: z.number(),
  availability: z.array(z.number()),
});

export default function RoomsPage({ userId }: { userId: string }) {
  const ctx = api.useContext();
  const { data, isLoading } = api.room.getAll.useQuery();
  const deleteMutation = api.room.delete.useMutation({
    onSuccess: () => ctx.room.invalidate(),
  });
  const updateMutation = api.room.update.useMutation({
    onSuccess: () => ctx.room.invalidate(),
  });

  const actions = useRowActions<Room>({
    label: "Room",
    viewComponent: Test,
    schema,
    handlers: {
      handleEdit: (item: z.infer<typeof schema>) => {
        updateMutation.mutate(item);
      },
      handleDelete: (item) => {
        deleteMutation.mutate({ id: item.id });
      },
    },
  });

  if (isLoading || data === undefined) {
    return <LoadingPage />;
  }

  return (
    <ResourceLayout
      userId={userId}
      label="Room"
      tableProps={{ columns, data }}
      actions={actions}
    />
  );
}

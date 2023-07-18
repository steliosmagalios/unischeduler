import { buildClerkProps } from "@clerk/nextjs/server";
import { type Room } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import { z } from "zod";
import useActions from "~/components/data-table/use-actions";
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
    accessorKey: "capacity",
    header: () => <span className="flex w-full justify-center">Capacity</span>,
    cell: ({ row }) => (
      <span className="flex w-full justify-center">
        {row.renderValue("capacity")}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: () => <span className="flex w-full justify-center">Type</span>,
    cell: ({ row }) => (
      <span className="flex w-full justify-center">
        {row.renderValue("type")}
      </span>
    ),
  },
];

const schema = z.object({
  name: z.string().nonempty().describe("Name // Name of the room"),
  capacity: z
    .number()
    .min(1, "Room capacity must be at least 1")
    .describe("Capacity // Capacity of the room"),
  type: z
    .enum(["Auditorium", "Laboratory"])
    .describe("Type // Select the room's type"), // Somehow, sync this with prisma type
});

export default function RoomsPage({ userId }: { userId: string }) {
  const context = api.useContext();
  const { data } = api.room.getAll.useQuery();
  const { mutate } = api.room.create.useMutation({
    onSuccess() {
      void context.room.invalidate();
    },
  });
  const { mutate: mutateDelete } = api.room.delete.useMutation({
    onSuccess() {
      void context.room.invalidate();
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    mutate(values);
  }

  const actions = useActions({
    resource: "group",
    onDeleteClick(id) {
      mutateDelete({ id });
    },
  });

  return (
    <ResourceLayout
      userId={userId}
      label="Rooms"
      tableProps={{ columns, data: data ?? [], actions }}
      formProps={{ schema, onSubmit }}
    />
  );
}

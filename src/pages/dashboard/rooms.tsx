import { buildClerkProps } from "@clerk/nextjs/server";
import { type Room } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import { z } from "zod";
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
  name: z.string().nonempty(),
  capacity: z.number().min(0),
  type: z.enum(["Auditorium", "Laboratory"]), // Somehow, sync this with prisma type
});

export default function RoomsPage({ userId }: { userId: string }) {
  const { data } = api.room.getAll.useQuery();

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
  }

  return (
    <ResourceLayout
      userId={userId}
      label="Rooms"
      columns={columns}
      data={data ?? []}
      onSubmit={onSubmit}
      schema={schema}
    />
  );
}

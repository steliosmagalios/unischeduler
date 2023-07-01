import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { type Room } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import ResourceLayout from "~/components/resource-layout";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  if (userId === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const record = await prisma.user.findUnique({
    where: { externalId: userId },
  });

  if (record === null || record.role !== "Admin") {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: { userId, ...buildClerkProps(ctx.req) },
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

export default function RoomsPage({ userId }: { userId: string }) {
  const { data } = api.room.getAll.useQuery();

  return (
    <ResourceLayout
      userId={userId}
      label="Rooms"
      columns={columns}
      data={data ?? []}
    />
  );
}

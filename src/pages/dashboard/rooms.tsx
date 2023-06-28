import { type Room } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import ResourceLayout from "~/components/resource-layout";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  // Check for authenticated user
  if (session === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Only admins can enter
  // TODO: Add toasts to other pages
  if (session.user.role !== "Admin") {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
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

export default function RoomsPage() {
  const { data } = api.room.getAll.useQuery();

  return <ResourceLayout label="Rooms" columns={columns} data={data ?? []} />;
}

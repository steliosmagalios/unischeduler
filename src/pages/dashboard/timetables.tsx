import { type Timetable } from "@prisma/client";
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

const columns: ColumnDef<Timetable>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "time",
    header: () => <span className="flex w-full justify-center">Timeslots</span>,
    cell: ({ row }) => (
      <span className="flex w-full justify-center">
        {row.original.dayStart.toString().padStart(2, "0")}:00 -{" "}
        {row.original.dayEnd.toString().padStart(2, "0")}:00
      </span>
    ),
  },
  {
    accessorKey: "semester",
    header: () => <span className="flex w-full justify-center">Semester</span>,
    cell: ({ row }) => (
      <span className="flex w-full justify-center">
        {row.renderValue("semester")}
      </span>
    ),
  },
];

export default function TimetablesPage() {
  const { data } = api.timetable.getAll.useQuery();

  return (
    <ResourceLayout label="Timetables" columns={columns} data={data ?? []} />
  );
}

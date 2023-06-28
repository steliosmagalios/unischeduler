import { type Course } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import DashboardLayout from "~/components/dashboard-layout";
import { DataTable } from "~/components/data-table";
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

const RESOURCES = ["courses", "groups", "rooms", "users", "timetables"];

const courseColumns: ColumnDef<Course>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Title",
  },
  {
    accessorKey: "semester",
    header: "Semester",
  },
];

export default function ResourcePage() {
  const router = useRouter();
  const resource = useMemo(
    () => router.query.resource as string,
    [router.query]
  );

  // TODO: Handle case
  if (!RESOURCES.includes(resource)) {
    return <>No Resource</>;
  }

  const { data: courseData } = api.course.getAll.useQuery();

  return (
    <DashboardLayout label={resource}>
      <div className="flex h-full flex-col gap-2 overflow-hidden">
        <div>
          <h2 className="text-3xl font-semibold capitalize">{resource}</h2>
          <hr />
        </div>

        {/* Table */}
        <div className="flex-grow overflow-auto">
          <DataTable columns={courseColumns} data={courseData ?? []} />
        </div>

        <div className="flex flex-row-reverse">
          <button className="rounded-md bg-blue-500 px-4 py-2 font-semibold">
            Create
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { type Course } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import ResourceLayout from "~/components/resource-layout";
import { api } from "~/utils/api";

// eslint-disable-next-line @typescript-eslint/require-await
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

  return {
    props: { userId, ...buildClerkProps(ctx.req) },
  };
};

const columns: ColumnDef<Course>[] = [
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
    header: () => <span className="flex w-full justify-center">Semester</span>,
    cell: ({ row }) => (
      <span className="flex w-full justify-center">
        {row.renderValue("semester")}
      </span>
    ),
  },
];

export default function CoursesPage({ userId }: { userId: string }) {
  const { data } = api.course.getAll.useQuery();

  return (
    <ResourceLayout
      userId={userId}
      label="Courses"
      columns={columns}
      data={data ?? []}
    />
  );
}

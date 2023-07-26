import { buildClerkProps } from "@clerk/nextjs/server";
import { type Course } from "@prisma/client";
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

const schema = z.object({
  code: z.string().nonempty().describe("Code // Course code"),
  name: z.string().nonempty().describe("Name // Name of the course"),
  semester: z.number().min(0).max(8).describe("Semester // Enter the semester"),
});

export default function CoursesPage({ userId }: { userId: string }) {
  const ctx = api.useContext();
  const { data, isLoading } = api.course.getAll.useQuery();
  const createMutation = api.course.create.useMutation({
    onSuccess: () => void ctx.course.invalidate(),
  });
  const updateMutation = api.course.update.useMutation({
    onSuccess: () => void ctx.course.invalidate(),
  });
  const deleteMutation = api.course.delete.useMutation({
    onSuccess: () => void ctx.course.invalidate(),
  });

  const actions = useRowActions<Course>({
    label: "Course",
    schema,
    viewComponent: () => null,
    handlers: {
      handleEdit(data: z.infer<typeof schema>, id) {
        updateMutation.mutate({ id, data });
      },
      handleDelete(item) {
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
      label="Courses"
      tableProps={{ columns, data }}
      actions={actions}
      createFormProps={{
        schema,
        onSubmit: (data: z.infer<typeof schema>) => createMutation.mutate(data),
      }}
    />
  );
}

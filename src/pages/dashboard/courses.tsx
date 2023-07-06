import { buildClerkProps } from "@clerk/nextjs/server";
import { type Course } from "@prisma/client";
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
  const context = api.useContext();
  const { data } = api.course.getAll.useQuery();
  const { mutate } = api.course.create.useMutation({
    onSuccess() {
      void context.course.invalidate();
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    mutate({ ...values }); // TODO: Check if there is a better way for description
  }

  return (
    <ResourceLayout
      userId={userId}
      label="Courses"
      tableProps={{ columns, data: data ?? [] }}
      formProps={{ schema, onSubmit }}
    />
  );
}

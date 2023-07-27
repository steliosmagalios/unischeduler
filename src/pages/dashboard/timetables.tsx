import { buildClerkProps } from "@clerk/nextjs/server";
import { type Timetable } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import { z } from "zod";
import { LoadingPage } from "~/components/loader";
import ResourceLayout from "~/components/resource-layout";
import { useRowActions } from "~/components/resource-layout/row-actions";
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

const columns: ColumnDef<Timetable>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
  {
    id: "status",
    header: () => <span className="flex w-full justify-center">Status</span>,
    cell({ row }) {
      if (!row.original.generated) {
        return (
          <span className="flex w-full items-center justify-center gap-2">
            <div className="aspect-square h-3 rounded-full bg-red-500" />
            Not Generated
          </span>
        );
      }

      return (
        <span className="flex w-full items-center justify-center gap-2">
          <div
            className={`aspect-square h-3 rounded-full ${
              row.original.published ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          {row.original.published ? "Published" : "Unpublished"}
        </span>
      );
    },
  },
];

const schema = z.object({
  name: z.string().nonempty().describe("Name // Name of the timetable"),
  semester: z.enum(["Fall", "Spring"]).describe("Semester // Semester"),
});

export default function TimetablesPage({ userId }: { userId: string }) {
  const ctx = api.useContext();
  const { data, isLoading } = api.timetable.getAll.useQuery();
  const createMutation = api.timetable.create.useMutation({
    onSuccess: () => void ctx.timetable.invalidate(),
  });
  const updateMutation = api.timetable.update.useMutation({
    onSuccess: () => void ctx.timetable.invalidate(),
  });
  const deleteMutation = api.timetable.delete.useMutation({
    onSuccess: () => void ctx.timetable.invalidate(),
  });

  const actions = useRowActions<Timetable>({
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
      label="Timetables"
      tableProps={{ columns, data }}
      actions={actions}
      createFormProps={{
        schema,
        onSubmit: (item: z.infer<typeof schema>) => createMutation.mutate(item),
      }}
    />
  );
}

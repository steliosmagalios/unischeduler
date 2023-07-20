import { buildClerkProps } from "@clerk/nextjs/server";
import { type Timetable } from "@prisma/client";
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
  const context = api.useContext();
  const { data } = api.timetable.getAll.useQuery();
  const { mutate } = api.timetable.create.useMutation({
    onSuccess() {
      void context.timetable.invalidate();
    },
  });
  const { mutate: mutateDelete } = api.timetable.delete.useMutation({
    onSuccess() {
      void context.timetable.invalidate();
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    mutate(values);
  }
  const actions = useActions({
    resource: "timetable",
    onDeleteClick(id) {
      mutateDelete({ id });
    },
  });

  return (
    <ResourceLayout
      userId={userId}
      label="Timetables"
      tableProps={{ columns, data: data ?? [], actions }}
      formProps={{ schema, onSubmit }}
    />
  );
}

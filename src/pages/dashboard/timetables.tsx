import { buildClerkProps } from "@clerk/nextjs/server";
import { type Timetable } from "@prisma/client";
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

const schema = z
  .object({
    name: z.string().nonempty().describe("Name // Name of the timetable"),
    semester: z.enum(["Fall", "Spring"]).describe("Semester // Semester"),
    startTime: z.number().min(0).max(23).describe("Start Time // Start time"),
    endTime: z.number().min(0).max(23).describe("End Time // End time"),
  })
  .refine(
    (data) => data.startTime < data.endTime,
    "Start time must be before end time"
  );

export default function TimetablesPage({ userId }: { userId: string }) {
  const { data } = api.timetable.getAll.useQuery();

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
  }

  return (
    <ResourceLayout
      userId={userId}
      label="Timetables"
      columns={columns}
      data={data ?? []}
      onSubmit={onSubmit}
      schema={schema}
    />
  );
}

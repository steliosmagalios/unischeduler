import { buildClerkProps } from "@clerk/nextjs/server";
import { type Course } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import { useMemo } from "react";
import { z } from "zod";
import AlertDialogItem from "~/components/alert-dialog-item";
import { type ActionMenuItem } from "~/components/data-table/actions-menu";
import DialogItem from "~/components/dialog-item";
import ResourceLayout from "~/components/resource-layout";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
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
  const { mutate: mutateCreate } = api.course.create.useMutation({
    onSuccess() {
      void context.course.invalidate();
    },
  });
  const { mutate: mutateDelete } = api.course.delete.useMutation({
    onSuccess() {
      void context.course.invalidate();
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    mutateCreate({ ...values }); // TODO: Check if there is a better way for description
  }

  const actions = useMemo<ActionMenuItem[]>(
    () => [
      {
        render(key) {
          return (
            <DialogItem key={key} triggerChildren="View">
              todo
            </DialogItem>
          );
        },
      },
      {
        render(key) {
          return (
            <DialogItem key={key} triggerChildren="Edit">
              todo
            </DialogItem>
          );
        },
      },
      {
        render(key, id) {
          return (
            <AlertDialogItem key={key} triggerChildren="Delete">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Course</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this course? You can&apos;t
                  undo this action afterwards.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => mutateDelete({ id })}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogItem>
          );
        },
      },
    ],
    [mutateDelete]
  );

  return (
    <ResourceLayout
      userId={userId}
      label="Courses"
      tableProps={{
        columns,
        data: data ?? [],
        actions,
      }}
      formProps={{ schema, onSubmit }}
    />
  );
}

import { buildClerkProps } from "@clerk/nextjs/server";
import { type Course } from "@prisma/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { type ColumnDef } from "@tanstack/react-table";
import { Clipboard } from "lucide-react";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import { useMemo } from "react";
import { z } from "zod";
import { LoadingPage, LoadingSpinner } from "~/components/loader";
import ResourceLayout from "~/components/resource-layout";
import { useRowActions } from "~/components/resource-layout/row-actions";
import { Button } from "~/components/ui/button";
import { DialogFooter, DialogTitle } from "~/components/ui/dialog";
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
    viewComponent: ViewCourse,
    handlers: {
      handleEdit(data: z.infer<typeof schema>, id) {
        updateMutation.mutate({ id, data });
      },
      handleDelete(item) {
        deleteMutation.mutate({ id: item.id });
      },
    },
    additionalActions: [
      {
        render(key, item) {
          return (
            <Button key={key} asChild variant="ghost" className="h-8 w-8 p-0">
              <Link href={`/dashboard/courses/lectures?id=${item.id}`}>
                <span className="sr-only">Open menu</span>
                <Clipboard className="h-4 w-4" />
              </Link>
            </Button>
          );
        },
      },
    ],
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

function ViewCourse(props: { item: Course }) {
  const { isLoading, data } = api.course.getLectures.useQuery({
    id: props.item.id,
  });
  const typesArr = useMemo(
    () =>
      !!data
        ? data
            .map((item) => item.type)
            .filter((value, index, self) => self.indexOf(value) === index)
        : [],
    [data]
  );

  if (isLoading || data === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <DialogTitle>View Course</DialogTitle>

      <div className="flex flex-col gap-2">
        <div className="text-xl font-bold">
          ({props.item.code}) {props.item.name}
        </div>

        <div className="pl-3 text-sm text-muted-foreground">
          1<sup>st</sup> semester, {typesArr.join(", ")}
        </div>

        <div>
          <p className="text-lg font-semibold">Professors</p>
          <p>
            {data
              .flatMap((i) => i.professors)
              .filter((v, idx, arr) => arr.indexOf(v) === idx)
              .map((p) => `${p.firstName ?? ""} ${p.lastName ?? ""}`)
              .join(", ")}
          </p>
        </div>

        <div>
          <p className="text-lg font-semibold">Groups</p>
          <p>
            {data
              .flatMap((i) => i.groups)
              .filter((v, idx, arr) => arr.indexOf(v) === idx)
              .map((g) => g.name)
              .join(", ")}
          </p>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}

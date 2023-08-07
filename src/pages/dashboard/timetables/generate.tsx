import { buildClerkProps } from "@clerk/nextjs/server";
import { type Course } from "@prisma/client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardLayout from "~/components/dashboard-layout";
import Pagination from "~/components/data-table/pagination";
import { LoadingPage } from "~/components/loader";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useToast } from "~/components/ui/use-toast";
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
    props: {
      timetableId: parseInt(ctx.query.id as string),
      userId: user.externalId,
      ...buildClerkProps(ctx.req),
    },
  };
};

type PageProps = { userId: string; timetableId: number };

export default function GeneratePage({ userId, timetableId }: PageProps) {
  const { toast } = useToast();
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const { data: courses, isLoading: coursesLoading } =
    api.course.getFromTimetable.useQuery({ id: timetableId });

  const ctx = api.useContext();
  const generateMutation = api.timetable.generate.useMutation({
    onSuccess() {
      void ctx.timetable.getAll.invalidate();
      toast({
        title: "Timetable generated",
        description: "You can view it in the timetable page",
        duration: 1000,
      });
    },
    onError(error) {
      toast({
        title: "Error generating timetable",
        description: error.message,
        duration: 1000,
      });
    },
  });

  if (coursesLoading || courses === undefined) {
    return <LoadingPage />;
  }

  function handleGenerate() {
    toast({
      title: "Generating timetable",
      description: "This may take a while...",
      duration: 2000,
    });

    generateMutation.mutate({ courses: selectedCourses, id: timetableId });
  }

  return (
    <DashboardLayout
      label="Generate Timetable"
      userId={userId}
      className="flex flex-col gap-2"
    >
      <h2 className="text-3xl font-bold">Generate Timetable</h2>

      <div className="flex-grow overflow-auto">
        <CoursesDataTable courses={courses} onChange={setSelectedCourses} />
      </div>

      <div className="flex flex-shrink-0 flex-row-reverse gap-2">
        <Button
          disabled={selectedCourses.length === 0}
          onClick={handleGenerate}
        >
          Generate
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/timetables">Go Back</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
}

const columns: ColumnDef<Course>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "semester",
    header: () => <div className="text-center">Semester</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.renderValue("semester")}</div>
    ),
  },
];

type CourseDataTableProps = {
  courses: Course[];
  onChange?: (value: number[]) => void;
};

function CoursesDataTable(props: CourseDataTableProps) {
  const { onChange } = props;
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const table = useReactTable({
    columns,
    data: props.courses,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  useEffect(() => {
    onChange?.(Object.keys(rowSelection).map(Number));
  }, [onChange, rowSelection]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-hidden rounded-md border">
      <div className="flex-grow overflow-y-auto ">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} />
    </div>
  );
}

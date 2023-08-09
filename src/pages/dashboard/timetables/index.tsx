import { buildClerkProps } from "@clerk/nextjs/server";
import { type Timetable } from "@prisma/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { type ColumnDef } from "@tanstack/react-table";
import { Calendar, CheckIcon, ExternalLinkIcon } from "lucide-react";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import { forwardRef } from "react";
import { z } from "zod";
import { LoadingPage } from "~/components/loader";
import ResourceLayout from "~/components/resource-layout";
import { useRowActions } from "~/components/resource-layout/row-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { DialogFooter, DialogTitle } from "~/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
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
    label: "Timetable",
    schema,
    viewComponent: TimetableCard,
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
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" className="h-8 w-8 p-0">
                  <Link href={`/dashboard/timetables/generate?id=${item.id}`}>
                    <span className="sr-only">Generate</span>
                    <Calendar className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <span>Generate</span>
              </TooltipContent>
            </Tooltip>
          );
        },
      },
      {
        render(key, item) {
          return <PublishDialog key={key} id={item.id} />;
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

function TimetableCard({ item }: { item: Timetable }) {
  return (
    <>
      <DialogTitle>View Timetable</DialogTitle>

      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold">{item.name}</p>
        <p className="text-sm italic text-muted-foreground">
          {item.semester} {item.published && "(published)"}
        </p>

        {item.generated ? (
          <Button asChild>
            <Link href={`/dashboard/timetables/view?id=${item.id}`}>
              View Timetable <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <p className="text-center">This timetable is not generated yet</p>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}

function PublishDialog({ id }: { id: number }) {
  const { toast } = useToast();
  const ctx = api.useContext();
  const publishMutation = api.timetable.publish.useMutation({
    onSuccess: () => {
      void ctx.timetable.getAll.invalidate();
      void ctx.timetable.getPublished.invalidate();
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Error Publishing Timetable",
        description: error.message,
        duration: 2000,
      });
    },
  });

  function publishTimetable() {
    publishMutation.mutate({ id });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ButtonWithTooltip />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="capitalize">
            Publish Timetable
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to pushlish this timetable? This action will
            unpublish the current published timetable.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={publishTimetable}>
            Publish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const ButtonWithTooltip = forwardRef<HTMLButtonElement>(({}, ref) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button ref={ref} variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Publish</span>
        <CheckIcon className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <span>Publish Timetable</span>
    </TooltipContent>
  </Tooltip>
));

ButtonWithTooltip.displayName = "ButtonWithTooltip";

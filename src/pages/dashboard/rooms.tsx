import { buildClerkProps } from "@clerk/nextjs/server";
import { type Room } from "@prisma/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import { z } from "zod";
import { AvailabilitySchema } from "~/components/form/custom-form";
import { LoadingPage } from "~/components/loader";
import ResourceLayout from "~/components/resource-layout";
import { useRowActions } from "~/components/resource-layout/row-actions";
import TimeGrid from "~/components/time-grid";
import { Button } from "~/components/ui/button";
import { DialogFooter, DialogTitle } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
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

const columns: ColumnDef<Room>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center">Type</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "capacity",
    header: () => <div className="text-center">Capacity</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("capacity")}</div>
    ),
  },
];

const schema = z.object({
  name: z.string().describe("Name // Name of the room"),
  type: z
    .enum(["Auditorium", "Laboratory"])
    .describe("Type // Type of the room"),
  capacity: z.number().describe("Capacity // Capacity of the room"),
  availability: AvailabilitySchema.describe("Availability"),
});

export default function RoomsPage({ userId }: { userId: string }) {
  const ctx = api.useContext();
  const { data, isLoading } = api.room.getAll.useQuery();
  const createMutation = api.room.create.useMutation({
    onSuccess: () => ctx.room.invalidate(),
  });
  const deleteMutation = api.room.delete.useMutation({
    onSuccess: () => ctx.room.invalidate(),
  });
  const updateMutation = api.room.update.useMutation({
    onSuccess: () => ctx.room.invalidate(),
  });

  const actions = useRowActions<Room>({
    label: "Room",
    viewComponent: RoomCard,
    schema,
    handlers: {
      handleEdit: (item: z.infer<typeof schema>, id) => {
        updateMutation.mutate({ id, data: { ...item } });
      },
      handleDelete: (item) => {
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
      label="Rooms"
      tableProps={{ columns, data }}
      actions={actions}
      createFormProps={{
        schema,
        onSubmit: (item: z.infer<typeof schema>) => createMutation.mutate(item),
      }}
    />
  );
}

function RoomCard(props: { item: Room }) {
  return (
    <>
      <DialogTitle>View Room</DialogTitle>

      <div className="flex flex-col gap-2">
        <div>
          <p className="text-xl font-bold">{props.item.name}</p>
          <p className="italic">
            {props.item.type} - {props.item.capacity} seats
          </p>
        </div>

        <div>
          <Label>Availability</Label>
          <TimeGrid
            value={props.item.availability}
            display
            className="rounded-md border p-2"
          />
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

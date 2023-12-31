import { buildClerkProps } from "@clerk/nextjs/server";
import { type User } from "@prisma/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import { z } from "zod";
import { AvailabilitySchema } from "~/components/form/custom-form";
import { LoadingPage } from "~/components/loader";
import ResourceLayout from "~/components/resource-layout";
import { useRowActions } from "~/components/resource-layout/row-actions";
import TimeGrid from "~/components/time-grid";
import { Badge } from "~/components/ui/badge";
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

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "role",
    header: () => <span className="flex w-full justify-center">Role</span>,
    cell: ({ row }) => (
      <span className="flex w-full justify-center">
        <span className="rounded-full bg-green-500 px-3 py-1 font-semibold">
          {row.renderValue("role")}
        </span>
      </span>
    ),
  },
];

const schema = z.object({
  email: z.string().email().nonempty().describe("Email // User's email"),
  firstName: z.string().nonempty().describe("First Name // User's first name"),
  lastName: z.string().nonempty().describe("Last Name // User's last name"),
  role: z
    .enum(["Admin", "Professor", "User"])
    .describe("Role // The user's role"), // Sync with prisma type
  availability: AvailabilitySchema.describe(
    "Availability // Availability is only relevant for professors"
  ),
});

export default function UsersPage({ userId }: { userId: string }) {
  const ctx = api.useContext();
  const { data, isLoading } = api.user.getAll.useQuery();
  const createMutation = api.user.create.useMutation({
    onSuccess: () => ctx.user.getAll.invalidate(),
  });
  const updateMutation = api.user.update.useMutation({
    onSuccess: () => ctx.user.getAll.invalidate(),
  });
  const deleteMutation = api.user.delete.useMutation({
    onSuccess: () => ctx.user.getAll.invalidate(),
  });

  const actions = useRowActions<User>({
    label: "User",
    schema,
    viewComponent: UserCard,
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
      label="Users"
      tableProps={{ columns, data }}
      actions={actions}
      createFormProps={{
        schema,
        onSubmit: (data: z.infer<typeof schema>) => createMutation.mutate(data),
      }}
    />
  );
}

function UserCard(props: { item: User }) {
  return (
    <>
      <DialogTitle>View User</DialogTitle>

      <div className="flex flex-col gap-2">
        <div>
          <p className="text-xl font-bold">
            {props.item.firstName} {props.item.lastName}
          </p>
          <Badge className="self-start">{props.item.role}</Badge>
        </div>

        <p>
          <span className="font-semibold">E-mail:</span> {props.item.email}
        </p>

        <div>
          <Label>Availability</Label>
          <TimeGrid
            className="rounded-md border p-2"
            value={props.item.availability}
            display
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

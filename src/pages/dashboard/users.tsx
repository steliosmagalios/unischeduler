import { buildClerkProps } from "@clerk/nextjs/server";
import { type User } from "@prisma/client";
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

import { buildClerkProps } from "@clerk/nextjs/server";
import { type User } from "@prisma/client";
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
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  role: z.enum(["Admin", "Professor", "User"]), // Sync with prisma type
});

export default function UsersPage({ userId }: { userId: string }) {
  const { data } = api.user.getAll.useQuery();

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
  }

  return (
    <ResourceLayout
      userId={userId}
      label="Users"
      columns={columns}
      data={data ?? []}
      onSubmit={onSubmit}
      schema={schema}
    />
  );
}

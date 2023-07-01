import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { type User } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import ResourceLayout from "~/components/resource-layout";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  if (userId === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const record = await prisma.user.findUnique({
    where: { externalId: userId },
  });

  if (record === null || record.role !== "Admin") {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: { userId, ...buildClerkProps(ctx.req) },
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

export default function UsersPage({ userId }: { userId: string }) {
  const { data } = api.user.getAll.useQuery();

  return (
    <ResourceLayout
      userId={userId}
      label="Users"
      columns={columns}
      data={data ?? []}
    />
  );
}

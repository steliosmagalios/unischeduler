import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { type Group } from "@prisma/client";
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

const columns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

export default function GroupsPage({ userId }: { userId: string }) {
  const { data } = api.group.getAll.useQuery();

  return (
    <ResourceLayout
      userId={userId}
      label="Groups"
      columns={columns}
      data={data ?? []}
    />
  );
}

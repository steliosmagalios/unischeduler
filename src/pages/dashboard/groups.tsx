import { buildClerkProps } from "@clerk/nextjs/server";
import { type Group } from "@prisma/client";
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

const columns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

const schema = z.object({
  name: z.string().nonempty(),
});

export default function GroupsPage({ userId }: { userId: string }) {
  const { data } = api.group.getAll.useQuery();

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
  }

  return (
    <ResourceLayout
      userId={userId}
      label="Groups"
      columns={columns}
      data={data ?? []}
      schema={schema}
      onSubmit={onSubmit}
    />
  );
}

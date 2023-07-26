import { buildClerkProps } from "@clerk/nextjs/server";
import { type Group } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import { z } from "zod";
import { useRowActions } from "~/components/data-table/row-actions";
import { LoadingPage } from "~/components/loader";
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
  name: z.string().nonempty().describe("Name // Name of the group"),
});

export default function GroupsPage({ userId }: { userId: string }) {
  const ctx = api.useContext();
  const { data, isLoading } = api.group.getAll.useQuery();
  const createMutation = api.group.create.useMutation({
    onSuccess: () => void ctx.group.invalidate(),
  });
  const updateMutation = api.group.update.useMutation({
    onSuccess: () => void ctx.group.invalidate(),
  });
  const deleteMutation = api.group.delete.useMutation({
    onSuccess: () => void ctx.group.invalidate(),
  });

  const actions = useRowActions<Group>({
    label: "Course",
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
      label="Courses"
      tableProps={{ columns, data }}
      actions={actions}
      createFormProps={{
        schema,
        onSubmit: (item: z.infer<typeof schema>) => createMutation.mutate(item),
      }}
    />
  );
}

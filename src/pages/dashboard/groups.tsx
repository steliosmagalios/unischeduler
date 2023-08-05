import { buildClerkProps } from "@clerk/nextjs/server";
import { type Group } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type GetServerSideProps } from "next";
import { z } from "zod";
import ManageOverlapsDialog from "~/components/dialogs/manage-overlaps-dialog";
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

const columns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "size",
    header: () => <div className="text-center">Size</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.renderValue("size")}</div>
    ),
  },
];

const schema = z.object({
  name: z.string().nonempty().describe("Name // Name of the group"),
  size: z
    .number()
    .min(1, "Group size needs to be at least 1")
    .describe("Size // The size of the group"),
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

  const { data: groupData } = api.group.getAll.useQuery();

  const actions = useRowActions<Group>({
    label: "Group",
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
    additionalActions: [
      {
        render(key, item) {
          return (
            <ManageOverlapsDialog key={key} id={item.id} groups={groupData} />
          );
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
      label="Groups"
      tableProps={{ columns, data }}
      actions={actions}
      createFormProps={{
        schema,
        onSubmit: (item: z.infer<typeof schema>) => createMutation.mutate(item),
      }}
    />
  );
}

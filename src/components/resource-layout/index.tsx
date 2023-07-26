import { type ColumnDef } from "@tanstack/react-table";
import DashboardLayout from "~/components/dashboard-layout";
import DataTable, { type DataTableProps } from "~/components/data-table";
import RowActions, {
  type RowAction,
} from "~/components/data-table/row-actions";
import { Button } from "~/components/ui/button";

type ResourceLayoutProps<TData extends { id: number }, TValue> = {
  label: string;
  userId: string;

  tableProps: DataTableProps<TData, TValue>;
  actions?: RowAction<TData>[];
};

export default function ResourceLayout<TData extends { id: number }, TValue>(
  props: ResourceLayoutProps<TData, TValue>
) {
  return (
    <DashboardLayout
      userId={props.userId}
      label={props.label}
      className="flex flex-col gap-2"
    >
      <h2 className="text-3xl font-bold">Rooms</h2>
      <DataTable
        columns={withActions(props.tableProps.columns, props.actions ?? [])}
        data={props.tableProps.data}
      />
      <Button className="self-end">Create</Button>
    </DashboardLayout>
  );
}

function withActions<TData, TValue>(
  columns: ColumnDef<TData, TValue>[],
  actions: RowAction<TData>[]
) {
  return columns.concat({
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <RowActions item={row.original} actions={actions} />
      </div>
    ),
  });
}

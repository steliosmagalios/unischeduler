import { type ColumnDef } from "@tanstack/react-table";
import {
  RTFFormSchemaType,
  RTFFormSubmitFn,
} from "@ts-react/form/lib/src/createSchemaForm";
import DashboardLayout from "~/components/dashboard-layout";
import DataTable, { type DataTableProps } from "~/components/data-table";
import RowActions, {
  type RowAction,
} from "~/components/data-table/row-actions";
import CreateResourceDialog from "~/components/resource-layout/create-resource-dialog";

type ResourceLayoutProps<TData extends { id: number }, TValue> = {
  label: string;
  userId: string;

  tableProps: DataTableProps<TData, TValue>;
  actions?: RowAction<TData>[];
  createFormProps: {
    schema: RTFFormSchemaType;
    onSubmit: RTFFormSubmitFn<RTFFormSchemaType>;
  };
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
      <h2 className="text-3xl font-bold">{props.label}</h2>
      <DataTable
        columns={withActions(props.tableProps.columns, props.actions ?? [])}
        data={props.tableProps.data}
      />
      <CreateResourceDialog label={props.label} {...props.createFormProps} />
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

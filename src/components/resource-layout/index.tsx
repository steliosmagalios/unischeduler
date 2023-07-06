import DashboardLayout from "~/components/dashboard-layout";
import { DataTable, type DataTableProps } from "~/components/data-table";
import CreateResourceDialog, {
  type CreateResourceDialogProps,
} from "~/components/resource-layout/create-resource-dialog";
import { capitalize } from "~/utils/lib";

type ResourceLayoutProps<TData extends { id: string }, TType> = {
  label: string;
  userId: string;

  tableProps: DataTableProps<TData, TType>;
  formProps: Omit<CreateResourceDialogProps, "label">;
};

export default function ResourceLayout<TData extends { id: string }, TType>(
  props: ResourceLayoutProps<TData, TType>
) {
  return (
    <DashboardLayout userId={props.userId} label={props.label}>
      <div className="flex h-full flex-col gap-2 overflow-hidden">
        <div>
          <h2 className="text-3xl font-semibold capitalize">
            {capitalize(props.label)}
          </h2>
          <hr />
        </div>

        {/* Table */}
        <div className="flex-grow overflow-auto">
          <DataTable {...props.tableProps} />
        </div>

        <div className="flex flex-row-reverse">
          <CreateResourceDialog label={props.label} {...props.formProps} />
        </div>
      </div>
    </DashboardLayout>
  );
}

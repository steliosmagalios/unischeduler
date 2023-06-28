import DashboardLayout from "~/components/dashboard-layout";
import { DataTable, DataTableProps } from "~/components/data-table";
import { capitalize } from "~/utils/lib";

type ResourceLayoutProps<TData extends { id: string }, TType> = {
  label: string;
} & DataTableProps<TData, TType>;

export default function ResourceLayout<TData extends { id: string }, TType>(
  props: ResourceLayoutProps<TData, TType>
) {
  return (
    <DashboardLayout label={props.label}>
      <div className="flex h-full flex-col gap-2 overflow-hidden">
        <div>
          <h2 className="text-3xl font-semibold capitalize">
            {capitalize(props.label)}
          </h2>
          <hr />
        </div>

        {/* Table */}
        <div className="flex-grow overflow-auto">
          <DataTable columns={props.columns} data={props.data} />
        </div>

        <div className="flex flex-row-reverse">
          <button className="rounded-md bg-blue-500 px-4 py-2 font-semibold">
            Create
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

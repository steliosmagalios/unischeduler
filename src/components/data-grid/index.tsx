import type { Example } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { api } from "~/utils/api";
import CellActions from "./cell-actions";
import CellCheckbox from "./cell-checkbox";

const exampleHelper = createColumnHelper<Example>();

const exampleCols = [
  exampleHelper.display({
    id: "checkbox",
    header: (props) => <CellCheckbox checked indeterminate />,
    cell: ({ row }) => <CellCheckbox checked indeterminate />,
  }),
  // exampleHelper.accessor("id", {}),
  exampleHelper.accessor("createdAt", {}),
  exampleHelper.accessor("updatedAt", {}),
  exampleHelper.display({
    id: "actions",
    header: "Actions",
    size: 150,
    cell: (props) => <CellActions itemId={props.row.id} />,
  }),
];

export default function DataGrid() {
  const items = api.example.getAll.useQuery();
  const table = useReactTable({
    data: items.data ?? [],
    columns: exampleCols,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <table className="w-full table-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="rounded-t-xl bg-slate-800">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`border border-white px-2 py-2 w-[${header.getSize()}px] break-words`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="bg-slate-800 px-2 odd:bg-slate-700 hover:bg-slate-600"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`w-[${cell.column.getSize()}px] break-words border border-white px-2 py-1.5`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p>Loading: {JSON.stringify(items.isLoading)}</p>
      <p>Fetching: {JSON.stringify(items.isFetching)}</p>
      <p>Re-Fetching: {JSON.stringify(items.isRefetching)}</p>
      <p>status: {items.fetchStatus}</p>
    </div>
  );
}

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import CellActions from "./cell-actions";
import CellCheckbox from "./cell-checkbox";

type Person = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = [
  {
    id: "dfsohdfaiosdhfiadf",
    firstName: "rimuru",
    lastName: "tempest",
    age: 24,
    visits: 100,
    status: "",
    progress: 50,
  },
  {
    id: "2dfsohdfaiosdhfiadf",
    firstName: "quinella",
    lastName: "administrator",
    age: 40,
    visits: 40,
    status: "",
    progress: 80,
  },
  {
    id: "dfsohdfaiosdhfiadf3",
    firstName: "looka D.",
    lastName: "znuts",
    age: 45,
    visits: 20,
    status: "",
    progress: 10,
  },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.display({
    id: "checkbox",
    header: (props) => <CellCheckbox checked indeterminate />,
    cell: ({ row }) => <CellCheckbox checked indeterminate />,
  }),
  // columnHelper.accessor("id", {
  //   cell: (info) => info.getValue(),
  //   footer: (info) => info.column.id,
  // }),
  columnHelper.accessor("firstName", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("age", {
    header: () => "Age",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("visits", {
    header: () => <span>Visits</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("progress", {
    header: "Profile Progress",
    footer: (info) => info.column.id,
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    size: 60,
    cell: (props) => <CellActions itemId={props.row.id} />,
  }),
];

export default function DataGrid() {
  const [data, setData] = React.useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <table className="w-full table-fixed">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="rounded-t-xl bg-slate-800">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`border border-white py-2 w-[${header.getSize()}px]`}
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
              className="bg-slate-800 odd:bg-slate-700 hover:bg-slate-600"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-white py-1.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

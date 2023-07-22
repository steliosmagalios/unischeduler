import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useMemo, useState } from "react";
import TableNavigation from "~/components/data-table/table-navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import ActionsMenu, { type ActionMenuItem } from "./actions-menu";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actions?: ActionMenuItem[];
}

export function DataTable<TData extends { id: number }, TValue>(
  props: DataTableProps<TData, TValue>
) {
  const helper = createColumnHelper<TData>();
  const columns = useMemo(
    () => [
      ...props.columns,
      helper.display({
        id: "actions",
        enableSorting: false,
        enableHiding: false,

        header: () => (
          <span className="flex w-full justify-center">Actions</span>
        ),
        cell: ({ row }) => (
          <span className="flex w-full justify-center">
            <ActionsMenu itemId={row.original.id} actions={props.actions} />
          </span>
        ),
      }),
    ],
    [helper, props.actions, props.columns]
  );

  // Table state
  const [pagination, setPagination] = useState({ pageSize: 15, pageIndex: 0 });

  const table = useReactTable({
    data: props.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className="flex h-full flex-col overflow-y-hidden border">
      <div className="flex-grow overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 border-b-4 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TableNavigation table={table} />
    </div>
  );
}

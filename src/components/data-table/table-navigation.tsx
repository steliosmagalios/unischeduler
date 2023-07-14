import { type Table } from "@tanstack/react-table";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";

type TableNavigationProps<TData> = {
  table: Table<TData>;
};

export default function TableNavigation<TData>(
  props: TableNavigationProps<TData>
) {
  return (
    <div className="flex h-14 flex-shrink-0 items-center justify-end gap-1 border-t px-4 font-medium">
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => props.table.setPageIndex(0)}
        disabled={!props.table.getCanPreviousPage()}
      >
        <span className="sr-only">First page</span>
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => props.table.previousPage()}
        disabled={!props.table.getCanPreviousPage()}
      >
        <span className="sr-only">Previous page</span>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="flex h-4 items-center justify-center">
        Page{" "}
        {props.table.getPageCount() > 0
          ? props.table.getState().pagination.pageIndex + 1
          : 0}{" "}
        of {props.table.getPageCount()}
      </span>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => props.table.nextPage()}
        disabled={!props.table.getCanNextPage()}
      >
        <span className="sr-only">Next page</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => props.table.setPageIndex(props.table.getPageCount() - 1)}
        disabled={!props.table.getCanNextPage()}
      >
        <span className="sr-only">Last page</span>
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

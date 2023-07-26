import { type Table } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";

type NavigationProps<TData> = {
  table: Table<TData>;
};

export default function Pagination<TData>(props: NavigationProps<TData>) {
  return (
    <div className="flex flex-shrink-0 items-center justify-end space-x-2 border-t px-2 py-4">
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => props.table.previousPage()}
          disabled={!props.table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="">
          Page {props.table.getState().pagination.pageIndex + 1} of{" "}
          {props.table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => props.table.nextPage()}
          disabled={!props.table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

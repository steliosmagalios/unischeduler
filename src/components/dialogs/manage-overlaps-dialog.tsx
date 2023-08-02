import { type Group } from "@prisma/client";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
} from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { LoadingSpinner } from "~/components/loader";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

type ManageOverlapsDialogProps = {
  id: number;
  groups: Group[] | undefined;
};

export default function ManageOverlapsDialog(props: ManageOverlapsDialogProps) {
  const { toast } = useToast();
  const currentGroup = api.group.getOverlapping.useQuery({ id: props.id });
  const [selected, setSelected] = useState<RowSelectionState>({});
  const updateOverlaps = api.group.updateOverlaps.useMutation();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mappedGroups =
      currentGroup.data?.reduce(
        (acc, curr) => ({ ...acc, [curr]: true }),
        {}
      ) ?? [];

    setSelected(mappedGroups);
  }, [currentGroup.data]);

  function handleSave() {
    const t = toast({
      title: "Processing",
      description: "Updating group info",
      duration: 1000,
    });

    updateOverlaps.mutate({
      id: props.id,
      data: Object.keys(selected).map((k) => parseInt(k)),
    });

    t.update({
      id: t.id,
      title: "Success",
      description: "Updated group info",
      duration: 1000,
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <UsersIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="flex max-h-[90%] min-w-[50%] flex-col"
      >
        <DialogTitle>Manage Group Overlaps</DialogTitle>

        {!props.groups || currentGroup.isLoading ? (
          <div className="translate-x-[50%] translate-y-[50%]">
            <LoadingSpinner />
          </div>
        ) : (
          <GroupDataTable
            data={props.groups.filter((g) => g.id !== props.id)}
            selected={selected}
            setSelected={setSelected}
          />
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={() => handleSave()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type GroupDataTableProps = {
  data: Group[];
  selected: RowSelectionState;
  setSelected: Dispatch<SetStateAction<RowSelectionState>>;
};

const helper = createColumnHelper<Group>();
const columns = [
  helper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  helper.accessor("name", {
    header: "Name",
  }),
];

function GroupDataTable(props: GroupDataTableProps) {
  const table = useReactTable({
    columns,
    data: props.data,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: props.setSelected,
    state: {
      rowSelection: props.selected,
    },
  });

  return (
    <div className="flex h-full w-full flex-col overflow-y-hidden rounded-md border">
      <div className="flex-grow overflow-y-auto ">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { DialogClose } from "@radix-ui/react-dialog";
import { type RTFFormSchemaType } from "@ts-react/form/lib/src/createSchemaForm";
import { MoreHorizontal } from "lucide-react";
import { useMemo, type Key } from "react";
import { z } from "zod";
import AlertDialogItem from "~/components/alert-dialog-item";
import DialogItem from "~/components/data-table/dialog-item";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { DialogFooter, DialogTitle } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export type RowAction<TData> = {
  render: (key: Key | null | undefined, item: TData) => React.ReactNode;
};

type RowActionProps<TData> = {
  item: TData;
  actions?: RowAction<TData>[];
};

export default function RowActions<TData>(props: RowActionProps<TData>) {
  const { actions = [], item } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {actions.map((action, index) => action.render(index, item))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type UseRowActionsProps<TData> = {
  label: string;
  viewComponent: React.ComponentType<{ item: TData }>;
  schema: RTFFormSchemaType;
  handlers: {
    handleEdit: (item: z.infer<UseRowActionsProps<TData>["schema"]>) => void;
    handleDelete: (item: TData) => void;
  };
  additionalActions?: RowAction<TData>[];
};

export function useRowActions<TData>(props: UseRowActionsProps<TData>) {
  const { additionalActions = [] } = props;
  return useMemo<RowAction<TData>[]>(
    () => [
      {
        render(key, item) {
          return (
            <DialogItem key={key} triggerChildren="View">
              <DialogTitle>View {props.label}</DialogTitle>
              <props.viewComponent item={item} />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogItem>
          );
        },
      },
      {
        render(key, item) {
          return (
            <DialogItem key={key} triggerChildren="Edit">
              <DialogTitle>Edit {props.label}</DialogTitle>
              <pre>{JSON.stringify(item, null, 2)}</pre>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogItem>
          );
        },
      },
      {
        render(key, item) {
          return (
            <AlertDialogItem key={key} triggerChildren="Delete">
              <AlertDialogHeader>
                <AlertDialogTitle className="capitalize">
                  Delete {props.label}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this {props.label}? You
                  can&apos;t undo this action afterwards.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="ghost" className="font-semibold">
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction
                  asChild
                  onClick={() => props.handlers.handleDelete(item)}
                >
                  <Button variant="destructive" className="font-bold">
                    Delete
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogItem>
          );
        },
      },
      ...additionalActions,
    ],
    [additionalActions, props]
  );
}

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { useMemo } from "react";
import AlertDialogItem from "~/components/alert-dialog-item";
import { type ActionMenuItem } from "~/components/data-table/actions-menu";
import DialogItem from "~/components/dialog-item";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

type UseActionsProps = {
  resource: string;
  onDeleteClick: (id: string) => void;
  newActions?: ActionMenuItem[];
};

export default function useActions({
  resource,
  onDeleteClick,
  newActions = [],
}: UseActionsProps) {
  const actions = useMemo<ActionMenuItem[]>(
    () => [
      {
        render(key) {
          return (
            <DialogItem key={key} triggerChildren="View">
              todo
            </DialogItem>
          );
        },
      },
      {
        render(key) {
          return (
            <DialogItem key={key} triggerChildren="Edit">
              todo
            </DialogItem>
          );
        },
      },
      {
        render(key, id) {
          return (
            <AlertDialogItem key={key} triggerChildren="Delete">
              <AlertDialogHeader>
                <AlertDialogTitle className="capitalize">
                  Delete {resource}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this {resource}? You
                  can&apos;t undo this action afterwards.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="ghost" className="font-semibold">
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild onClick={() => onDeleteClick(id)}>
                  <Button variant="destructive" className="font-bold">
                    Continue
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogItem>
          );
        },
      },
      ...newActions,
    ],
    [onDeleteClick, resource, newActions]
  );

  return actions;
}

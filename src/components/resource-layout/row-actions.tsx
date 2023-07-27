import { DialogClose } from "@radix-ui/react-dialog";
import { type RTFFormSchemaType } from "@ts-react/form/lib/src/createSchemaForm";
import { Edit, Trash, View } from "lucide-react";
import { useMemo, type Key } from "react";
import { type z } from "zod";
import CustomForm from "~/components/form/custom-form";
import ActionButton from "~/components/resource-layout/action-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { DialogTitle } from "~/components/ui/dialog";

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
    <div className="flex space-x-2">
      {actions.map((action, index) => action.render(index, item))}
    </div>
  );
}

type UseRowActionsProps<TData> = {
  label: string;
  viewComponent: React.ComponentType<{ item: TData }>;
  schema: RTFFormSchemaType;
  handlers: {
    handleEdit: (
      item: z.infer<UseRowActionsProps<TData>["schema"]>,
      id: number
    ) => void;
    handleDelete: (item: TData) => void;
  };
  additionalActions?: RowAction<TData>[];
};

export function useRowActions<TData extends { id: number }>(
  props: UseRowActionsProps<TData>
) {
  const { additionalActions = [] } = props;

  return useMemo<RowAction<TData>[]>(
    () => [
      {
        render(key, item) {
          return (
            <ActionButton
              key={key}
              triggerChildren={
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <View className="h-4 w-4" />
                </Button>
              }
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, ex?
              Facere eveniet autem mollitia, labore deserunt sequi, earum vero,
              praesentium molestias blanditiis sunt obcaecati reiciendis magnam
              quia iusto non? Enim!
            </ActionButton>
          );
        },
      },
      {
        render(key, item) {
          return (
            <ActionButton
              key={key}
              triggerChildren={
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Edit className="h-4 w-4" />
                </Button>
              }
            >
              <DialogTitle>Edit {props.label}</DialogTitle>
              <CustomForm
                schema={props.schema}
                defaultValues={item}
                onSubmit={(data) => props.handlers.handleEdit(data, item.id)}
                renderAfter={() => (
                  <div className="mt-3 flex justify-end space-x-2">
                    <DialogClose asChild>
                      <Button variant="ghost">Close</Button>
                    </DialogClose>
                    <Button type="submit">Update</Button>
                  </div>
                )}
              />
            </ActionButton>
          );
        },
      },
      {
        render(key, item) {
          return (
            <AlertDialog key={key}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
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
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => props.handlers.handleDelete(item)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          );
        },
      },
      ...additionalActions,
    ],
    [additionalActions, props]
  );
}

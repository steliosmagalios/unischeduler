import { forwardRef } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
export type AlertDialogItemProps = {
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
} & React.ComponentProps<typeof DropdownMenuItem>;

const AlertDialogItem = forwardRef<HTMLDivElement, AlertDialogItemProps>(
  (props, forwardedRef) => {
    const { triggerChildren, children, onSelect, onOpenChange, ...itemProps } =
      props;
    return (
      <AlertDialog onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem
            {...itemProps}
            ref={forwardedRef}
            className="DropdownMenuItem"
            onSelect={(event) => {
              event.preventDefault();
              onSelect && onSelect();
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>{children}</AlertDialogContent>
      </AlertDialog>
    );
  }
);

AlertDialogItem.displayName = "AlertDialogItem";

export default AlertDialogItem;

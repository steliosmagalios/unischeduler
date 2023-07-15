import { forwardRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

export type DialogItemProps = {
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
} & React.ComponentProps<typeof DropdownMenuItem>;

const DialogItem = forwardRef<HTMLDivElement, DialogItemProps>(
  (props, forwardedRef) => {
    const { triggerChildren, children, onSelect, onOpenChange, ...itemProps } =
      props;
    return (
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
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
        </DialogTrigger>
        <DialogContent>{children}</DialogContent>
      </Dialog>
    );
  }
);

DialogItem.displayName = "DialogItem";

export default DialogItem;

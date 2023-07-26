import { forwardRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { cn } from "~/utils/shad-utils";

type DialogItemProps = {
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
  contentClasses?: string;
} & React.ComponentProps<typeof DropdownMenuItem>;

const DialogItem = forwardRef<HTMLDivElement, DialogItemProps>(
  (props, forwardedRef) => {
    const {
      triggerChildren,
      children,
      onSelect,
      onOpenChange,
      contentClasses,
      ...itemProps
    } = props;
    return (
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            {...itemProps}
            ref={forwardedRef}
            onSelect={(event) => {
              event.preventDefault();
              onSelect && onSelect();
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent
          className={cn(contentClasses, "max-h-[90%] overflow-y-scroll")}
        >
          {children}
        </DialogContent>
      </Dialog>
    );
  }
);

DialogItem.displayName = "DialogItem";

export default DialogItem;

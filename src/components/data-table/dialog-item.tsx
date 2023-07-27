import {
  createContext,
  forwardRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
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

export const DialogStateContext = createContext<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {
    // do nothing
  },
});

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
    const [open, setOpen] = useState(false);

    return (
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild>
          <DropdownMenuItem
            {...itemProps}
            ref={forwardedRef}
            onSelect={(event) => {
              event.preventDefault();
              onSelect && onSelect();
              setOpen(true);
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogStateContext.Provider value={{ open, setOpen }}>
          <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            className={cn(contentClasses, "max-h-[90%] overflow-y-scroll")}
          >
            {children}
          </DialogContent>
        </DialogStateContext.Provider>
      </Dialog>
    );
  }
);

DialogItem.displayName = "DialogItem";

export default DialogItem;

import { type DialogProps } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

type ActionButtonProps = {
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  tooltip?: string;
} & DialogProps;

export default function ActionButton(props: ActionButtonProps) {
  const { triggerChildren, children, ...dialogProps } = props;

  return (
    <Dialog {...dialogProps}>
      <DialogTrigger asChild>{triggerChildren}</DialogTrigger>
      <DialogContent
        className="max-h-[95%] overflow-scroll"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

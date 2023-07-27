import { type DialogProps } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

type ActionButtonProps = {
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
} & DialogProps;

export default function ActionButton(props: ActionButtonProps) {
  const { triggerChildren, children, ...dialogProps } = props;

  return (
    <Dialog {...dialogProps}>
      <DialogTrigger asChild>{triggerChildren}</DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        {children}
      </DialogContent>
    </Dialog>
  );
}

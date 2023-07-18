import type {
  RTFFormSchemaType,
  RTFFormSubmitFn,
} from "@ts-react/form/lib/src/createSchemaForm";
import { useState } from "react";
import { type z } from "zod";
import CustomForm from "~/components/form/custom-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export type CreateResourceDialogProps = {
  label: string;
  schema: RTFFormSchemaType;
  onSubmit: RTFFormSubmitFn<RTFFormSchemaType>;
};

export default function CreateResourceDialog(props: CreateResourceDialogProps) {
  const [open, setOpen] = useState(false);

  async function onSubmit(values: z.infer<typeof props.schema>) {
    await props.onSubmit(values);
    setOpen(false);
  }

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-md bg-blue-500 px-4 py-2 font-semibold"
          onClick={() => setOpen(true)}
        >
          Create
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create {props.label}</DialogTitle>
        </DialogHeader>

        <CustomForm
          schema={props.schema}
          onSubmit={onSubmit}
          // i don't like this
          renderAfter={() => (
            <div className="flex flex-row-reverse">
              <Button type="submit" className="mt-4">
                Create
              </Button>
            </div>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

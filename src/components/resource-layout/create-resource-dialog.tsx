import { createTsForm, createUniqueFieldSchema } from "@ts-react/form";
import type {
  RTFFormSchemaType,
  RTFFormSubmitFn,
} from "@ts-react/form/lib/src/createSchemaForm";
import { useState } from "react";
import { z } from "zod";
import NumberInput from "~/components/form/input-number";
import SelectInput from "~/components/form/input-select";
import TextInput from "~/components/form/input-text";
import TextAreaInput from "~/components/form/input-textarea";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type CreateResourceDialogProps = {
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
    <Dialog modal open={open}>
      <DialogTrigger asChild>
        <Button
          className="rounded-md bg-blue-500 px-4 py-2 font-semibold"
          onClick={() => setOpen(true)}
        >
          Create
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create {props.label}</DialogTitle>
        </DialogHeader>

        <CreateForm
          schema={props.schema}
          onSubmit={onSubmit}
          // i don't like this
          renderAfter={() => (
            <DialogFooter className="mt-4">
              <Button type="submit">Create</Button>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

export const TextAreaSchema = createUniqueFieldSchema(z.string(), "textarea");

const mapping = [
  [z.string(), TextInput] as const,
  [TextAreaSchema, TextAreaInput] as const,
  [z.number(), NumberInput] as const,
  [z.enum([""]), SelectInput] as const,
] as const;

const CreateForm = createTsForm(mapping);

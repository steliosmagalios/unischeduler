import { createTsForm } from "@ts-react/form";
import type {
  RTFFormSchemaType,
  RTFFormSubmitFn,
} from "@ts-react/form/lib/src/createSchemaForm";
import { z } from "zod";
import NumberInput from "~/components/form/input-number";
import SelectInput from "~/components/form/input-select";
import TextInput from "~/components/form/input-text";
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
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button className="rounded-md bg-blue-500 px-4 py-2 font-semibold">
          Create
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create {props.label}</DialogTitle>
        </DialogHeader>

        <CreateForm schema={props.schema} onSubmit={props.onSubmit} />

        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const mapping = [
  [z.string(), TextInput] as const,
  [z.number(), NumberInput] as const,
  [z.enum([""]), SelectInput] as const,
] as const;

const CreateForm = createTsForm(mapping);

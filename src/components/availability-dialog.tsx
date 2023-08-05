import { useState } from "react";
import { z } from "zod";
import CustomForm, { AvailabilitySchema } from "~/components/form/custom-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";

const availabilityUpdateSchema = z.object({
  availability: AvailabilitySchema.describe("Availability"),
});

type Props = {
  userId: number;
  externalId: string;
  initialValues: number[];
};

export default function AvailabilityDialog(props: Props) {
  const ctx = api.useContext();
  const [open, setOpen] = useState(false);
  const updateMutation = api.user.updateAvailability.useMutation({
    onSuccess: () => ctx.user.get.invalidate({ id: props.externalId }),
  });

  function handleUpdate(data: z.infer<typeof availabilityUpdateSchema>) {
    updateMutation.mutate({ id: props.userId, data: data.availability });
    setOpen(false);
  }

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Settings</Button>
      </DialogTrigger>

      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogTitle>Professor Settings</DialogTitle>

        <CustomForm
          schema={availabilityUpdateSchema}
          onSubmit={handleUpdate}
          defaultValues={{ availability: props.initialValues }}
          renderAfter={() => (
            <div className="flex flex-row-reverse">
              <Button type="submit">Save</Button>
            </div>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

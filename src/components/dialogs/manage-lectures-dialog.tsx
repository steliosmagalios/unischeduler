import { type Group, type User } from "@prisma/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { Clipboard, TrashIcon } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";
import CustomForm from "~/components/form/custom-form";
import { LoadingSpinner } from "~/components/loader";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

type ManageLecturesDialogProps = {
  id: number;
  groups: Group[] | undefined;
  professors: User[] | undefined;
};

const lectureSchema = z.object({
  name: z.string().describe("Name // eg. Theory"),
  type: z.enum(["Auditorium", "Laboratory"]).describe("Type"),
  duration: z.number().describe("Duration // eg. 1"),
  professors: z.array(z.number()),
  groups: z.array(z.number()),
});

export default function ManageLecturesDialog(props: ManageLecturesDialogProps) {
  const { toast } = useToast();
  const ctx = api.useContext();
  const lectures = api.course.getLectures.useQuery({ id: props.id });
  const newLecture = api.course.createLecture.useMutation({
    onSuccess: () => ctx.course.getLectures.invalidate(),
  });
  const updateLecture = api.course.updateLecture.useMutation({
    onSuccess: () => ctx.course.getLectures.invalidate(),
  });
  const deleteLecture = api.course.deleteLecture.useMutation({
    onSuccess: () => ctx.course.getLectures.invalidate(),
  });
  const loadingData = useMemo(
    () => lectures.isLoading || lectures.data === undefined,
    [lectures.isLoading, lectures.data]
  );

  function handleAddNew() {
    newLecture.mutate({
      id: props.id,
    });
  }

  function handleUpdate(id: number, data: z.infer<typeof lectureSchema>) {
    const t = toast({
      title: "Updating Lecture",
      description: "Updating Lecture, please wait",
      duration: 0,
    });
    updateLecture.mutate({ id, data });
    t.update({
      id: t.id,
      description: "Lecture updated successfully",
      duration: 1000,
    });
  }

  function handleDelete(id: number) {
    const t = toast({
      title: "Deleting Lecture",
      description: "Deleting Lecture, please wait",
      duration: 0,
    });
    deleteLecture.mutate({ id });
    t.update({
      id: t.id,
      description: "Lecture deleted successfully",
      duration: 1000,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <Clipboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="min-w-[50%]"
      >
        <DialogTitle>Manage Lectures</DialogTitle>

        {loadingData && (
          <div className="translate-x-[50%] translate-y-[50%]">
            <LoadingSpinner />
          </div>
        )}

        {!loadingData && (
          <div className="grid grid-cols-3 gap-2">
            {lectures.data?.map((item) => {
              return (
                <div key={item.id} className="rounded-md border p-2">
                  <CustomForm
                    defaultValues={{ ...item, professors: [], groups: [] }}
                    schema={lectureSchema}
                    onSubmit={(data) => handleUpdate(item.id, data)}
                    renderAfter={(vars) => (
                      <>
                        <hr className="mb-2" />
                        <div className="flex flex-row-reverse justify-between gap-2">
                          <Button size="sm" onClick={() => vars.submit()}>
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  />
                </div>
              );
            })}
          </div>
        )}

        {!loadingData && lectures.data?.length === 0 && (
          <div className="text-center text-xl">No Lectures</div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
          <Button onClick={() => handleAddNew()}>Add New</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

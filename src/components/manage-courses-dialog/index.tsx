import { DialogClose } from "@radix-ui/react-dialog";
import { type RowSelectionState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CourseTable from "~/components/manage-courses-dialog/course-table";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

export default function ManageCoursesDialog() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data: courses, isLoading: coursesLoading } =
    api.course.getAll.useQuery();

  useEffect(() => {
    const selectionStr = window.localStorage.getItem("rowSelection");

    try {
      setRowSelection(JSON.parse(selectionStr ?? "{}") as RowSelectionState); // good enough
    } catch (e) {
      console.error(e);
    }
  }, [setRowSelection]);

  if (coursesLoading) {
    return <div>Loading...</div>;
  }

  function onSave() {
    // FUTURE: this could be a context just to provide info to more components
    window.localStorage.setItem("rowSelection", JSON.stringify(rowSelection));

    toast({
      title: "Course preferences saved",
      description: "The course preferences have been saved successfully.",
      duration: 1500,
    });

    setDialogOpen(false);
  }

  return (
    <Dialog modal open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Manage
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[80%]">
        <DialogHeader>
          <DialogTitle>Manage Courses</DialogTitle>
        </DialogHeader>

        <div className="h-[500px]">
          <CourseTable
            data={courses ?? []}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
          <Button onClick={() => onSave()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

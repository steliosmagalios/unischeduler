import { DialogClose } from "@radix-ui/react-dialog";
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
import { api } from "~/utils/api";

export default function ManageCoursesDialog() {
  const { data: courses, isLoading: coursesLoading } =
    api.course.getAll.useQuery();

  if (coursesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog modal>
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
          <CourseTable data={courses ?? []} />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

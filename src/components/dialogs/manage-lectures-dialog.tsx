import { zodResolver } from "@hookform/resolvers/zod";
import { type Group, type Lecture, type User } from "@prisma/client";
import { Clipboard } from "lucide-react";
import { useMemo } from "react";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingSpinner } from "~/components/loader";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/utils/api";

type ManageLecturesDialogProps = {
  id: number;
  groups: Group[] | undefined;
  professors: User[] | undefined;
};

export default function ManageLecturesDialog(props: ManageLecturesDialogProps) {
  const lectures = api.course.getLectures.useQuery({ id: props.id });
  const isLoading = useMemo(
    () => lectures.isLoading || !props.groups || !props.professors,
    [lectures.isLoading, props.groups, props.professors]
  );

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

        {isLoading ? (
          <div className="translate-x-[50%] translate-y-[50%]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid w-full grid-cols-3">
            {lectures.data?.map((lecture) => (
              <LectureCard
                key={lecture.id}
                initialValues={lecture}
                professors={props.professors}
                groups={props.groups}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const lectureSchema = z.object({
  name: z.string(),
  duration: z.number(),
  type: z.enum(["Auditorium", "Laboratory"]),
  professors: z.array(z.number()),
  groups: z.array(z.number()),
});

type LectureExtended = Lecture & {
  professors: { id: number }[];
  groups: { id: number }[];
};

type LectureCardProps = {
  initialValues: LectureExtended;
  professors: User[] | undefined;
  groups: Group[] | undefined;
};

function LectureCard(props: LectureCardProps) {
  const { professors = [], groups = [] } = props;
  const ctx = api.useContext();
  const updateLectureMutation = api.course.updateLecture.useMutation({
    onSuccess: () => ctx.course.getLectures.invalidate(),
  });
  const form = useForm({
    defaultValues: props.initialValues,
    resolver: zodResolver(lectureSchema),
  });

  function handleSumbit(data: LectureExtended) {
    updateLectureMutation.mutate({
      id: props.initialValues?.id,
      data: {
        ...data,
        professors: data.professors.map((p) => p.id),
        groups: data.groups.map((p) => p.id),
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={() => void form.handleSubmit(handleSumbit)}>
        <Label>Name</Label>
        <Input {...form.register("name")} />
        <Label>Duration</Label>
        <Input type="number" {...form.register("duration")} />
        <Label>Type</Label>
        <Select {...form.register("type")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"Auditorium"}>Auditorium</SelectItem>
            <SelectItem value={"Laboratory"}>Laboratory</SelectItem>
          </SelectContent>
        </Select>
        <SelectMultiple label="Professors">
          {professors.map((p) => (
            <SelectItem key={p.id} value={p.id.toString()}>
              {p.firstName} {p.lastName}
            </SelectItem>
          ))}
        </SelectMultiple>
        <SelectMultiple label="Groups">
          {groups.map((g) => (
            <SelectItem key={g.id} value={g.id.toString()}>
              {g.name}
            </SelectItem>
          ))}
        </SelectMultiple>
        <FormField
          name="type"
          control={form.control}
          render={() => <SelectSingle />}
        />

        <div className="flex justify-end space-x-2">
          <Button size="sm" variant="destructive">
            Delete
          </Button>
          <Button size="sm">Save</Button>
        </div>
      </form>
    </Form>
  );
}

type SelectMultipleProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  children?: React.ReactNode;
};

function SelectMultiple(props: SelectMultipleProps) {
  return (
    <FormItem>
      {props.label && <Label>{props.label}</Label>}
      <Select>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-32">{props.children}</ScrollArea>
        </SelectContent>
      </Select>
      <div></div>
    </FormItem>
  );
}

type SelectSingleProps = {
  label?: string;
};

function SelectSingle(props: SelectSingleProps) {
  return (
    <FormItem>
      <FormLabel>{props.label}</FormLabel>
      <FormControl>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent></SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

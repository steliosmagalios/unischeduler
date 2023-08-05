import { buildClerkProps } from "@clerk/nextjs/server";
import { type Group, type Lecture, type User } from "@prisma/client";
import { Trash } from "lucide-react";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import { z } from "zod";
import DashboardLayout from "~/components/dashboard-layout";
import CustomForm, { MultiselectSchema } from "~/components/form/custom-form";
import { LoadingPage } from "~/components/loader";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import getCurrentUser from "~/utils/get-current-user";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getCurrentUser(ctx);

  if (user === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (user.role !== "Admin") {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    // Visit this in the future
    props: {
      courseId: parseInt(ctx.query.id as string) ?? null,
      userId: user.externalId,
      ...buildClerkProps(ctx.req),
    },
  };
};

type PageProps = {
  courseId: number;
  userId: string;
};

export default function EditLecturesPage(props: PageProps) {
  const ctx = api.useContext();
  const { toast } = useToast();
  const { data: lectures, isLoading: lecturesLoading } =
    api.course.getLectures.useQuery({
      id: props.courseId,
    });
  const { data: professors, isLoading: professorsLoading } =
    api.user.getProfessors.useQuery();
  const { data: groups, isLoading: groupsLoading } =
    api.group.getAll.useQuery();

  const createLecture = api.course.createLecture.useMutation({
    onSuccess: () => ctx.course.getLectures.invalidate(),
  });

  if (
    lecturesLoading ||
    lectures === undefined ||
    professorsLoading ||
    professors === undefined ||
    groupsLoading ||
    groups === undefined
  ) {
    return <LoadingPage />;
  }

  function handleAddNew() {
    const createToast = toast({
      title: "Creating Lecture",
      description: "Creating lecture, please wait...",
    });

    createLecture.mutate({
      id: props.courseId,
    });

    createToast.update({
      id: createToast.id,
      description: "Lecture created successfully!",
      duration: 1000,
    });
  }

  return (
    <DashboardLayout
      label="Lectures"
      userId={props.userId}
      className="flex max-h-screen flex-col gap-2"
    >
      <h2 className="text-3xl font-semibold">Lectures</h2>
      <div className="flex-grow overflow-auto">
        <div className="grid grid-cols-3 gap-2">
          {lectures.map((item) => (
            <LectureCard
              key={item.id}
              data={item}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              professors={professors}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              groups={groups}
            />
          ))}

          {lectures.length === 0 && (
            <span className="col-span-full text-center text-xl">
              No lectures available
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-row-reverse gap-2">
        <Button onClick={() => handleAddNew()}>Add New</Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/courses"> Go Back</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
}

type LectureCardProps = {
  data: Lecture & {
    professors: {
      id: number;
    }[];
    groups: {
      id: number;
    }[];
  };
  professors: User[];
  groups: Group[];
};

const lectureFormSchema = z.object({
  name: z.string().describe("Name // eg. Theory"),
  type: z.enum(["Auditorium", "Laboratory"]).describe("Type"),
  duration: z.number().describe("Duration // eg. 1"),
  professors: MultiselectSchema.describe("Professors"),
  groups: MultiselectSchema.describe("Groups"),
});

function LectureCard(props: LectureCardProps) {
  const { toast } = useToast();
  const ctx = api.useContext();
  const updateLecture = api.course.updateLecture.useMutation({
    onSuccess: () => ctx.course.getLectures.invalidate(),
  });
  const deleteLecture = api.course.deleteLecture.useMutation({
    onSuccess: () => ctx.course.getLectures.invalidate(),
  });

  function handleDelete() {
    const deleteToast = toast({
      title: "Deleting Lecture",
      description: "Deleting lecture, please wait...",
    });

    deleteLecture.mutate({ id: props.data.id });

    deleteToast.update({
      id: deleteToast.id,
      description: "Lecture deleted successfully!",
      duration: 1000,
    });
  }

  function handleUpdate(data: z.infer<typeof lectureFormSchema>) {
    const updateToast = toast({
      title: "Updating Lecture",
      description: "Updating lecture, please wait...",
    });

    updateLecture.mutate({ id: props.data.id, data });

    updateToast.update({
      id: updateToast.id,
      description: "Lecture updated successfully!",
      duration: 1000,
    });
  }

  return (
    <div className="rounded-md border p-2">
      <CustomForm
        onSubmit={handleUpdate}
        schema={lectureFormSchema}
        defaultValues={{
          ...props.data,
          professors: props.data.professors.map((i) => i.id),
          groups: props.data.groups.map((i) => i.id),
        }}
        renderAfter={() => (
          <div className="mt-2 flex justify-between">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => handleDelete()}
            >
              <span className="sr-only">Delete item</span>
              <Trash className="h-4 w-4" />
            </Button>

            <Button type="submit">Save</Button>
          </div>
        )}
        props={{
          professors: {
            data: props.professors.map((i) => ({
              value: i.id.toString(),
              label: `${i.firstName ?? ""} ${i.lastName ?? ""}` ?? i.email,
            })),
          },
          groups: {
            data: props.groups.map((i) => ({
              value: i.id.toString(),
              label: i.name,
            })),
          },
        }}
      />
    </div>
  );
}

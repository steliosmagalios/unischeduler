import { useClerk } from "@clerk/nextjs";
import { buildClerkProps } from "@clerk/nextjs/server";
import { LayoutDashboardIcon, MoonIcon, SunIcon } from "lucide-react";
import { type GetServerSideProps } from "next";
import { useTheme } from "next-themes";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AvailabilityDialog from "~/components/availability-dialog";
import { LoadingPage } from "~/components/loader";
import ManageCoursesDialog from "~/components/manage-courses-dialog";
import Timetable from "~/components/timetable";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/utils/api";
import { TIMESLOTS, type CurrentTimetable } from "~/utils/constants";
import getCurrentUser from "~/utils/get-current-user";

// eslint-disable-next-line @typescript-eslint/require-await
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

  return {
    // Visit this in the future
    props: { userId: user.externalId, ...buildClerkProps(ctx.req) },
  };
};

export default function Profile({ userId }: { userId: string }) {
  const { data: userData, isLoading: isUserLoading } = api.user.get.useQuery({
    id: userId,
  });
  const { data: timetable, isLoading: timetableLoading } =
    api.timetable.getPublished.useQuery();

  if (isUserLoading || userData === undefined || timetableLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Head>
        <title>Profile | UniScheduler</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen flex-col gap-4 overflow-hidden pb-4">
        <header className="h-14 border-b">
          <div className="container mx-auto flex h-full items-center justify-between">
            <h1 className="text-4xl font-bold">UniScheduler</h1>

            <div className="flex items-center gap-2">
              <p>
                Welcome back,{" "}
                <span className="capitalize">
                  {userData.firstName?.toLocaleLowerCase()}
                </span>
              </p>
              <AvatarMenu
                canAccessDashboard={userData.role === "Admin"}
                avatarUrl={userData.imageUrl}
                fallback={
                  `${userData.firstName?.[0] ?? ""}${
                    userData.lastName?.[0] ?? ""
                  }` ?? undefined
                }
              />
            </div>
          </div>
        </header>

        <main className="container mx-auto grid h-full flex-grow grid-cols-12 gap-4 overflow-hidden">
          {/* Availability and daily schedule */}
          <div className="col-span-3 flex h-full flex-col gap-4 overflow-hidden">
            {userData.role === "Professor" && (
              <AvailabilityDialog
                externalId={userId}
                userId={userData.id}
                initialValues={userData.availability}
              />
            )}
            {/* Daily schedule */}
            <div className="flex flex-grow flex-col gap-2 overflow-hidden">
              <h2 className="text-center text-2xl font-semibold">
                Today&apos;s Lectures
              </h2>
              <div className="flex flex-grow flex-col gap-2 overflow-auto">
                <LectureCardList timetable={timetable} />
              </div>
            </div>
          </div>

          {/* User timetable */}
          <div className="col-span-9 h-full overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Weekly schedule</h2>
              <ManageCoursesDialog />
            </div>
            <hr className="mb-2" />
            {timetable === null || timetable === undefined ? (
              <span className="text-xl">No timetable published yet</span>
            ) : (
              <Timetable timetable={timetable} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

type LectureCardListProps = {
  timetable: CurrentTimetable | null;
};

function LectureCardList(props: LectureCardListProps) {
  // Keep only today's lectures
  const [coursesToKeep, setCoursesToKeep] = useState<number[] | null>(null);
  const todayTasks = useMemo(() => {
    const today = new Date().getDay() - 1;
    // const today = 0;

    const filteredToday = props.timetable?.tasks.filter(
      (task) => Math.floor(task.startTime / TIMESLOTS.length) === today
    );

    return filteredToday?.filter(
      (t) => coursesToKeep?.includes(t.courseId) ?? true
    );
  }, [props.timetable, coursesToKeep]);

  useEffect(() => {
    if (window === undefined) return;

    // Fetch the courses to keep
    const courseObj = JSON.parse(
      localStorage.getItem("rowSelection") || "{}"
    ) as Record<number | string, true>;

    setCoursesToKeep(
      Object.keys(courseObj)
        .filter((k) => !isNaN(Number(k)))
        .map(Number)
    );
  }, []);

  if (todayTasks === undefined || todayTasks.length === 0) {
    return (
      <div className="rounded-sm border bg-muted p-3 dark:bg-neutral-900">
        <p className="text-center font-semibold">
          You have no lectures today. Enjoy your day off!
        </p>
      </div>
    );
  }

  return (
    <>
      {todayTasks.map((t, idx) => (
        <LectureCard
          key={idx}
          duration={t.lecture.duration}
          startTime={t.startTime}
          lecture={t.lecture.name}
          room={t.roomName}
          title={t.courseName}
        />
      ))}
    </>
  );
}

type LectureCardProps = {
  title: string;
  room: string;
  lecture: string;
  startTime: number;
  duration: number;
};

function LectureCard(props: LectureCardProps) {
  const { startTime, duration } = props;
  const formattedTime = useMemo(
    () =>
      `${startTime.toString().padStart(2, "0")}:00 - ${(startTime + duration)
        .toString()
        .padStart(2, "0")}:00`,
    [startTime, duration]
  );

  return (
    <div className="rounded-sm border bg-muted p-3 dark:bg-neutral-900">
      <p className="text-xl font-bold line-clamp-1">{props.title}</p>
      <p>{props.lecture}</p>
      <p className="text-sm italic text-muted-foreground">
        {props.room} <span className="font-bold">&#8226;</span> {formattedTime}
      </p>
    </div>
  );
}

type AvatarMenuProps = {
  canAccessDashboard: boolean;
  avatarUrl: string | null;
  fallback?: string;
};

function AvatarMenu(props: AvatarMenuProps) {
  const { theme, setTheme } = useTheme();
  const clerk = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={props.avatarUrl ?? undefined} />
          <AvatarFallback>{props.fallback ?? "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={12} className="w-56">
        {props.canAccessDashboard && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex gap-2">
                <LayoutDashboardIcon className="h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light" className="flex gap-2">
            <SunIcon className="h-4 w-4" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="flex gap-2">
            <MoonIcon className="h-4 w-4" />
            Dark
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive"
          onClick={() => void clerk.signOut()}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

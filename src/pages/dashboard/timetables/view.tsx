import { buildClerkProps } from "@clerk/nextjs/server";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import DashboardLayout from "~/components/dashboard-layout";
import { LoadingPage } from "~/components/loader";
import Timetable from "~/components/timetable";
import { Button } from "~/components/ui/button";
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
      timetableId: parseInt(ctx.query.id as string),
      userId: user.externalId,
      ...buildClerkProps(ctx.req),
    },
  };
};

type PageProps = { userId: string; timetableId: number };

export default function GeneratePage({ userId, timetableId }: PageProps) {
  const { data, isLoading } = api.timetable.get.useQuery({ id: timetableId });

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <DashboardLayout
      label="View Timetable"
      userId={userId}
      className="flex flex-col gap-2"
    >
      <h2 className="text-3xl font-bold">View Timetable</h2>

      <div className="flex-grow">
        <Timetable timetable={data} />
      </div>

      <div className="flex flex-shrink-0 flex-row-reverse gap-2">
        <Button asChild variant="outline">
          <Link href="/dashboard/timetables">Go Back</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
}

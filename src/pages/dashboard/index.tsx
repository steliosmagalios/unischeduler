import { buildClerkProps } from "@clerk/nextjs/server";
import { type GetServerSideProps } from "next";
import DashboardLayout from "~/components/dashboard-layout";
import { LoadingPage } from "~/components/loader";
import Timetable from "~/components/timetable";
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
    props: { userId: user.externalId, ...buildClerkProps(ctx.req) },
  };
};

function ResourceCard(props: { label: string; count: number }) {
  return (
    <div className="flex h-28 flex-1 flex-col justify-between rounded-md border bg-gradient-to-br from-transparent from-30% via-70% px-4 py-2 font-bold shadow-xl dark:border-0 dark:via-neutral-900 dark:to-neutral-800 dark:shadow-none">
      <span className="text-2xl capitalize">{props.label}</span>
      <span className="self-end pl-4 text-3xl">{props.count}</span>
    </div>
  );
}

export default function DashboardHome({ userId }: { userId: string }) {
  const { data, isLoading } = api.statistics.get.useQuery();
  const { data: timetable, isLoading: timetableLoading } =
    api.timetable.getPublished.useQuery();

  if (isLoading || data === undefined || timetableLoading) {
    return <LoadingPage />;
  }

  return (
    <DashboardLayout label="Dashboard" userId={userId}>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-semibold">Available Resources</h2>
          <hr className="mb-2" />

          <div className="flex gap-2">
            {Object.keys(data).map((k) => (
              <ResourceCard
                key={k}
                label={k}
                count={data[k as keyof typeof data] ?? NaN}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold">Current timetable</h2>
          <hr className="mb-2" />
          {timetable === null || timetable === undefined ? (
            <span className="text-xl">No timetable published yet</span>
          ) : (
            <Timetable timetable={timetable} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

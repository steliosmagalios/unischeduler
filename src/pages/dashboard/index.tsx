import { buildClerkProps } from "@clerk/nextjs/server";
import { type GetServerSideProps } from "next";
import DashboardLayout from "~/components/dashboard-layout";
import Timetable from "~/components/timetable";
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

const dummyResources: Record<string, number> = {
  courses: 16,
  groups: 8,
  rooms: 4,
  users: 2,
  timetables: 1,
};

export default function DashboardHome({ userId }: { userId: string }) {
  return (
    <DashboardLayout label="Dashboard" userId={userId}>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-semibold">Available Resources</h2>
          <hr className="mb-2" />

          <div className="flex gap-2">
            {Object.keys(dummyResources).map((k) => (
              <div key={k} className="h-28 flex-1 bg-violet-800 font-bold">
                {k}: {dummyResources[k]}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold">Current timetable</h2>
          <hr className="mb-2" />
          <Timetable />
        </div>
      </div>
    </DashboardLayout>
  );
}

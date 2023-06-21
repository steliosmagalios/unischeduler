import { type GetServerSideProps } from "next";
import DashboardLayout from "~/components/dashboard-layout";
import Timetable from "~/components/timetable";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  // Check for authenticated user
  if (session === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Only admins can enter
  // TODO: Add toasts to other pages
  if (session.user.role !== "Admin") {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

const dummyResources: Record<string, number> = {
  courses: 16,
  groups: 8,
  rooms: 4,
  users: 2,
  timetables: 1,
};

export default function DashboardHome() {
  return (
    <DashboardLayout label="Dashboard">
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

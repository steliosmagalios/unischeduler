import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import DashboardLayout from "~/components/dashboard-layout";
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

const RESOURCES = ["courses", "groups", "rooms", "users", "timetables"];

export default function ResourcePage() {
  const router = useRouter();
  const resource = useMemo(
    () => router.query.resource as string,
    [router.query]
  );

  // TODO: Handle case
  if (!RESOURCES.includes(resource)) {
    return <>No Resource</>;
  }

  return (
    <DashboardLayout>
      <pre>{JSON.stringify(resource, null, 2)}</pre>
    </DashboardLayout>
  );
}

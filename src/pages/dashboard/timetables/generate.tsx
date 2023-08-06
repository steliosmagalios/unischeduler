import { buildClerkProps } from "@clerk/nextjs/server";
import { type GetServerSideProps } from "next";
import DashboardLayout from "~/components/dashboard-layout";
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
  return (
    <DashboardLayout label="Generate Timetable" userId={userId}>
      {timetableId.toString()}
    </DashboardLayout>
  );
}

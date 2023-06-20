import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Timetable from "~/components/timetable";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

const dummyCourse = {
  name: "Course Name (Dummy)",
  startTime: 18,
  duration: 3,
  room: "Aud 13",
};

export default function Profile() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Profile | UniScheduler</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen flex-col gap-4 overflow-hidden pb-4">
        <header className="h-14 border-b">
          <div className="container mx-auto flex h-full items-center justify-between px-24">
            <h1 className="text-4xl font-bold">UniScheduler</h1>

            <div className="flex items-center gap-2">
              <Link className="font-semibold text-teal-300" href="#">
                Go to Dashboard
              </Link>
              <button className="rounded-md bg-red-500 px-3 py-2 font-semibold">
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto grid h-full flex-grow grid-cols-12 gap-4 overflow-hidden px-24">
          {/* User card and daily schedule */}
          <div className="col-span-3 flex h-full flex-col gap-4 overflow-hidden">
            {/* User card */}
            <div className="flex gap-2">
              <Image
                className="rounded-md"
                src={session?.user.image || ""}
                alt="user profile picture"
                width={64}
                height={64}
              />
              <div className="my-0.5 flex flex-col justify-between truncate">
                <p className="truncate text-lg font-semibold">
                  {session?.user.name}
                </p>
                <span className="self-start rounded-full bg-green-800 px-4 text-sm font-semibold uppercase">
                  {session?.user.role}
                </span>
              </div>
            </div>

            {/* Daily schedule */}
            <div className="flex flex-grow flex-col gap-2 overflow-hidden">
              <div>
                <h2 className="text-lg font-semibold">{"Today's courses"}</h2>
                <hr />
              </div>
              <div className="flex flex-grow flex-col gap-2 overflow-auto">
                {Array.from(Array(7)).map((_, idx) => (
                  <div key={idx} className="rounded-sm bg-indigo-700 p-2">
                    <p className="text-xl font-semibold">{dummyCourse.name}</p>
                    <p className="text-sm italic text-gray-300">
                      {dummyCourse.room}{" "}
                      <span className="font-bold">&#8226;</span>{" "}
                      {dummyCourse.startTime}:00 -{" "}
                      {dummyCourse.startTime + dummyCourse.duration}:00
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User timetable */}
          <div className="col-span-9 h-full overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Weekly schedule</h2>
              <button className="mr-4 text-sm text-blue-300">Edit</button>
            </div>
            <hr className="mb-2" />
            <Timetable />
          </div>
        </main>
      </div>
    </>
  );
}

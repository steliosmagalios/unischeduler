import { SignOutButton } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { LoadingPage } from "~/components/loader";
import { api } from "~/utils/api";
import { capitalize } from "~/utils/lib";
import { cn } from "~/utils/shad-utils";
import UserCard from "../user-card";
import NavLink from "./nav-link";

type DashboardLayoutProps = {
  label?: string;
  children: React.ReactNode;
  userId: string;
  className?: string;
};

const navRoutes = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/dashboard/courses",
    label: "Courses",
  },
  {
    href: "/dashboard/groups",
    label: "Groups",
  },
  {
    href: "/dashboard/rooms",
    label: "Rooms",
  },
  {
    href: "/dashboard/users",
    label: "Users",
  },
  {
    href: "/dashboard/timetables",
    label: "Timetables",
  },
];

export default function DashboardLayout(props: DashboardLayoutProps) {
  const { data: userData, isLoading: isUserLoading } = api.user.get.useQuery({
    id: props.userId,
  });
  const router = useRouter();

  if (isUserLoading || userData === undefined) {
    return <LoadingPage />;
  }

  return (
    <>
      <Head>
        <title>
          {`${props.label ? capitalize(props.label) + " | " : ""}UniScheduler`}
        </title>
      </Head>

      <div className="grid h-screen max-h-screen grid-cols-12 gap-4 overflow-hidden">
        <aside className="col-span-2 flex h-full max-h-screen flex-col gap-2 border-r p-2 pr-4">
          <h1 className="text-center text-4xl font-bold">UniScheduler</h1>

          <nav className="flex flex-grow flex-col gap-2 px-2">
            {navRoutes.map((route) => (
              <NavLink
                key={route.href}
                {...route}
                active={(() => router.asPath === route.href)()}
              />
            ))}
          </nav>

          <div>
            <UserCard user={userData} />
            <div className="flex justify-evenly gap-2">
              <Link href="/profile" className="text-blue-500">
                Profile
              </Link>
              <span className="text-red-500">
                <SignOutButton />
              </span>
            </div>
          </div>
        </aside>

        <main
          className={cn(
            "col-span-10 h-full max-h-screen overflow-auto p-4 pl-0",
            props.className
          )}
        >
          {props.children}
        </main>
      </div>
    </>
  );
}

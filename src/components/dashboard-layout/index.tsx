import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import UserCard from "../user-card";

type DashboardLayoutProps = {
  children: React.ReactNode;
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
  const { data: session } = useSession();

  return (
    <div className="grid h-screen max-h-screen grid-cols-12 gap-4 overflow-hidden">
      <aside className="col-span-2 flex h-full max-h-screen flex-col gap-2 border-r p-2 pr-4">
        <h1 className="text-center text-4xl font-bold">UniScheduler</h1>

        <nav className="flex flex-grow flex-col gap-2 px-2">
          {navRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-md bg-blue-300 p-2 text-lg"
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div>
          <UserCard session={session} />
          <div className="flex justify-evenly gap-2">
            <button className="text-blue-500">Profile</button>
            <button className="text-red-500">Logout</button>
          </div>
        </div>
      </aside>

      <main className="col-span-10 h-full max-h-screen overflow-auto p-4 pl-0">
        {props.children}
      </main>
    </div>
  );
}

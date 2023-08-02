import { type User } from "@prisma/client";
import Image from "next/image";

export default function UserCard(props: { user: User }) {
  if (props.user === null) {
    return <>No user</>;
  }

  return (
    <div className="flex gap-2">
      <Image
        className="rounded-md"
        src={props.user.imageUrl || ""}
        alt="user profile picture"
        width={64}
        height={64}
      />
      <div className="my-0.5 flex flex-col justify-between truncate">
        <p className="truncate text-lg font-semibold line-clamp-1">
          {props.user.firstName} {props.user.lastName}
        </p>
        <span className="self-start rounded-full bg-green-800 px-4 text-sm font-semibold uppercase">
          {props.user.role}
        </span>
      </div>
    </div>
  );
}

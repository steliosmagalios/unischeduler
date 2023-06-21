import { type Session } from "next-auth";
import Image from "next/image";

export default function UserCard(props: { session: Session | null }) {
  if (props.session === null) {
    return <>No user</>;
  }

  return (
    <div className="flex gap-2">
      <Image
        className="rounded-md"
        src={props.session?.user.image || ""}
        alt="user profile picture"
        width={64}
        height={64}
      />
      <div className="my-0.5 flex flex-col justify-between truncate">
        <p className="truncate text-lg font-semibold">
          {props.session?.user.name}
        </p>
        <span className="self-start rounded-full bg-green-800 px-4 text-sm font-semibold uppercase">
          {props.session?.user.role}
        </span>
      </div>
    </div>
  );
}

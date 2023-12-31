import Link from "next/link";

type NavLinkProps = {
  href: string;
  label: string;
  icon?: string;
  active?: boolean;
};

export default function NavLink(props: NavLinkProps) {
  return (
    <Link
      data-active={!!props.active || undefined} // this is awful, plz fix
      href={props.href}
      className="rounded-md from-muted from-40% p-2 data-[active]:bg-gradient-to-r data-[active]:font-bold dark:from-neutral-700 dark:from-0%"
    >
      {props.label}
    </Link>
  );
}

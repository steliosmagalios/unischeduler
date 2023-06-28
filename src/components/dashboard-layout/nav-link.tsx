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
      className="p-2 data-[active]:border-l-4 data-[active]:border-white data-[active]:bg-neutral-500/50 data-[active]:font-bold"
    >
      {props.label}
    </Link>
  );
}

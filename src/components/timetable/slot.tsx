import { cn } from "~/utils/shad-utils";

// This needs to exist because tailwind
const heightMap: Record<number, string> = {
  1: `h-[calc(48px)]`,
  2: `h-[calc(96px+1px)]`,
  3: `h-[calc(144px+2px)]`,
  4: `h-[calc(192px+3px)]`,
  5: `h-[calc(240px+4px)]`,
};

type SlotProps = {
  multiplier?: number;
  children?: string;
  className?: string;
};

export default function Slot(props: SlotProps) {
  const { multiplier = 1, className, children } = props;

  return (
    <div
      className={cn(
        heightMap[multiplier] ?? heightMap[1],
        className,
        "flex flex-col items-center justify-center bg-slate-900 px-4"
      )}
    >
      <p className="text-center line-clamp-3">{children}</p>
      {/* <p className="text-sm text-muted-foreground">Subtext</p> */}
    </div>
  );
}

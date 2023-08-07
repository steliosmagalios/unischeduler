import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTrigger } from "~/components/ui/dialog";
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
  subtext?: string;
};

export default function Slot(props: SlotProps) {
  const { multiplier = 1, className, children, subtext } = props;

  return (
    <div
      className={cn(
        heightMap[multiplier] ?? heightMap[1],
        className,
        "flex flex-col items-center justify-center bg-slate-900 px-4"
      )}
    >
      <p
        className={cn(
          "text-center line-clamp-3",
          multiplier === 1 && "line-clamp-1"
        )}
      >
        {children}
      </p>
      <p
        className={cn(
          "text-center text-sm italic text-muted-foreground line-clamp-2",
          multiplier === 1 && "line-clamp-1"
        )}
      >
        {subtext}
      </p>
    </div>
  );
}

export function DetailsSlot(props: SlotProps) {
  return (
    <Dialog modal>
      <DialogTrigger>
        <Slot {...props} />
      </DialogTrigger>

      <DialogContent>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
}

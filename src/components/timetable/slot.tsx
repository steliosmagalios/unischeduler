import { Dialog } from "@radix-ui/react-dialog";
import { useMemo } from "react";
import { DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { TIMESLOTS, type TimetableTask } from "~/utils/constants";
import { boundTime } from "~/utils/lib";
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
        "flex flex-col items-center justify-center bg-muted px-4 dark:bg-neutral-900"
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

type DetailsSlotProps = {
  task: TimetableTask;
} & Pick<SlotProps, "className" | "multiplier">;

export function DetailsSlot(props: DetailsSlotProps) {
  const formattedTime = useMemo(() => {
    const startTime =
      (boundTime(props.task.startTime, TIMESLOTS.length) % TIMESLOTS.length) +
      TIMESLOTS[0] -
      1;
    const endTime =
      boundTime(
        props.task.startTime + props.task.lecture.duration,
        TIMESLOTS.length
      ) +
      TIMESLOTS[0] -
      1;

    return `${startTime.toString().padStart(2, "0")}:00 - ${endTime
      .toString()
      .padStart(2, "0")}:00`;
  }, [props.task.startTime, props.task.lecture.duration]);

  return (
    <Dialog modal>
      <DialogTrigger>
        <Slot
          subtext={`${props.task.lecture.name}, ${props.task.roomName}`}
          {...props}
        >
          {props.task.courseName}
        </Slot>
      </DialogTrigger>

      <DialogContent>
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="text-xl font-bold">{props.task.courseName}</h2>
            <h3 className="pl-2 text-sm italic text-muted-foreground">
              {props.task.roomName} <span className="font-bold">&#8226;</span>{" "}
              {formattedTime}
            </h3>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Professors</h2>
            <p className="pl-2 text-muted-foreground">
              {props.task.lecture.professor}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Groups</h2>
            <p className="pl-2 text-muted-foreground">
              {props.task.lecture.groups}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

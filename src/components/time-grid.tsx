import { useCallback } from "react";
import { DAYS, TIMESLOTS } from "~/utils/constants";
import { cn } from "~/utils/shad-utils";

type TimeGridProps = {
  value: number[];
  onClick?: (timeslot: number) => void;
  display?: boolean;

  className?: string;
};

export default function TimeGrid(props: TimeGridProps) {
  return (
    <div className={cn(props.className, "mt-2 flex flex-col gap-2")}>
      {DAYS.map((day, idx) => (
        <div key={day} className="grid grid-cols-12 items-center gap-2">
          <span className="col-span-1 text-right">{day.substring(0, 3)}</span>
          <TimeRow
            disabled={props.display}
            onClick={props.onClick}
            data={
              props.value.filter(
                (i) => Math.floor((i - 1) / TIMESLOTS.length) === idx
              ) ?? []
            }
            offset={idx * TIMESLOTS.length}
          />
        </div>
      ))}
    </div>
  );
}

type TimeRowProps = {
  data: number[];
  offset: number;
  onClick?: (timeslot: number) => void;
  disabled?: boolean;
};

function TimeRow(props: TimeRowProps) {
  const isEnabled = useCallback(
    (timeslot: number) => props.data.includes(timeslot - 7 + props.offset),
    [props.data, props.offset]
  );

  return (
    <div className="col-span-11 flex justify-evenly self-stretch overflow-hidden rounded-md border ">
      {TIMESLOTS.map((timeslot) => (
        <button
          disabled={props.disabled}
          type="button"
          key={timeslot}
          className={cn(
            "flex h-8 w-full items-center justify-center enabled:hover:bg-blue-500 disabled:cursor-default",
            isEnabled(timeslot) &&
              "bg-blue-500 text-white enabled:hover:bg-red-500"
          )}
          onClick={() => props.onClick?.(timeslot - 7 + props.offset)}
        >
          {timeslot}
        </button>
      ))}
    </div>
  );
}

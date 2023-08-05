import { useTsController } from "@ts-react/form";
import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { cn } from "~/utils/shad-utils";

const dayInititals = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export default function AvailabilityInput() {
  const { field } = useTsController<Array<number>>();

  function handleSelectAll() {
    field.onChange(
      Array.from(
        { length: dayInititals.length * timeslots.length },
        (_, i) => i + 1
      )
    );
  }

  function handleSelectNone() {
    field.onChange([]);
  }

  function handleSlotClick(timeslot: number) {
    if (field.value?.includes(timeslot)) {
      field.onChange(
        field.value?.filter((slot) => slot !== timeslot).sort() ?? []
      );

      return;
    }

    field.onChange([...(field.value ?? []), timeslot].sort());
  }

  return (
    <div>
      <Label>Availability</Label>
      <div className="mt-2 flex flex-col gap-2 rounded-md border p-2">
        {dayInititals.map((day, idx) => (
          <div key={day} className="grid grid-cols-12 items-center gap-2">
            <span className="col-span-1 text-right">{day}</span>
            <Row
              onClick={handleSlotClick}
              data={
                field.value?.filter(
                  (i) => Math.floor((i - 1) / timeslots.length) === idx
                ) ?? []
              }
              offset={idx * timeslots.length}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex flex-row-reverse gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleSelectAll}
        >
          Select All
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleSelectNone}
        >
          Select None
        </Button>
      </div>
    </div>
  );
}

const timeslots = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
] as const;

type RowProps = {
  data: Array<number>;
  offset: number;
  onClick?: (timeslot: number) => void;
};

function Row(props: RowProps) {
  const isEnabled = useCallback(
    (timeslot: number) => props.data.includes(timeslot - 7 + props.offset),
    [props.data, props.offset]
  );

  return (
    <div className="col-span-11 flex justify-evenly self-stretch overflow-hidden rounded-md ">
      {timeslots.map((timeslot) => (
        <button
          type="button"
          key={timeslot}
          className={cn(
            isEnabled(timeslot) && "bg-blue-500 text-white",
            `flex h-8 w-full items-center justify-center hover:bg-red-500`
          )}
          onClick={() => props.onClick?.(timeslot - 7 + props.offset)}
        >
          {timeslot}
        </button>
      ))}
    </div>
  );
}

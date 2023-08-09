import { useMemo } from "react";
import { type TData } from "~/components/timetable";
import Slot, { DetailsSlot } from "~/components/timetable/slot";
import { DAYS, TIMESLOTS, type TimetableTask } from "~/utils/constants";

type Props = {
  data: TimetableTask[];
};

export default function TimetablePanel(props: Props) {
  const parsedData = useMemo(() => {
    const currData: TData = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    };

    props.data.forEach((task) => {
      const day = DAYS[Math.floor(task.startTime / TIMESLOTS.length)];

      if (day === undefined) {
        return;
      }

      currData[day].push(task);
    });

    return currData;
  }, [props.data]);

  return (
    <>
      {DAYS.map((day, dayIdx) => {
        const dayItems = parsedData[day];

        return (
          <div key={day} className="flex flex-col gap-px">
            <Slot className="font-bold">{day}</Slot>

            {parseTimetable(
              dayItems,
              TIMESLOTS.length,
              dayIdx * (TIMESLOTS.length - 1)
            ).map((item, idx) => {
              if (!item) {
                return <Slot key={idx} />;
              }

              return (
                <DetailsSlot
                  key={idx}
                  multiplier={item.lecture.duration}
                  task={item}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export type Table = Array<TimetableTask>;

export type TableItem = {
  time: number;
  duration?: number;
  label: string;
  subtext: string;
};

function parseTimetable(
  table: Table,
  limit: number,
  offset = 0
): Array<TimetableTask | null> {
  const parsed: Array<TimetableTask | null> = [];

  for (let i = 1; i <= limit; i++) {
    const item = table.find((item) => item.startTime === i + offset);

    if (item) {
      parsed.push(item);
      i += item.lecture.duration ? item.lecture.duration - 1 : 0;
    } else {
      parsed.push(null);
    }
  }

  return parsed;
}

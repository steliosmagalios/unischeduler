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

      currData[day].push({
        time: task.startTime,
        label: task.courseName,
        subtext: `${task.lecture.name}, ${task.roomName}`,
        duration: task.lecture.duration,
      });
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
                  multiplier={item.duration}
                  subtext={item.subtext}
                >
                  {item.label}
                </DetailsSlot>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export type Table = Array<TableItem>;

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
): Array<TableItem | null> {
  const parsed: Array<TableItem | null> = [];

  for (let i = 1; i <= limit; i++) {
    const item = table.find((item) => item.time === i + offset);

    if (item) {
      parsed.push(item);
      i += item.duration ? item.duration - 1 : 0;
    } else {
      parsed.push(null);
    }
  }

  return parsed;
}

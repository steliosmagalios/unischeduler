import { useMemo } from "react";
import Slot from "~/components/timetable/slot";
import { DAYS, TIMESLOTS, type CurrentTimetable } from "~/utils/constants";

const daySlots = TIMESLOTS.length;

type TimetableProps = {
  timetable: CurrentTimetable;
};

type TData = Record<(typeof DAYS)[number], Table>;

function parseData(data: CurrentTimetable): TData {
  const finalData: TData = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  };

  data?.tasks.forEach((task) => {
    const day = DAYS[Math.floor(task.startTime / daySlots)];

    if (day === undefined) {
      return;
    }

    finalData[day].push({
      time: task.startTime,
      label: task.courseName,
      subtext: `${task.lecture.name}, ${task.roomName}`,
      duration: task.lecture.duration,
    });
  });

  return finalData;
}

export default function Timetable(props: TimetableProps) {
  const { timetable } = props;
  const parsedTimetable = useMemo(() => parseData(timetable), [timetable]);

  return (
    <div className="grid grid-cols-6 gap-px overflow-hidden rounded-md border">
      <div className="flex flex-col gap-px">
        <Slot className="font-bold">Time</Slot>

        {TIMESLOTS.map((time) => (
          <Slot key={time}>
            {`${time.toString().padStart(2, "0")}:00 - ${(time + 1)
              .toString()
              .padStart(2, "0")}:00`}
          </Slot>
        ))}
      </div>

      {DAYS.map((day, dayIdx) => {
        const dayItems = parsedTimetable[day];

        return (
          <div key={day} className="flex flex-col gap-px">
            <Slot className="font-bold">{day}</Slot>

            {parseTimetable(
              dayItems,
              TIMESLOTS.length,
              dayIdx * TIMESLOTS.length
            ).map((item, idx) => {
              if (!item) {
                return <Slot key={idx} />;
              }

              return (
                <Slot
                  key={idx}
                  multiplier={item.duration}
                  subtext={item.subtext}
                >
                  {item.label}
                </Slot>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

type Table = Array<TableItem>;
type TableItem = {
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

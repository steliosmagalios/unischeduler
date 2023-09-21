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
      const day = DAYS[Math.floor((task.startTime - 1) / TIMESLOTS.length)];

      if (day === undefined) {
        return;
      }

      currData[day].push(task);
    });

    return currData;
  }, [props.data]);

  return (
    <>
      {DAYS.map((day) => {
        const dayItems = parsedData[day];

        return (
          <div key={day} className="flex flex-col gap-px">
            <Slot className="font-bold">{day}</Slot>

            {parseTimetable(dayItems, TIMESLOTS.length).map((item, idx) => {
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
  limit: number
): Array<TimetableTask | null> {
  const parsed: Array<TimetableTask | null> = [];

  const test = table
    .map((item) => {
      const dm =
        ((item.startTime + Math.floor((item.startTime - 1) / limit)) %
          (limit + 1)) -
        1;

      console.log("dm: ", dm, "start:", item.startTime);

      return {
        item,
        dayMap: dm,
      };
    })
    .sort((a, b) => a.dayMap - b.dayMap);

  for (let i = 0; i < TIMESLOTS.length; i++) {
    const itemObj = test.find((item) => item.dayMap === i);

    if (itemObj) {
      const { item } = itemObj;

      parsed.push(item);
      i += item.lecture.duration ? item.lecture.duration - 1 : 0;
    } else {
      parsed.push(null);
    }
  }

  return parsed;
}

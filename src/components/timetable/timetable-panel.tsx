import { type TData } from "~/components/timetable";
import Slot, { DetailsSlot } from "~/components/timetable/slot";
import { DAYS, TIMESLOTS } from "~/utils/constants";

type Props = {
  data: TData;
};

export default function TimetablePanel(props: Props) {
  return (
    <>
      {DAYS.map((day, dayIdx) => {
        const dayItems = props.data[day];

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

import Slot from "~/components/timetable/slot";

const daySlots = 14;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const TIMESLOTS = Array.from(Array(daySlots).keys()).map((i) => i + 8);

type TimetableProps = {
  //
};

const items: Record<(typeof DAYS)[number], Table> = {
  Monday: [{ time: 6, label: "Constraint Logic Programming", duration: 2 }],
  Tuesday: [{ time: 16, label: "Programming Languages", duration: 3 }],
  Wednesday: [{ time: 36, label: "Procedural Programming", duration: 3 }],
  Thursday: [],
  Friday: [],
};

export default function Timetable(props: TimetableProps) {
  const {} = props;

  return (
    <div className="grid grid-cols-6 gap-px overflow-hidden rounded-md">
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
        const dayItems = items[day];

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
                <Slot key={idx} multiplier={item.duration}>
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
type TableItem = { time: number; duration?: number; label: string };

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

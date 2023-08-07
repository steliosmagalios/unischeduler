import { useMemo } from "react";
import Slot from "~/components/timetable/slot";
import TimetablePanel, {
  type Table,
} from "~/components/timetable/timetable-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DAYS, TIMESLOTS, type CurrentTimetable } from "~/utils/constants";

const daySlots = TIMESLOTS.length;

type TimetableProps = {
  timetable: CurrentTimetable;
};

export type TData = Record<(typeof DAYS)[number], Table>;

export default function Timetable(props: TimetableProps) {
  const { timetable } = props;
  const parsedTimetable = useMemo(() => parseData(timetable), [timetable]);

  return (
    <Tabs defaultValue={parsedTimetable[0]?.semester.toString() ?? ""}>
      <TabsList>
        {parsedTimetable.map((timetable) => (
          <TabsTrigger
            key={timetable.semester}
            value={timetable.semester.toString()}
          >
            Semester {timetable.semester}
          </TabsTrigger>
        ))}
      </TabsList>

      {parsedTimetable.map((timetable) => (
        <TabsContent
          key={timetable.semester}
          value={timetable.semester.toString()}
        >
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

            <TimetablePanel data={timetable.data} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

type PerSemesterData = Array<{
  semester: number;
  data: TData;
  subtext?: string;
}>;

function parseData(data: CurrentTimetable): PerSemesterData {
  const perSemester: PerSemesterData = [];

  // Find all semesters in the timetable
  const semesters = data?.tasks
    .map((v) => v.semester)
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .sort((a, b) => a - b);

  // FIXME: Handle multiple tasks in same timeslots
  semesters?.forEach((semester) => {
    const tasks = data?.tasks.filter((t) => t.semester === semester) ?? [];

    const currData: TData = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    };

    tasks.forEach((task) => {
      const day = DAYS[Math.floor(task.startTime / daySlots)];

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

    perSemester.push({ semester, data: currData });
  });

  return perSemester;
}

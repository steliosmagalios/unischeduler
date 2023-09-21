import { useMemo } from "react";
import Slot from "~/components/timetable/slot";
import TimetablePanel from "~/components/timetable/timetable-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  DAYS,
  TIMESLOTS,
  type CurrentTimetable,
  type TimetableTask,
} from "~/utils/constants";

type TimetableProps = {
  timetable: CurrentTimetable;
};

export type TData = Record<(typeof DAYS)[number], TimetableTask[]>;

export default function Timetable(props: TimetableProps) {
  const { timetable } = props;
  const parsedTimetable = useMemo(() => newParse(timetable), [timetable]);

  return (
    <Tabs defaultValue={parsedTimetable[0]?.label ?? ""}>
      <TabsList>
        {parsedTimetable.map((timetable) => (
          <TabsTrigger key={timetable.label} value={timetable.label}>
            Semester {timetable.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {parsedTimetable.map((timetable) => (
        <TabsContent key={timetable.label} value={timetable.label}>
          <div className="grid grid-cols-6 gap-px overflow-hidden rounded-md border shadow-xl dark:shadow-none">
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

            <TimetablePanel data={timetable.timetable} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function newParse(data: CurrentTimetable) {
  // Find all semesters in the timetable
  const semesters = data?.tasks
    .map((v) => v.semester)
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .sort((a, b) => a - b);

  // Filter the tasks per semester
  const perSemesterMap = new Map<number, TimetableTask[]>();
  semesters?.forEach((semester) =>
    perSemesterMap.set(
      semester,
      data?.tasks.filter((t) => t.semester === semester) ?? []
    )
  );

  // For every semester create timetables
  return (
    semesters?.flatMap((semester) => {
      const tasks = perSemesterMap.get(semester) ?? [];

      const timetables = [];
      let timetableCount = 0;
      while (tasks.length > 0) {
        const currTimetable: TimetableTask[] = [];
        for (let index = 1; index < DAYS.length * TIMESLOTS.length + 1; ) {
          const taskIndex = tasks.findIndex((t) => t.startTime === index);
          if (taskIndex === -1) {
            index++;
            continue;
          }

          // Find a task and remove it from the list
          const task = tasks[taskIndex];
          tasks.splice(taskIndex, 1);

          // Add the task to the timetalbe and move the index according to duration
          if (task !== undefined) currTimetable.push(task);
          index += task?.lecture.duration || 1;
        }

        timetables.push({ count: timetableCount, data: currTimetable });
        timetableCount++;
      }

      return timetables.map((tt) => ({
        label:
          timetables.length === 1
            ? semester.toString()
            : `${semester} - ${tt.count + 1}`,
        timetable: tt.data,
      }));
    }) ?? []
  );
}

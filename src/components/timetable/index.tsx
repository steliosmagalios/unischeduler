const daySlots = 14;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIMESLOTS = Array.from(Array(daySlots).keys()).map((i) => i + 8);

export default function Timetable() {
  return (
    <div className="grid grid-cols-6 gap-px">
      <div className="flex flex-col gap-px">
        <div className="flex h-8 items-center justify-center bg-green-800 font-bold">
          Time
        </div>

        {TIMESLOTS.map((time) => (
          <div
            key={time}
            className="flex h-12 items-center justify-center bg-green-800 even:bg-green-700"
          >
            {`${time.toString().padStart(2, "0")}:00 - ${(time + 1)
              .toString()
              .padStart(2, "0")}:00`}
          </div>
        ))}
      </div>

      {DAYS.map((day) => (
        <div key={day} className="flex flex-col gap-px">
          <div className="flex h-8 items-center justify-center bg-green-800 font-bold">
            {day}
          </div>
          {TIMESLOTS.map((time) => (
            <div
              key={time}
              className="flex h-12 items-center justify-center bg-green-800 even:bg-green-700"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

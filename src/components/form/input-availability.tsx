const dayInititals = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export default function AvailabilityInput() {
  return (
    <div>
      <div className="flex flex-col gap-2">
        {dayInititals.map((day) => (
          <div key={day} className="grid grid-cols-12 gap-2">
            <span className="col-span-1 text-right">{day}</span>
            <Row />
          </div>
        ))}
      </div>
    </div>
  );
}

const timeslots = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
] as const;

function Row() {
  return (
    <div className="col-span-11 flex justify-evenly self-stretch overflow-hidden rounded-md">
      {timeslots.map((timeslot) => (
        <div
          key={timeslot}
          className="flex h-8 w-full items-center justify-center bg-blue-300"
        >
          {timeslot}
        </div>
      ))}
    </div>
  );
}

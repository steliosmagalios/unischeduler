import { useDescription, useTsController } from "@ts-react/form";
import { useFormContext } from "react-hook-form";
import TimeGrid from "~/components/time-grid";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { DAYS, TIMESLOTS } from "~/utils/constants";

function numberComparator(a: number, b: number) {
  return a - b;
}

export default function AvailabilityInput() {
  const ctx = useFormContext();
  const { field } = useTsController<Array<number>>();
  const { label, placeholder } = useDescription();

  function handleSelectAll() {
    field.onChange(
      Array.from({ length: DAYS.length * TIMESLOTS.length }, (_, i) => i + 1)
    );
  }

  function handleSelectNone() {
    field.onChange([]);
  }

  function handleSlotClick(timeslot: number) {
    if (field.value?.includes(timeslot)) {
      field.onChange(
        field.value
          ?.filter((slot) => slot !== timeslot)
          .sort(numberComparator) ?? []
      );

      return;
    }

    field.onChange([...(field.value ?? []), timeslot].sort(numberComparator));
  }

  return (
    <FormField
      control={ctx.control}
      name={field.name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <>
              <TimeGrid
                value={field.value ?? []}
                onClick={handleSlotClick}
                className="rounded-md border p-2"
              />

              <div className="mt-1 flex flex-row-reverse gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleSelectAll}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleSelectNone}
                >
                  Select None
                </Button>
              </div>
            </>
          </FormControl>
          <FormDescription>{placeholder}</FormDescription>
        </FormItem>
      )}
    />
  );
}

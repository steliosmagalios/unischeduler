import { useDescription, useTsController } from "@ts-react/form";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

// a function to check if the input exists, it considers that the input type is "number | undefined"
function isNumber(value: number | undefined): value is number {
  return value !== undefined;
}

export default function NumberInput() {
  const ctx = useFormContext();
  const { field } = useTsController<number>();
  const { label, placeholder } = useDescription();

  function onChange(value: string) {
    try {
      field.onChange(parseInt(value));
    } catch (e) {
      field.onChange(0);
    }
  }

  return (
    <FormField
      control={ctx.control}
      name={field.name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              value={isNumber(field.value) ? field.value : ""}
              onChange={(e) => onChange(e.target.value)}
            />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

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

export default function TextInput() {
  const ctx = useFormContext();
  const { field } = useTsController<string>();
  const { label, placeholder } = useDescription();

  return (
    <FormField
      control={ctx.control}
      name={field.name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder={placeholder}
              value={field.value ? field.value : ""}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

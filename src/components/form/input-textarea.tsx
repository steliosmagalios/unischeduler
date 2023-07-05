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
import { Textarea } from "~/components/ui/textarea";

export default function TextAreaInput() {
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
            <Textarea
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

import { useEnumValues, useTsController } from "@ts-react/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function SelectInput() {
  const { field, error } = useTsController<string>();
  const items = useEnumValues();

  return (
    <>
      <Select
        value={field.value ? field.value : ""}
        onValueChange={field.onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={field.name} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error?.errorMessage && <span>{error?.errorMessage}</span>}{" "}
    </>
  );
}

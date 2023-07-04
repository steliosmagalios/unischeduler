import { useTsController } from "@ts-react/form";
import { Input } from "~/components/ui/input";

export default function TextInput() {
  const { field, error } = useTsController<string>();

  return (
    <>
      <Input
        type="text"
        value={field.value ? field.value : ""}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
      />
      {error?.errorMessage && <span>{error?.errorMessage}</span>}{" "}
    </>
  );
}

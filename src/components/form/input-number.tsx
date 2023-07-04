import { useTsController } from "@ts-react/form";
import { Input } from "~/components/ui/input";

export default function NumberInput() {
  const { field, error } = useTsController<number>();

  return (
    <>
      <Input
        type="number"
        value={field.value ? field.value : ""}
        onChange={(e) => {
          field.onChange(parseInt(e.target.value));
        }}
      />
      {error?.errorMessage && <span>{error?.errorMessage}</span>}{" "}
    </>
  );
}

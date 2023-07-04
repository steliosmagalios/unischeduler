import { useEnumValues, useTsController } from "@ts-react/form";

export default function SelectInput() {
  const { field, error } = useTsController<string>();
  const items = useEnumValues();

  return (
    <>
      <select
        value={field.value ? field.value : ""}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
      >
        {items.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      {error?.errorMessage && <span>{error?.errorMessage}</span>}{" "}
    </>
  );
}

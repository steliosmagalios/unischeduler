type CellCheckboxProps = {
  checked: boolean;
  indeterminate: boolean;
};

export default function CellCheckbox(props: CellCheckboxProps) {
  return (
    <input
      type="checkbox"
      className="rounded border-0 text-fuchsia-500 ring-0"
    />
  );
}

import { useDescription, useTsController } from "@ts-react/form";
import { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FancyBox, type FancyBoxItem } from "~/components/fancy-box";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

type Props = {
  data: FancyBoxItem[];
};

export default function InputMultiselect(props: Props) {
  const ctx = useFormContext();
  const {
    field: { value, onChange, name },
  } = useTsController<Array<number>>();
  const { label } = useDescription();

  const memoizedValue = useMemo(() => {
    return (
      value
        ?.filter((i) => props.data.some((p) => p.value === i.toString()))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((v) => props.data.find((i) => i.value === v.toString())!) ?? []
    );
  }, [value, props.data]);

  const memoizedOnChange = useCallback(
    (value: FancyBoxItem[]) => {
      onChange(value.map((v) => parseInt(v.value)));
    },
    [onChange]
  );

  return (
    <FormField
      control={ctx.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <FancyBox
              data={props.data}
              value={memoizedValue}
              onChange={memoizedOnChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

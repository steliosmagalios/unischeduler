import { createTsForm } from "@ts-react/form";
import { z } from "zod";
import NumberInput from "~/components/form/input-number";
import SelectInput from "~/components/form/input-select";
import TextInput from "~/components/form/input-text";

const mapping = [
  [z.string(), TextInput] as const,
  [z.number(), NumberInput] as const,
  [z.enum(["fake"]), SelectInput] as const,
] as const;

const CustomForm = createTsForm(mapping);
export default CustomForm;

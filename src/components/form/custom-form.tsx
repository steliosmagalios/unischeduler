import { createTsForm, createUniqueFieldSchema } from "@ts-react/form";
import { z } from "zod";
import AvailabilityInput from "~/components/form/input-availability";
import InputMultiselect from "~/components/form/input-multiselect";
import NumberInput from "~/components/form/input-number";
import SelectInput from "~/components/form/input-select";
import TextInput from "~/components/form/input-text";

export const AvailabilitySchema = createUniqueFieldSchema(
  z.array(z.number()),
  "Availability"
);

export const MultiselectSchema = createUniqueFieldSchema(
  z.array(z.coerce.number()).min(0).optional(),
  "Multiselect"
);

const mapping = [
  [z.string(), TextInput] as const,
  [z.number(), NumberInput] as const,
  [z.enum(["fake"]), SelectInput] as const,
  [AvailabilitySchema, AvailabilityInput] as const,
  [MultiselectSchema, InputMultiselect] as const,
] as const;

const CustomForm = createTsForm(mapping);
export default CustomForm;

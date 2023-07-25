import { createTsForm, createUniqueFieldSchema } from "@ts-react/form";
import { z } from "zod";
import AvailabilityInput from "~/components/form/input-availability";
import NumberInput from "~/components/form/input-number";
import SelectInput from "~/components/form/input-select";
import TextInput from "~/components/form/input-text";

export const AvilabilitySchema = createUniqueFieldSchema(
  z.array(z.number()),
  "Availability"
);

const mapping = [
  [z.string(), TextInput] as const,
  [z.number(), NumberInput] as const,
  [z.enum(["fake"]), SelectInput] as const,
  [AvilabilitySchema, AvailabilityInput] as const,
] as const;

const CustomForm = createTsForm(mapping);
export default CustomForm;

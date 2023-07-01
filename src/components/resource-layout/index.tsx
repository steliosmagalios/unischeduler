import { createTsForm, useTsController } from "@ts-react/form";
import { z } from "zod";
import DashboardLayout from "~/components/dashboard-layout";
import { DataTable, type DataTableProps } from "~/components/data-table";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { capitalize } from "~/utils/lib";

type ResourceLayoutProps<TData extends { id: string }, TType> = {
  label: string;
  userId: string;
} & DataTableProps<TData, TType>;

export default function ResourceLayout<TData extends { id: string }, TType>(
  props: ResourceLayoutProps<TData, TType>
) {
  return (
    <DashboardLayout userId={props.userId} label={props.label}>
      <div className="flex h-full flex-col gap-2 overflow-hidden">
        <div>
          <h2 className="text-3xl font-semibold capitalize">
            {capitalize(props.label)}
          </h2>
          <hr />
        </div>

        {/* Table */}
        <div className="flex-grow overflow-auto">
          <DataTable columns={props.columns} data={props.data} />
        </div>

        <div className="flex flex-row-reverse">
          <Dialog modal>
            <DialogTrigger asChild>
              <Button className="rounded-md bg-blue-500 px-4 py-2 font-semibold">
                Create
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%]">
              <DialogHeader>
                <DialogTitle>Create {props.label}</DialogTitle>
              </DialogHeader>

              <MyForm
                schema={groupSchema}
                onSubmit={(data: z.infer<typeof groupSchema>) =>
                  console.log(data)
                }
                renderAfter={() => (
                  <DialogFooter>
                    <Button variant="ghost">Cancel</Button>
                    <Button type="submit">Create</Button>
                  </DialogFooter>
                )}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
}

const groupSchema = z.object({
  name: z.string().nonempty(),
});

function TextIn() {
  const { field, error } = useTsController<string>();
  return (
    <>
      <input
        className="text-black"
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

const mapping = [[z.string(), TextIn] as const] as const;

const MyForm = createTsForm(mapping);

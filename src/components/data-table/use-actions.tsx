import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import {
  type RTFFormSchemaType,
  type RTFFormSubmitFn,
} from "@ts-react/form/lib/src/createSchemaForm";
import { useMemo } from "react";
import AlertDialogItem from "~/components/alert-dialog-item";
import { type ActionMenuItem } from "~/components/data-table/actions-menu";
import DialogItem from "~/components/dialog-item";
import CustomForm from "~/components/form/custom-form";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { DialogTitle } from "~/components/ui/dialog";

type UseActionsProps = {
  resource: string;
  editProps: {
    schema: RTFFormSchemaType;
    submit: RTFFormSubmitFn<RTFFormSchemaType>;
  };
  onDeleteClick: (id: number) => void;
  newActions?: ActionMenuItem[];
};

export default function useActions({
  resource,
  editProps,
  onDeleteClick,
  newActions = [],
}: UseActionsProps) {
  const actions = useMemo<ActionMenuItem[]>(
    () => [
      {
        render(key) {
          return (
            <DialogItem key={key} triggerChildren="View">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
              laudantium ipsam dolore suscipit autem, nesciunt hic fugiat
              dolorem dolorum culpa nisi sunt laborum, libero, itaque
              reprehenderit eligendi eum mollitia aliquam temporibus illum
              doloremque beatae sed? Repellendus obcaecati debitis fugiat
              ratione, facere id eos ipsam, nostrum distinctio, ducimus
              assumenda saepe quas voluptas soluta reprehenderit doloremque
              necessitatibus! Facilis, eligendi. Sequi explicabo, placeat nemo
              repudiandae modi tempore, distinctio sunt quis ea aspernatur,
              deleniti aperiam maiores veniam accusantium voluptates dignissimos
              incidunt temporibus quisquam velit libero necessitatibus
              exercitationem quae. Ipsam deserunt voluptate expedita eveniet
              optio ad, harum non recusandae explicabo, quibusdam adipisci eos,
              sed facere? Cumque, quod vel odio, illum a provident qui
              consectetur harum eius voluptatibus dolorum nemo voluptatem, nobis
              optio. Earum cumque veritatis rem deserunt facere id est odio
              alias debitis officia, omnis maxime doloremque laboriosam optio
              suscipit assumenda minus nam repellat nihil magnam mollitia. Aut
              ducimus recusandae at est! Cumque porro beatae quidem facere sit
              voluptates in, est deserunt enim earum! Ipsa dignissimos, sequi
              doloremque alias eos delectus quas, non voluptatibus qui
              recusandae sed voluptatum eum dolore id. Nam, dolore ipsam laborum
              corporis non eligendi at error officia, expedita, consequuntur est
              veritatis fugiat? Quia, aliquid reprehenderit accusantium
              explicabo unde quae facilis quaerat doloribus, illum suscipit cum
              iste corrupti eos sapiente nisi repudiandae et nulla impedit, ab
              facere labore. Illum sapiente rem voluptas sint temporibus aut ut
              qui ex ipsam harum, dicta recusandae laudantium, reiciendis,
              impedit repellendus ab quas eligendi animi! Atque quia
              consequuntur unde reiciendis, voluptatum mollitia tempore maiores
              illo porro provident ad odio, modi magni veniam quae dolor tenetur
              laudantium esse. Quidem magnam voluptatem quod dolorem libero
              eligendi corrupti natus, quisquam id! Architecto ea totam culpa
              sint pariatur odio deleniti tempore nostrum provident consectetur
              velit quibusdam exercitationem corrupti reprehenderit saepe
              officia blanditiis, nulla itaque ducimus accusamus ipsum cum, ad
              laborum optio. Harum, vel rerum. Laborum atque expedita porro
              inventore! Eaque doloremque veritatis cumque exercitationem
              voluptates iure pariatur repudiandae? Laborum totam beatae minima
              est praesentium vero quam accusamus exercitationem vitae. Tempora
              ea cupiditate laboriosam earum eligendi corrupti atque a at id
              beatae fuga, debitis, alias aut doloremque hic explicabo aliquam
              asperiores vitae? Dolores, veritatis? Voluptates natus itaque
              molestiae nam cum iusto nemo corporis nesciunt eius dolorum
              necessitatibus laboriosam vel, iste sapiente, minima doloremque ut
              adipisci! Quas beatae dolore consequatur repudiandae vero aperiam
              quidem molestias voluptatum veritatis, suscipit consectetur,
              ratione voluptatem assumenda possimus molestiae alias laboriosam
              temporibus. Nisi aspernatur doloremque sint adipisci architecto
              expedita commodi soluta magnam rem atque suscipit earum autem,
              quibusdam, vitae nostrum quisquam repellendus. Doloremque ipsa
              labore praesentium tempora expedita dicta adipisci harum atque
              molestiae voluptates, quam molestias ipsam modi! Odit iure nulla
              odio enim autem in at veniam. Maxime, eius. Ipsam omnis adipisci,
              laudantium, aut illum tempore vero obcaecati eos accusantium amet
              facere quae neque velit quidem natus iusto dicta sunt similique?
              Fuga alias suscipit blanditiis vitae odit laborum voluptate culpa
              earum, consequuntur veniam aspernatur eveniet cum sint atque fugit
              maxime repellat. Modi tenetur pariatur reiciendis molestias
              reprehenderit voluptas. Officia totam inventore harum iure dolorum
              ratione sequi quia explicabo.
            </DialogItem>
          );
        },
      },
      {
        render(key) {
          return (
            <DialogItem key={key} triggerChildren="Edit">
              <DialogTitle>Edit</DialogTitle>
              <CustomForm
                schema={editProps.schema}
                onSubmit={(data) => editProps.submit(data)}
              />
            </DialogItem>
          );
        },
      },
      {
        render(key, id) {
          return (
            <AlertDialogItem key={key} triggerChildren="Delete">
              <AlertDialogHeader>
                <AlertDialogTitle className="capitalize">
                  Delete {resource}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this {resource}? You
                  can&apos;t undo this action afterwards.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="ghost" className="font-semibold">
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild onClick={() => onDeleteClick(id)}>
                  <Button variant="destructive" className="font-bold">
                    Continue
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogItem>
          );
        },
      },
      ...newActions,
    ],
    [onDeleteClick, resource, newActions, editProps]
  );

  return actions;
}

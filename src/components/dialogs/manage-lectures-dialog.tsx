import { Clipboard } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

export default function ManageLecturesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <Clipboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi vero
        quas natus culpa optio dolores eligendi numquam, eos iure explicabo
        soluta mollitia laudantium sint enim? Numquam sed laboriosam harum
        aperiam.
      </DialogContent>
    </Dialog>
  );
}

import { MoreHorizontal } from "lucide-react";
import { type Key } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export type ActionMenuItem =
  | {
      label: string;
      onClick: (itemId: number) => void;
    }
  | {
      render: (key: Key | null | undefined, itemId: number) => React.ReactNode;
    };

type ActionsMenuType = {
  itemId: number;
  actions?: ActionMenuItem[];
};

export default function ActionsMenu(props: ActionsMenuType) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {props.actions?.map((action, index) => {
          if ("render" in action) {
            return action.render(index, props.itemId);
          }

          return (
            <DropdownMenuItem
              key={index}
              onClick={() => action.onClick(props.itemId)}
            >
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/utils/shad-utils";

// Borrowed from: https://github.com/mxkaske/mxkaske.dev/blob/main/components/craft/fancy-box.tsx

export type FancyBoxItem = Record<"label" | "value", string>;

type FancyBoxProps = {
  data: FancyBoxItem[];
};

export function FancyBox(props: FancyBoxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedValues, setSelectedValues] = React.useState<FancyBoxItem[]>(
    []
  );

  const toggleItem = (item: FancyBoxItem) => {
    setSelectedValues((currItems) =>
      !currItems.includes(item)
        ? [...currItems, item]
        : currItems.filter((l) => l.value !== item.value)
    );
    inputRef?.current?.focus();
  };

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur(); // HACK: otherwise, would scroll automatically to the bottom of page
    setOpenCombobox(value);
  };

  return (
    <div className="w-full">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-full justify-between text-foreground"
          >
            <span className="truncate">
              {selectedValues.length === 0 && "Select labels"}
              {selectedValues.length > 0 &&
                `${selectedValues.length} labels selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search framework..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandGroup className="max-h-[145px] overflow-auto">
              {props.data.map((item) => {
                const isActive = selectedValues.includes(item);
                return (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => toggleItem(item)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">{item.label}</div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="max-h-24 overflow-y-auto">
        {selectedValues.map(({ label, value }) => (
          <Badge key={value} variant="outline" className="mb-2 mr-2">
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
}

import { Check, ChevronsUpDown, Edit, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface ComboboxProps<T> {
  options: T[];
  value?: number;
  onChange: (value: number) => void;
  onUpdate: (item: T) => void;
  onDelete: (itemId: number) => void;
  getLabel: (item: T) => string;
  getId: (item: T) => number;
}

export const Combobox = <T,>({
  options,
  value,
  onChange,
  onUpdate,
  onDelete,
  getLabel,
  getId,
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? getLabel(options.find((opt) => getId(opt) === value)!)
            : "Choose..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const optionId = getId(option);
                const selected = optionId === value;
                return (
                  <CommandItem
                    key={optionId}
                    onSelect={() => {
                      onChange(selected ? 0 : optionId);
                      setOpen(false);
                    }}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {getLabel(option)}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdate(option);
                        }}
                        className="p-1"
                      >
                        <Edit className="h-2 w-2" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(optionId);
                        }}
                        className="p-1"
                      >
                        <Trash className="h-2 w-2" />
                      </Button>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

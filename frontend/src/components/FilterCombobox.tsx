"use client";

import { Check, ChevronsUpDown } from "lucide-react";
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
import { Checkbox } from "./ui/checkbox";

type Item = {
	id: string;
	name: string;
};

interface FilterComboboxProps {
	dropdownName: string;
	dropwdownLabel: string;
	items: Item[];
	value: string;
	onValueChange: (value: string) => void;
}

export default function FilterCombobox({
	dropdownName,
	dropwdownLabel,
	items = [], // default to empty array
	value,
	onValueChange,
}: FilterComboboxProps) {
	const [open, setOpen] = useState(false);
	const selectedItem = items.find((item) => item.id === value);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[250px] justify-between"
				>
					{selectedItem?.name || dropwdownLabel}
					<ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[250px] p-0">
				<Command>
					<CommandInput placeholder={dropwdownLabel} className="h-9" />
					<CommandList>
						<CommandEmpty>No {dropdownName} found.</CommandEmpty>
						<CommandGroup>
							{items.map((item) => (
								<CommandItem
									key={item.id}
									value={item.id}
									onSelect={(currentValue) => {
										const newValue = currentValue === value ? "" : currentValue;
										onValueChange(newValue);
										setOpen(false);
									}}
									className="flex items-center gap-2"
								>
									<Checkbox checked={value === item.id} />
									{item.name}
									<Check
										className={cn(
											"ml-auto h-4 w-4",
											value === item.id ? "opacity-100" : "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

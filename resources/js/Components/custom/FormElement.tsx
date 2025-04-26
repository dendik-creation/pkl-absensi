import { TriangleAlert, Search } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "../ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/Components/ui/drawer";

type ErrorInputProps = {
    error: string | null;
};

export function ErrorInput({ error }: ErrorInputProps) {
    return (
        <p className="text-sm text-red-500 mt-1.5 flex items-center">
            <TriangleAlert size={16} className="me-2" />
            {error}
        </p>
    );
}
type SearchInputProps = {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
};

export function SearchInput({
    value,
    onChange,
    placeholder = "Cari...",
    className,
}: SearchInputProps) {
    return (
        <div className={`relative w-full ${className}`}>
            <Input
                type="text"
                className="p-3"
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
            />
            <Search
                className="absolute top-2.5 right-2 text-gray-500"
                size={16}
            />
        </div>
    );
}

export function SelectSearchInput({
    value,
    options,
    onChange,
    placeholder,
}: {
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string | number) => void;
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full py-6 justify-between"
                >
                    {value ? (
                        <span className="font-normal text-base">
                            {
                                options.find((option) => option.value === value)
                                    ?.label
                            }
                        </span>
                    ) : (
                        <span className="font-normal text-base">
                            {placeholder}
                        </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[400px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cari pilihan..." />
                    <CommandList>
                        <CommandEmpty>Pilihan tidak ada</CommandEmpty>
                        <CommandGroup>
                            {options &&
                                options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <span className="w-full">
                                            {option.label}
                                        </span>
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export function DrawerConfirmAction({
    title,
    description,
    confirmAction,
    isOpen,
    onClose,
}: {
    title: string;
    description: string;
    confirmAction: (e: FormEvent) => void;
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="z-[1000] mb-8">
                <DrawerHeader className="flex flex-col items-start">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription className="text-start">
                        {description}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <Button
                        className="bg-blue-200 border hover:bg-blue-300"
                        variant="outline"
                        onClick={confirmAction}
                    >
                        Ya
                    </Button>
                    <div className="mt-2">
                        <Button
                            className="w-full bg-red-200 border hover:bg-red-300"
                            variant="outline"
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

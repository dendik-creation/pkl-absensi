import { TriangleAlert, Search, CircleX, CalendarIcon } from "lucide-react";
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
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/Components/ui/drawer";
import { Calendar } from "@/Components/ui/calendar";
import { ymdToIdDate } from "@/Services/additionalService";
import RichTextEditor from "@mantine/rte";

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
    removeValue,
}: {
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string | number) => void;
    placeholder?: string;
    removeValue: () => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-full py-3 justify-between relative border border-gray-300 rounded-md px-4 flex items-center cursor-pointer"
                >
                    {value ? (
                        <span className="font-normal text-base">
                            {
                                options.find((option) => option.value === value)
                                    ?.label
                            }
                        </span>
                    ) : (
                        <span className="font-normal text-slate-500 text-base">
                            {placeholder}
                        </span>
                    )}
                    {value != "" && value != undefined ? (
                        <span
                            className="ml-2 h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent closing the popover
                                removeValue();
                            }}
                        >
                            <CircleX size={20} />
                        </span>
                    ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                </div>
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

export function MultiSelectSearchInput({
    values,
    options,
    onChange,
    placeholder,
}: {
    values: string[];
    options: { label: string; value: string }[];
    onChange: (values: string[]) => void;
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);

    const toggleValue = (value: string) => {
        if (values.includes(value)) {
            onChange(values.filter((v) => v !== value));
        } else {
            onChange([...values, value]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-full h-full py-3 justify-between relative"
                >
                    {values.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {values.map((val) => {
                                const label = options.find(
                                    (option) => option.value === val
                                )?.label;
                                return (
                                    <span
                                        key={val}
                                        className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"
                                    >
                                        {label}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleValue(val);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <CircleX size={16} />
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="font-normal text-slate-500 text-base">
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
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => toggleValue(option.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            values.includes(option.value)
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

export const DatePickerInput = ({
    value,
    onChange,
    placeholder = "Pilih tanggal",
    mode = "single",
    className,
}: {
    value: string | undefined;
    onChange: (date: string | undefined) => void;
    placeholder?: string;
    mode: "single" | "multiple" | "range";
    className?: string;
}) => {
    const formatDate = (date: string | undefined) => {
        if (!date) return placeholder;

        const formattedDate = new Date(date)
            .toLocaleDateString("id-ID", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .split("/")
            .reverse()
            .join("-");

        return ymdToIdDate(formattedDate);
    };

    const handleSelect = (
        date: Date | Date[] | { from: Date; to: Date } | undefined
    ) => {
        if (!date) {
            onChange(undefined);
            return;
        }

        const formatSingleDate = (d: Date) =>
            d
                .toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })
                .split("/")
                .reverse()
                .join("-");

        if (mode === "single") {
            onChange(formatSingleDate(date as Date));
        } else if (mode === "multiple" && Array.isArray(date)) {
            onChange(date.map(formatSingleDate).join(","));
        } else if (mode === "range") {
            const range = date as { from: Date; to: Date };
            onChange(
                `${formatSingleDate(range.from)} - ${formatSingleDate(
                    range.to
                )}`
            );
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full pl-3 h-12 text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <span>{formatDate(value)}</span>
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Calendar
                    mode={mode}
                    selected={value ? new Date(value) : undefined}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export default function RichTextEditorInput({
    content,
    onChange,
}: {
    content: string;
    onChange: (value: string) => void;
}) {
    return (
        <RichTextEditor
            value={content}
            onChange={onChange}
            sticky={true}
            className="rounded-md border h-[400px] overflow-auto"
            controls={[
                ["bold", "italic", "underline"],
                ["unorderedList", "orderedList"],
                ["h1", "h2", "h3"],
                ["sup", "sub"],
                ["link", "image"],
                ["clean"],
            ]}
        />
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
            <DrawerContent className="z-[1000] mb-4">
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

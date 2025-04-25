import React, { ChangeEvent } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

type SearchInputProps = {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
};

export default function SearchInput({
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

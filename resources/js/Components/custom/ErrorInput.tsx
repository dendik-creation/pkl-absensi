import { TriangleAlert } from "lucide-react";
import React from "react";

type ErrorInputProps = {
    error: string | null;
};

export default function ErrorInput({ error }: ErrorInputProps) {
    return (
        <p className="text-sm text-red-500 mt-1.5 flex items-center">
            <TriangleAlert size={16} className="me-2" />
            {error}
        </p>
    );
}

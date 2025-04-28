import React from "react";

export default function KeyAndValue({
    keyIdentifier,
    value,
    dense = false,
    className = "",
}: {
    keyIdentifier: string;
    value: string | number | null | undefined;
    dense?: boolean;
    className?: string;
}) {
    return (
        <div className={`${!dense ? "mb-2" : ""} ${className}`}>
            <p className="text-sm font-semibold text-slate-600">
                {keyIdentifier}
            </p>
            <span>{value ?? "-"}</span>
        </div>
    );
}

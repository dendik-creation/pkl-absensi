import React from "react";

export default function KeyAndValue({
    keyIdentifier,
    value,
}: {
    keyIdentifier: string;
    value: string | number | null | undefined;
}) {
    return (
        <div className="mb-2">
            <p className="text-sm font-semibold text-slate-600">
                {keyIdentifier}
            </p>
            <span>{value ?? "-"}</span>
        </div>
    );
}

import React from "react";

export default function KeyAndValue({
    keyIdentifier,
    value,
    dense = false,
    className = "",
    htmlContent = false,
}: {
    keyIdentifier: string;
    value: string | number | null | undefined;
    dense?: boolean;
    className?: string;
    htmlContent?: boolean;
}) {
    return (
        <div className={`${!dense ? "mb-2" : ""} ${className}`}>
            <p className="text-sm font-semibold text-slate-600">
                {keyIdentifier}
            </p>
            {htmlContent && (
                <div className="text-sm text-slate-500 font-normal mb-3"></div>
            )}
            {htmlContent ? (
                <span
                    className=""
                    dangerouslySetInnerHTML={{
                        __html: value ? String(value) : "-",
                    }}
                />
            ) : (
                <span>{value ?? "-"}</span>
            )}
        </div>
    );
}

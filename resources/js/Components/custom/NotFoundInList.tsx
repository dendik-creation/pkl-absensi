import React from "react";
import { Card } from "../ui/card";
import { SearchX } from "lucide-react";

type NotFoundInListProps = {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
};

export default function NotFoundInList({
    title,
    description,
    icon,
}: NotFoundInListProps) {
    return (
        <Card className="flex flex-col items-center justify-center p-10 text-center">
            <div className="text-6xl text-muted-foreground mb-2">
                {icon ? icon : <SearchX size={32} />}
            </div>
            <h3 className="text-xl font-semibold">
                {title ?? "Data tidak ada"}
            </h3>
            <p className="text-muted-foreground">
                {description ?? "Pencarian tidak ditemukan atau data tidak ada"}
            </p>
        </Card>
    );
}

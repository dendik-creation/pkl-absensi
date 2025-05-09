import React from "react";
import { MenuItem } from "@/Types/menu";
import { Link } from "@inertiajs/react";
import clsx from "clsx";
import { Card } from "../ui/card";
import { ChevronRight } from "lucide-react";

export default function MenuListInDashboard({
    menuItems,
    className,
}: {
    menuItems: MenuItem[];
    className?: string;
}) {
    return (
        <>
            <div className={clsx("grid grid-cols-3 gap-4", className)}>
                {menuItems.map((item, index) => (
                    <Link
                        href={item.url}
                        key={index}
                        className="flex flex-col  items-center justify-center space-y-4"
                    >
                        <div className="rounded-full border border-blue-100 bg-white p-6 shadow-lg">
                            {item.icon}
                        </div>
                        <span className="text-center text-sm truncate w-full">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>
        </>
    );
}

export function DashboardMenuItemWithData({
    label,
    value,
    icon,
    url,
    className,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
    url?: string;
    className?: string;
}) {
    return (
        <Card
            className={clsx(
                "flex p-3 flex-row w-full relative overflow-hidden shadow-md z-0",
                className
            )}
        >
            <div className="absolute -right-5 -bottom-0 w-2/3 h-full bg-gradient-to-r from-white to-green-200 z-10 opacity-50"></div>
            <ChevronRight className="absolute z-10 right-3 top-7 text-slate-600" />
            <Link href={url ?? "#"}>
                <div
                    className={
                        "absolute -right-5 -bottom-0 w-2/3 h-full bg-white"
                    }
                ></div>
                <div className={"z-10 absolute -right-5 -bottom-5 opacity-10"}>
                    {icon}
                </div>
                <div className="relative z-10 p-1">
                    <h3 className="font-semibold text-gray-700">{value}</h3>
                    <span>{label}</span>
                </div>
            </Link>
        </Card>
    );
}

export const TableListInDashboard = ({
    title,
    description,
    headers,
    columnsData,
}: {
    title: string;
    description: string;
    headers: string[];
    columnsData: any[][];
}) => {
    return (
        <Card className="p-3 flex flex-col w-full relative overflow-hidden shadow-md">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            <div className="overflow-x-auto">
                <table className="w-full table-auto min-w-[600px]">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-2 text-left font-semibold text-gray-700"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {columnsData.map((row, index) => (
                            <tr
                                key={index}
                                className="border-b hover:bg-gray-50"
                            >
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className="px-4 py-2 text-sm text-gray-700"
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

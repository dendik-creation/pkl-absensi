import React from "react";
import { MenuItem } from "@/Types/menu";
import { Link } from "@inertiajs/react";
import clsx from "clsx";

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

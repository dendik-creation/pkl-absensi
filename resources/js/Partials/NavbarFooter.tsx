import { MenuItem } from "@/Types/menu";
import { Link } from "@inertiajs/react";
import { FaHome, FaUser, FaCog } from "react-icons/fa";

export default function NavbarFooter() {
    const menuItems: MenuItem[] = [
        {
            icon: <FaHome size={24} />,
            label: "Home",
            url: "#",
        },
        {
            icon: <FaUser size={24} />,
            label: "Profile",
            url: "#",
        },
        {
            icon: <FaCog size={24} />,
            label: "Settings",
            url: "#",
        },
    ];
    return (
        <div className="fixed max-w-2xl mx-auto bottom-0 left-0 right-0 bg-white shadow-md border-t flex justify-around items-center py-2">
            {menuItems.map((item, index) => {
                const isActive = window.location.pathname === item.url;
                return (
                    <Link
                        key={index}
                        href={item.url}
                        className={`flex p-2 flex-col items-center ${
                            isActive
                                ? "text-blue-500"
                                : "text-gray-600 hover:text-blue-500"
                        }`}
                    >
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}

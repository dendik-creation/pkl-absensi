import { getLocalStorage } from "@/Services/additionalService";
import { MenuItem } from "../Types/menu";
import { Link } from "@inertiajs/react";
import { FaHome, FaUser, FaCog } from "react-icons/fa";

export default function NavbarFooter() {
    const pathame = window.location.pathname;
    const currentRole = getLocalStorage("user_role") as string;
    const menuItems: MenuItem[] = [
        {
            icon: <FaHome size={24} />,
            label: "Home",
            url: `/${currentRole?.toLowerCase()}/dashboard`,
            acceptedRole: ["ADMIN", "STUDENT", "SUPERVISOR"],
        },
        {
            icon: <FaUser size={24} />,
            label: "Profile",
            url: "/profile",
            activeOnUrls: ["/profile", "/profile/change-password"],
            acceptedRole: ["ADMIN", "STUDENT", "SUPERVISOR"],
        },
        {
            icon: <FaCog size={24} />,
            label: "Settings",
            url: "#",
            acceptedRole: ["ADMIN"],
        },
    ];
    return (
        <div className="fixed max-w-2xl z-[999] mx-auto bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2">
            {menuItems.map((item, index) => {
                const isActive = window.location.pathname === item.url;
                const isActiveOnUrls =
                    item.activeOnUrls?.some((url) => pathame.includes(url)) ||
                    false;
                if (
                    !(item.acceptedRole ?? []).includes(
                        currentRole.toUpperCase()
                    )
                ) {
                    return null;
                }
                return (
                    <Link
                        key={index}
                        href={item.url}
                        className={`flex p-2 flex-col items-center ${
                            isActive || isActiveOnUrls
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

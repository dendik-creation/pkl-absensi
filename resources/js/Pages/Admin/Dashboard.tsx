import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import {
    currentTimeCode,
    currentTimeGreeting,
} from "@/Services/additionalService";
import { PiStudentFill } from "react-icons/pi";
import { FaUserGear } from "react-icons/fa6";
import { HiBuildingStorefront } from "react-icons/hi2";
import MenuListInDashboard from "@/Components/custom/MenuListInDashboard";
import { MenuItem } from "@/Types/menu";
import clsx from "clsx";
import { ApexBarChart, ChartNoData } from "@/Components/custom/Charts";
import { RiAdminLine } from "react-icons/ri";
import { useEffect, useState } from "react";

type AdminDashboardProps = {
    title?: string;
    attendances: {
        month: string;
        present: number;
        excused: number;
        absent: number;
    }[];
};

export default function AdminDashboard({
    title,
    attendances,
}: AdminDashboardProps) {
    const [currentTime, setCurrentTime] = useState(() => {
        const now = new Date();
        return { hour: now.getHours(), minute: now.getMinutes() };
    });

    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            setCurrentTime({ hour: now.getHours(), minute: now.getMinutes() });
        };

        const interval = setInterval(updateCurrentTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const currentHour = currentTime.hour;
    const currentMinute = currentTime.minute;
    const menuItems: MenuItem[] = [
        {
            icon: <PiStudentFill size={24} color="#36454F" />,
            label: "Data Siswa",
            url: "/admin/student",
        },
        {
            icon: <HiBuildingStorefront size={24} color="#36454F" />,
            label: "Data DuDi (Bengkel)",
            url: "/admin/workshop",
        },
        {
            icon: <FaUserGear size={24} color="#36454F" />,
            label: "Data Pembimbing",
            url: "/admin/supervisor",
        },
    ];
    const attedance = {
        categories: attendances?.map((attendance) => attendance.month),
        series: [
            {
                name: "Hadir",
                data: attendances?.map((attendance) => attendance.present),
            },
            {
                name: "Izin",
                data: attendances?.map((attendance) => attendance.excused),
            },
            {
                name: "Alpha",
                data: attendances?.map((attendance) => attendance.absent),
            },
        ],
    };
    return (
        <MainLayout title={title}>
            <div className="w-full">
                <div className="absolute top-0 left-0 w-full h-24 bg-blue-500 opacity-30 rounded-b-full z-0"></div>
                <div className="z-10 relative mb-3 p-3">
                    <Card className="flex p-3 flex-row w-full relative overflow-hidden shadow-md">
                        <div
                            className={clsx(
                                "absolute -right-5 -bottom-0 w-2/3 h-full bg-gradient-to-r from-white",
                                currentTimeCode() === "M" && "to-[#FFF8DC]",
                                currentTimeCode() === "A" && "to-[#B0E0E6]",
                                currentTimeCode() === "E" && "to-[#FFDAB9]",
                                currentTimeCode() === "N" && "to-[#778899]"
                            )}
                        ></div>
                        <div className="flex items-center mx-6 justify-center overflow-hidden relative">
                            <div className="rounded-full p-4 bg-blue-100">
                                <RiAdminLine
                                    className="text-blue-600"
                                    size={35}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center relative">
                            <h1 className="text-xl font-bold text-gray-800">
                                Selamat {currentTimeGreeting()}
                            </h1>
                            <p className="text-lg text-gray-600">Admin</p>
                        </div>
                        <div
                            className={clsx(
                                "absolute bottom-3 right-8 flex items-start justify-start rotate-90 origin-bottom-right",
                                currentTimeCode() === "M" && "text-[#8B8000]",
                                currentTimeCode() === "A" && "text-[#5F9EA0]",
                                currentTimeCode() === "E" && "text-[#CD5C5C]",
                                currentTimeCode() === "N" && "text-[#2F4F4F]"
                            )}
                        >
                            <span className="text-2xl font-bold leading-none">
                                {currentHour}
                            </span>
                            <span className="text-2xl font-bold mx-1 leading-none">
                                {":"}
                            </span>
                            <span className="text-2xl font-bold leading-none">
                                {currentMinute}
                            </span>
                        </div>
                    </Card>
                </div>
                <MenuListInDashboard className="mb-6" menuItems={menuItems} />
                <div className="mt-6">
                    {attendances.every(
                        (attendance) =>
                            attendance.present === 0 &&
                            attendance.excused == 0 &&
                            attendance.absent == 0
                    ) ? (
                        <ChartNoData title="Rekap Kehadiran" />
                    ) : (
                        <ApexBarChart
                            title="Rekap Kehadiran"
                            description="Rekap kehadiran siswa dalam 3 bulan"
                            categories={attedance.categories}
                            series={attedance.series}
                            colors={["#93C5FD", "#FDE68A", "#FCA5A5"]}
                            height={300}
                        />
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

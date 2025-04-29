import MenuListInDashboard from "@/Components/custom/MenuListInDashboard";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import {
    currentTimeCode,
    currentTimeGreeting,
    ymdToIdDate,
} from "@/Services/additionalService";
import { MenuItem } from "@/Types/menu";
import { Student } from "@/Types/student";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { PiStudentFill } from "react-icons/pi";
import { LuMapPinCheck } from "react-icons/lu";
import { ChevronRight, Clock8, DatabaseZap, NotebookText } from "lucide-react";
import { Link } from "@inertiajs/react";

type StudentDashboardProps = {
    title?: string;
    student: Student;
    latest_activity: {
        attendance?: Attendance;
        journal?: Journal;
    };
};

export default function StudentDashboard({
    title,
    student,
    latest_activity,
}: StudentDashboardProps) {
    const [currentTime, setCurrentTime] = useState(
        ymdToIdDate(new Date().toISOString(), true)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(ymdToIdDate(new Date().toISOString(), true));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const menuItems: MenuItem[] = [
        {
            icon: <LuMapPinCheck size={24} color="#36454F" />,
            label: "Absensi",
            url: "/student/attendance",
        },
        {
            icon: <NotebookText size={24} color="#36454F" />,
            label: "Jurnal",
            url: "/student/journal",
        },
        {
            icon: <DatabaseZap size={24} color="#36454F" />,
            label: "Export Data",
            url: "/student/data-export",
        },
    ];
    return (
        <MainLayout title={title as string}>
            <div className="w-full">
                <div className="absolute top-0 left-0 w-full h-24 bg-blue-500 opacity-30 rounded-b-full z-0"></div>
                <div className="z-10 relative py-3">
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
                                <PiStudentFill
                                    className="text-blue-600"
                                    size={35}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center relative">
                            <h1 className="text-xl font-bold text-gray-800">
                                Selamat {currentTimeGreeting()}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {student?.full_name.split(" ").length === 3
                                    ? student.full_name
                                          .split(" ")
                                          .slice(0, 2)
                                          .join(" ")
                                    : student.full_name}
                            </p>
                        </div>
                        <div
                            className={clsx(
                                "absolute bottom-2.5 right-8 flex items-start justify-start rotate-90 origin-bottom-right",
                                currentTimeCode() === "M" && "text-[#8B8000]",
                                currentTimeCode() === "A" && "text-[#5F9EA0]",
                                currentTimeCode() === "E" && "text-[#CD5C5C]",
                                currentTimeCode() === "N" && "text-[#2F4F4F]"
                            )}
                        ></div>
                    </Card>
                </div>
                <div className="z-10 relative mb-3 pb-3">
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
                        <div
                            className={clsx(
                                "z-10 absolute -right-5 -bottom-5 opacity-50",
                                currentTimeCode() === "M" && "text-[#8B8000]",
                                currentTimeCode() === "A" && "text-[#5F9EA0]",
                                currentTimeCode() === "E" && "text-[#CD5C5C]",
                                currentTimeCode() === "N" && "text-[#2F4F4F]"
                            )}
                        >
                            <Clock8 size={80} />
                        </div>
                        <div className="relative z-10 p-1">
                            <h3 className="font-semibold text-gray-700">
                                Waktu sekarang
                            </h3>
                            <span>{currentTime}</span>
                        </div>
                    </Card>
                </div>
                <MenuListInDashboard className="mb-6" menuItems={menuItems} />

                {latest_activity?.attendance == null ? (
                    <Link href={"/student/attendance/create" as string}>
                        <Card className="p-4 relative overflow-hidden shadow-md">
                            <div className="absolute -right-5 -bottom-0 w-2/3 h-full bg-gradient-to-r from-white to-red-100 z-0"></div>
                            <ChevronRight className="absolute z-10 right-3 top-7 text-red-500" />
                            <div className="z-10 flex flex-col justify-start items-start relative">
                                <h3 className="font-semibold text-slate-700 mb-0">
                                    Absensi masuk sekarang
                                </h3>
                                <span className="text-slate-700">
                                    Klik untuk absensi
                                </span>
                            </div>
                        </Card>
                    </Link>
                ) : (
                    "Sdah aben"
                )}
            </div>
        </MainLayout>
    );
}

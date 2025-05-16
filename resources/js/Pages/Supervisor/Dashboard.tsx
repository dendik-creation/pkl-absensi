import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import {
    currentTimeCode,
    currentTimeGreeting,
    setLocalStorage,
    ymdToIdDate,
} from "@/Services/additionalService";
import { PiStudentFill } from "react-icons/pi";
import { HiBuildingStorefront } from "react-icons/hi2";
import MenuListInDashboard, {
    TableListInDashboard,
} from "@/Components/custom/MenuListInDashboard";
import { MenuItem } from "@/Types/menu";
import clsx from "clsx";
import { ApexBarChart, ChartNoData } from "@/Components/custom/Charts";
import { useEffect, useState } from "react";
import { Clock8, NotebookText } from "lucide-react";
import { Supervisor } from "@/Types/supervisor";
import { FaUserGear } from "react-icons/fa6";
import { Attendance } from "@/Types/attendance";
import { LuMapPinCheck } from "react-icons/lu";

type SupervisorDashboardProps = {
    title?: string;
    supervisor: Supervisor;
    data: {
        user_role: string;
        default_location: {
            latitude: number;
            longitude: number;
        };
        attendances_daily: {
            total_students: number;
            attendances?: Attendance[];
        };
        attendances_month: {
            month: string;
            present: number;
            excused: number;
            absent: number;
        }[];
        latest_attendances: Attendance[];
    };
};

export default function SupervisorDashboard({
    title,
    supervisor,
    data,
}: SupervisorDashboardProps) {
    const [currentTime, setCurrentTime] = useState(new Date().toISOString());
    setLocalStorage("user_role", data.user_role);
    setLocalStorage("default_latitude", data.default_location.latitude);
    setLocalStorage("default_longitude", data.default_location.longitude);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toISOString());
        }, 60000);

        return () => clearInterval(interval);
    }, []);
    const menuItems: MenuItem[] = [
        {
            icon: <PiStudentFill size={24} color="#36454F" />,
            label: "Data Siswa",
            url: "/supervisor/student",
        },
        {
            icon: <LuMapPinCheck size={24} color="#36454F" />,
            label: "Absensi Siswa",
            url: "/supervisor/student/attendance",
        },
        {
            icon: <NotebookText size={24} color="#36454F" />,
            label: "Jurnal Siswa",
            url: "/supervisor/student/journal",
        },
        {
            icon: <HiBuildingStorefront size={24} color="#36454F" />,
            label: "Data DuDi (Bengkel)",
            url: "/supervisor/workshop",
        },
    ];
    const attedance = {
        categories: data.attendances_month?.map(
            (attendance) => attendance.month
        ),
        series: [
            {
                name: "Hadir",
                data: data.attendances_month?.map(
                    (attendance) => attendance.present
                ),
            },
            {
                name: "Izin",
                data: data.attendances_month?.map(
                    (attendance) => attendance.excused
                ),
            },
            {
                name: "Alpha",
                data: data.attendances_month?.map(
                    (attendance) => attendance.absent
                ),
            },
        ],
    };
    return (
        <MainLayout title={title}>
            <div className="w-full">
                <div className="absolute top-0 left-0 w-full h-24 bg-blue-500 opacity-30 rounded-b-full z-0"></div>
                <div className="z-10 relative mb-3 py-3">
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
                                <FaUserGear
                                    className="text-blue-600 pl-1"
                                    size={35}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center relative">
                            <h1 className="text-xl font-bold text-gray-800">
                                Selamat {currentTimeGreeting()}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {supervisor?.full_name}
                            </p>
                        </div>
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
                            <span>{ymdToIdDate(currentTime, true)}</span>
                        </div>
                    </Card>
                </div>
                <MenuListInDashboard className="mb-6" menuItems={menuItems} />
                <div className="mt-6">
                    <div className="mb-6">
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
                                    "z-10 absolute -right-3 -bottom-3 opacity-50",
                                    currentTimeCode() === "M" &&
                                        "text-[#8B8000]",
                                    currentTimeCode() === "A" &&
                                        "text-[#5F9EA0]",
                                    currentTimeCode() === "E" &&
                                        "text-[#CD5C5C]",
                                    currentTimeCode() === "N" &&
                                        "text-[#2F4F4F]"
                                )}
                            >
                                <LuMapPinCheck size={80} />
                            </div>
                            <div className="relative z-10 p-1">
                                <h3 className="font-semibold text-gray-700">
                                    Absensi Harian
                                </h3>
                                <div className="flex flex-col text-sm">
                                    <div>
                                        <span className="font-semibold text-slate-700">
                                            {data.attendances_daily?.attendances
                                                ?.length ?? 0}{" "}
                                            /{" "}
                                            {
                                                data.attendances_daily
                                                    ?.total_students
                                            }
                                        </span>{" "}
                                        Telah mengisi absensi
                                    </div>
                                    <div>
                                        <span className="font-semibold text-slate-700">
                                            {data.attendances_daily?.attendances?.filter(
                                                (attendance) =>
                                                    attendance.status ===
                                                    "EXCUSED"
                                            ).length ?? 0}
                                        </span>{" "}
                                        Izin tidak hadir
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="mb-5">
                        {data.attendances_month.every(
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
                    <div className="mb-5">
                        <TableListInDashboard
                            title="Absensi Terbaru"
                            description="Data absensi terbaru yang tercatat"
                            headers={["Siswa", "Tanggal", "Waktu", "Status"]}
                            columnsData={data?.latest_attendances.map(
                                (attendance) => [
                                    `${attendance.student?.nis} - ${attendance.student?.full_name}`,
                                    ymdToIdDate(attendance.check_in),
                                    ymdToIdDate(
                                        attendance.check_in,
                                        true,
                                        true
                                    ),
                                    attendance.status == "PRESENT"
                                        ? "HADIR"
                                        : attendance.status == "EXCUSED"
                                        ? "IZIN"
                                        : "ALPHA",
                                ]
                            )}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

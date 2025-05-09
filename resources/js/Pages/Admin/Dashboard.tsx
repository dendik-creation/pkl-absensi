import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import {
    currentTimeCode,
    currentTimeGreeting,
    ymdToIdDate,
} from "@/Services/additionalService";
import { PiStudentFill } from "react-icons/pi";
import { FaUserGear } from "react-icons/fa6";
import { HiBuildingStorefront } from "react-icons/hi2";
import clsx from "clsx";
import { ApexBarChart, ChartNoData } from "@/Components/custom/Charts";
import { RiAdminLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Clock8 } from "lucide-react";
import { DashboardMenuItemWithData } from "@/Components/custom/MenuListInDashboard";

type AdminDashboardProps = {
    title?: string;
    data: {
        cards: {
            student_count: number;
            workshop_count: number;
            supervisor_count: number;
        };
        charts: {
            attendances: {
                month: string;
                present: number;
                excused: number;
                absent: number;
            }[];
        };
    };
};

export default function AdminDashboard({ title, data }: AdminDashboardProps) {
    const [currentTime, setCurrentTime] = useState(new Date().toISOString());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toISOString());
        }, 60000);

        return () => clearInterval(interval);
    }, []);
    const attedance = {
        categories: data?.charts?.attendances?.map(
            (attendance) => attendance.month
        ),
        series: [
            {
                name: "Hadir",
                data: data?.charts?.attendances?.map(
                    (attendance) => attendance.present
                ),
            },
            {
                name: "Izin",
                data: data?.charts?.attendances?.map(
                    (attendance) => attendance.excused
                ),
            },
            {
                name: "Alpha",
                data: data?.charts?.attendances?.map(
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
                <div className="mt-3">
                    <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                        <DashboardMenuItemWithData
                            label="Jumlah Siswa"
                            value={data?.cards?.student_count.toString()}
                            icon={<PiStudentFill size={80} />}
                            url="/admin/student"
                        />
                        <DashboardMenuItemWithData
                            label="Jumlah DuDi"
                            value={data?.cards?.workshop_count.toString()}
                            icon={<HiBuildingStorefront size={80} />}
                            url="/admin/workshop"
                        />
                        <DashboardMenuItemWithData
                            label="Jumlah Pembimbing"
                            value={data?.cards?.supervisor_count.toString()}
                            icon={<FaUserGear size={80} />}
                            url="/admin/supervisor"
                            className="col-span-2 md:col-span-1"
                        />
                    </div>
                    <div className="">
                        {data?.charts?.attendances.every(
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
            </div>
        </MainLayout>
    );
}

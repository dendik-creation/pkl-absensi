import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import NotFoundInList from "@/Components/custom/NotFoundInList";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { isWithinTimeRange, ymdToIdDate } from "@/Services/additionalService";
import { Link, usePage } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { LuMapPinCheck } from "react-icons/lu";

type StudentAttendanceIndexProps = {
    title: string;
    attendances: Attendance[];
    attendance_time_name: "MASUK" | "PULANG";
    setting: GlobalSetting;
};

export default function StudentAttendanceIndex({
    title,
    attendances,
    attendance_time_name,
    setting,
}: StudentAttendanceIndexProps) {
    const { flash } = usePage().props as any;
    if (flash.success) {
        BlastSonner({
            type: BlastType.SUCCESS,
            message: flash.success,
        });
    }
    if (flash.error) {
        BlastSonner({
            type: BlastType.ERROR,
            message: flash.error,
        });
    }
    const [attendancesData, setAttendancesData] =
        useState<Attendance[]>(attendances);
    const currentTime = new Date().toISOString();
    const currentDate = new Date().toISOString().slice(0, 10);
    const todayAttendedIn = attendancesData.some(
        (attendance) => attendance.check_in?.slice(0, 10) === currentDate
    );
    const todayAttendedOut = attendancesData.some(
        (attendance) => attendance.check_out?.slice(0, 10) === currentDate
    );

    return (
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description="Riwayat absensi siswa"
            />

            {attendance_time_name == "MASUK" &&
                isWithinTimeRange(
                    setting.check_in_start,
                    setting.check_in_end,
                    currentTime
                ) &&
                !todayAttendedIn && (
                    <Link
                        href={
                            "/student/attendance/create?utm_source=student_attendance"
                        }
                    >
                        <Button
                            size={"lg"}
                            variant="outline"
                            className="w-full bg-green-200 border mb-5 hover:bg-green-300 flex justify-center items-center gap-2"
                        >
                            <LuMapPinCheck size={20} />
                            <span>
                                Absensi{" "}
                                {attendance_time_name.charAt(0).toUpperCase() +
                                    attendance_time_name
                                        .slice(1)
                                        .toLowerCase()}{" "}
                                untuk hari ini
                            </span>
                        </Button>
                    </Link>
                )}
            {attendance_time_name == "PULANG" &&
                isWithinTimeRange(
                    setting.check_out_start,
                    setting.check_out_end,
                    currentTime
                ) &&
                !todayAttendedOut && (
                    <Link
                        href={
                            "/student/attendance/create?utm_source=student_attendance"
                        }
                    >
                        <Button
                            size={"lg"}
                            variant="outline"
                            className="w-full bg-green-200 border mb-5 hover:bg-green-300 flex justify-center items-center gap-2"
                        >
                            <LuMapPinCheck size={20} />
                            <span>
                                Absensi{" "}
                                {attendance_time_name.charAt(0).toUpperCase() +
                                    attendance_time_name
                                        .slice(1)
                                        .toLowerCase()}{" "}
                                untuk hari ini
                            </span>
                        </Button>
                    </Link>
                )}

            <div className="grid grid-cols-1">
                {attendancesData.length > 0 ? (
                    attendancesData.map((attendance, index) => (
                        <Link
                            key={index}
                            href={`/student/attendance/${attendance.id}`}
                        >
                            <Card className="shadow-md p-4 mb-3 flex items-center overflow-hidden justify-between relative">
                                <div className="z-10">
                                    <h3 className="text-xl font-semibold text-blue-800">
                                        {ymdToIdDate(attendance.check_in)}
                                    </h3>
                                    <div className="flex gap-3">
                                        <div className="text-sm">
                                            Absensi Masuk{" "}
                                            <span className="text-slate-500 font-semibold">
                                                {ymdToIdDate(
                                                    attendance.check_in,
                                                    false,
                                                    true
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-sm">
                                            Absensi Pulang{" "}
                                            <span className="text-slate-500 font-semibold">
                                                {attendance?.check_out
                                                    ? ymdToIdDate(
                                                          attendance.check_out,
                                                          false,
                                                          true
                                                      )
                                                    : "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight
                                    size={28}
                                    className="text-blue-400 z-10"
                                />
                                <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-blue-100 to-white rounded-l-md"></div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <NotFoundInList />
                )}
            </div>
        </MainLayout>
    );
}

import NotFoundInList from "@/Components/custom/NotFoundInList";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { ymdToIdDate } from "@/Services/additionalService";
import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { LuMapPinCheck } from "react-icons/lu";

type StudentAttendanceIndexProps = {
    title: string;
    attendances: Attendance[];
};

export default function StudentAttendanceIndex({
    title,
    attendances,
}: StudentAttendanceIndexProps) {
    const [attendancesData, setAttendancesData] =
        useState<Attendance[]>(attendances);
    const nowDate = new Date().toDateString();
    return (
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description="Riwayat absensi siswa"
            />

            {attendances.length == 0 ||
                (!attendances.find(
                    (attendance) => attendance.check_in == nowDate
                ) && (
                    <Link href={"/student/attendance/create"}>
                        <Button
                            size={"lg"}
                            variant="outline"
                            className="w-full bg-green-200 border mb-5 hover:bg-green-300 flex justify-center items-center gap-2"
                        >
                            <LuMapPinCheck size={20} />
                            <span>Absensi untuk hari ini</span>
                        </Button>
                    </Link>
                ))}

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

import KeyAndValue from "@/Components/custom/KeyAndValue";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { MapPinned } from "lucide-react";
import MapPicker from "@/Components/custom/MapPicker";
import { Attendance } from "@/Types/attendance";
import { ymdToIdDate } from "@/Services/additionalService";

type SupervisorStudentAttendanceShowProps = {
    title: string;
    attendance: Attendance;
};

export default function SupervisorStudentAttendanceShow({
    title,
    attendance,
}: SupervisorStudentAttendanceShowProps) {
    return (
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description={`Oleh ${attendance?.student?.full_name} kelas ${attendance?.student?.class}`}
            />
            <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                <div className="z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPinned className="text-slate-500" size={18} />
                        <h3 className="text-lg font-semibold">Absensi Masuk</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <KeyAndValue
                            keyIdentifier="Waktu"
                            value={ymdToIdDate(
                                attendance?.check_in?.toString(),
                                true,
                                false,
                                true
                            )}
                        />
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-green-100 to-white rounded-l-md"></div>
                <MapPicker
                    readonly={true}
                    attendance_mode={true}
                    workshop_latitude={
                        attendance?.student?.workshop?.latitude ?? undefined
                    }
                    workshop_longitude={
                        attendance?.student?.workshop?.longitude ?? undefined
                    }
                    latitude={attendance.latitude_in ?? undefined}
                    longitude={attendance.longitude_in ?? undefined}
                />
            </Card>
            <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                <div className="z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPinned className="text-slate-500" size={18} />
                        <h3 className="text-lg font-semibold">
                            Absensi Keluar
                        </h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <KeyAndValue
                            keyIdentifier="Waktu"
                            value={
                                attendance.check_out != null
                                    ? ymdToIdDate(
                                          attendance?.check_out?.toString(),
                                          true,
                                          false,
                                          true
                                      )
                                    : "-"
                            }
                        />
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-green-100 to-white rounded-l-md"></div>
                {attendance.check_out != null && (
                    <MapPicker
                        readonly={true}
                        attendance_mode={true}
                        workshop_latitude={
                            attendance?.student?.workshop?.latitude ?? undefined
                        }
                        workshop_longitude={
                            attendance?.student?.workshop?.longitude ??
                            undefined
                        }
                        latitude={attendance.latitude_out ?? undefined}
                        longitude={attendance.longitude_out ?? undefined}
                    />
                )}
            </Card>
        </MainLayout>
    );
}

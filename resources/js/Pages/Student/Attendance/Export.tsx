import PDFExportLayout from "@/Layouts/PDFExportLayout";
import { cn } from "@/lib/utils";
import { ymdToIdDate } from "@/Services/additionalService";
import { Attendance } from "@/Types/attendance";
import { Student } from "@/Types/student";

type StudentAttendanceExportProps = {
    title?: string;
    student: Student;
    setting: GlobalSetting;
    attendances: Attendance[];
    month_selected?: string;
};

export default function StudentAttendanceExport({
    title,
    student,
    setting,
    attendances,
    month_selected,
}: StudentAttendanceExportProps) {
    const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];
    const statuses = (statusEN: "PRESENT" | "EXCUSED" | "ABSENT") => {
        switch (statusEN) {
            case "PRESENT":
                return "Hadir";
            case "EXCUSED":
                return "Izin";
            case "ABSENT":
                return "Tidak Hadir";
            default:
                return statusEN;
        }
    };
    return (
        <PDFExportLayout title={title as string} appSetting={setting}>
            <h3 className="font-bold text-xl mb-3">
                {month_selected == null
                    ? "Absensi Siswa PKL Keseluruhan"
                    : `Absensi Siswa PKL Bulan ${
                          monthNames[parseInt(month_selected) - 1]
                      }`}
            </h3>
            <div className="mb-5">
                <div className="flex items-center">
                    <div className="w-[70px]">NIS</div>
                    <span>: {student.nis}</span>
                </div>
                <div className="flex items-center">
                    <div className="w-[70px]">Nama</div>
                    <span>: {student.full_name}</span>
                </div>
                <div className="flex items-center">
                    <div className="w-[70px]">Kelas</div>
                    <span>: {student.class}</span>
                </div>
                <div className="flex items-center">
                    <div className="w-[70px]">Jurusan</div>
                    <span>: {student.major}</span>
                </div>
            </div>

            <table className="w-full border-collapse border border-slate-400">
                <thead>
                    <tr>
                        <th className="border border-black/50 bg-blue-400 text-white p-2">
                            No
                        </th>
                        <th className="border border-black/50 bg-blue-400 text-white p-2">
                            Tanggal
                        </th>
                        <th className="border border-black/50 bg-blue-400 text-white p-2">
                            Waktu Masuk
                        </th>
                        <th className="border border-black/50 bg-blue-400 text-white p-2">
                            Waktu Pulang
                        </th>
                        <th className="border border-black/50 bg-blue-400 text-white p-2">
                            Status Akhir
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {attendances.map((attendance, index) => (
                        <tr
                            key={attendance.id}
                            className={cn(
                                attendance.status == "ABSENT"
                                    ? "bg-red-200"
                                    : ""
                            )}
                        >
                            <td
                                align="center"
                                className="border border-black/50 p-2"
                            >
                                {index + 1}
                            </td>
                            <td
                                align="center"
                                className="border border-black/50 p-2"
                            >
                                {ymdToIdDate(attendance.check_in?.toString())}
                            </td>
                            {attendance?.status == "ABSENT" ? (
                                <>
                                    <td
                                        colSpan={3}
                                        align="center"
                                        className="border border-black/50 p-2"
                                    >
                                        {statuses(attendance?.status)}
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td
                                        align="center"
                                        className="border border-black/50 p-2"
                                    >
                                        {ymdToIdDate(
                                            attendance.check_in?.toString(),
                                            true,
                                            true
                                        )}
                                    </td>
                                    <td
                                        align="center"
                                        className="border border-black/50 p-2"
                                    >
                                        {attendance?.check_out != null
                                            ? ymdToIdDate(
                                                  attendance.check_out?.toString(),
                                                  true,
                                                  true
                                              )
                                            : "-"}
                                    </td>
                                    <td
                                        align="center"
                                        className="border border-black/50 p-2"
                                    >
                                        {attendance?.check_out != null
                                            ? statuses(attendance.status)
                                            : "-"}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </PDFExportLayout>
    );
}

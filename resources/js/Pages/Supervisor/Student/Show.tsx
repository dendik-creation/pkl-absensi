import KeyAndValue from "@/Components/custom/KeyAndValue";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { ymdToIdDate } from "@/Services/additionalService";
import { Attendance } from "@/Types/attendance";
import { Journal } from "@/Types/journal";
import { Student } from "@/Types/student";
import { Link } from "@inertiajs/react";
import { ChevronRight, IdCard } from "lucide-react";
import { FaUserGear, FaHourglassHalf } from "react-icons/fa6";
import { HiBuildingStorefront } from "react-icons/hi2";

type SupervisorStudentShowProps = {
    title: string;
    student: Student;
    latest_activity: {
        attendance?: Attendance | null;
        journal?: Journal | null;
    };
};

export default function SupervisorStudentShow({
    title,
    student,
    latest_activity,
}: SupervisorStudentShowProps) {
    const nowDate = ymdToIdDate(new Date().toDateString());
    return (
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description="Detail informasi dan aktivitas"
            />

            <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                <div className="z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <IdCard className="text-slate-500" />
                        <h3 className="text-lg font-semibold">Identitas</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-muted font-semibold text-sm"></p>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-blue-100 to-white rounded-l-md"></div>
                <div className="flex flex-col z-10">
                    <KeyAndValue
                        keyIdentifier="NIS"
                        value={student.nis?.toString()}
                    />
                    <KeyAndValue
                        keyIdentifier="Nama"
                        value={student.full_name}
                    />
                    <KeyAndValue
                        keyIdentifier="Kelas & Jurusan"
                        value={`${student.class ?? "Tanpa kelas"} - ${
                            student.major ?? "Tanpa jurusan"
                        }`}
                    />
                </div>
            </Card>
            <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                <div className="z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <FaUserGear className="text-slate-500" size={18} />
                        <h3 className="text-lg font-semibold">Pembimbing</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-muted font-semibold text-sm"></p>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-blue-100 to-white rounded-l-md"></div>
                {student.workshop?.supervisor != null ? (
                    <div className="flex flex-col z-10">
                        <KeyAndValue
                            keyIdentifier="NIP"
                            value={student.workshop?.supervisor?.nip?.toString()}
                        />
                        <KeyAndValue
                            keyIdentifier="Nama"
                            value={`${student?.workshop?.supervisor.full_name} (Anda) `}
                        />
                        <KeyAndValue
                            keyIdentifier="Email"
                            value={student.workshop?.supervisor?.user?.email}
                        />
                    </div>
                ) : (
                    <p className="text-base z-10">
                        Siswa tidak memiliki pembimbing PKL
                    </p>
                )}
            </Card>
            <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                <div className="z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <HiBuildingStorefront
                            className="text-slate-500"
                            size={18}
                        />
                        <h3 className="text-lg font-semibold">
                            Tempat PKL (DuDi)
                        </h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-muted font-semibold text-sm"></p>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-blue-100 to-white rounded-l-md"></div>
                <div className="flex flex-col z-10">
                    <Link
                        className="flex items-center gap-1 justify-start text-blue-700 hover:text-blue-800"
                        href={`/supervisor/workshop/${student?.workshop?.id}`}
                    >
                        <KeyAndValue
                            keyIdentifier="Nama DuDi"
                            value={`${student?.workshop?.name} `}
                        />
                        <ChevronRight className="mt-3" size={18} />
                    </Link>
                    <KeyAndValue
                        keyIdentifier="Nama Pemilik"
                        value={student.workshop?.owner_name}
                    />
                    <KeyAndValue
                        keyIdentifier="Telepon"
                        value={student.workshop?.phone}
                    />
                    <KeyAndValue
                        keyIdentifier="Alamat"
                        value={student.workshop?.address}
                    />
                </div>
            </Card>
            <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                <div className="z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <FaHourglassHalf className="text-slate-500" size={18} />
                        <h3 className="text-lg font-semibold">
                            <span>Aktivitas Terakhir</span>{" "}
                            <span className="text-sm font-normal">
                                ({nowDate})
                            </span>
                        </h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-muted font-semibold text-sm"></p>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-blue-100 to-white rounded-l-md"></div>

                <div className="flex flex-col z-10">
                    <div className="mb-4">
                        <div className="flex items-center mb-2 gap-3">
                            <p className="text-sm font-semibold text-slate-600">
                                Absensi
                            </p>
                            <Link
                                className="text-sm flex text-blue-800 hover:text-blue-900"
                                href={`/supervisor/student/attendance?student_id=${student.id}`}
                            >
                                Lihat Semua
                                <ChevronRight className="mt-1" size={16} />
                            </Link>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm">
                                Masuk (
                                {latest_activity?.attendance?.check_in == null
                                    ? "-"
                                    : ymdToIdDate(
                                          new Date(
                                              latest_activity?.attendance?.check_in
                                          ).toISOString(),
                                          true
                                      )}
                                )
                            </span>
                            <span className="text-sm">
                                Pulang (
                                {latest_activity?.attendance?.check_out == null
                                    ? "-"
                                    : ymdToIdDate(
                                          new Date(
                                              latest_activity?.attendance?.check_out
                                          ).toISOString(),
                                          true
                                      )}
                                )
                            </span>
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="flex items-center gap-3">
                            <p className="text-sm font-semibold text-slate-600">
                                Jurnal
                            </p>
                            <Link
                                className="text-sm flex text-blue-800 hover:text-blue-900"
                                href={`/supervisor/student/journal?student_id=${student.id}`}
                            >
                                Lihat Semua
                                <ChevronRight className="mt-1" size={16} />
                            </Link>
                        </div>
                    </div>
                    <span
                        className="-mt-2"
                        dangerouslySetInnerHTML={{
                            __html: latest_activity?.journal?.activity
                                ? String(latest_activity?.journal?.activity)
                                : "-",
                        }}
                    />
                </div>
            </Card>
        </MainLayout>
    );
}

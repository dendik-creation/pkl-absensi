import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { DrawerConfirmAction } from "@/Components/custom/FormElement";
import KeyAndValue from "@/Components/custom/KeyAndValue";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { ymdToIdDate } from "@/Services/additionalService";
import { Student } from "@/Types/student";
import { Link, useForm } from "@inertiajs/react";
import { ChevronRight, IdCard, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { FaUserGear, FaHourglassHalf } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { HiBuildingStorefront } from "react-icons/hi2";

type AdminStudentShowProps = {
    title: string;
    student: Student;
    latest_activity: {
        attendance?: Attendance | null;
        journal?: Journal | null;
    };
};

export default function AdminStudentShow({
    title,
    student,
    latest_activity,
}: AdminStudentShowProps) {
    const nowDate = ymdToIdDate(new Date().toDateString());
    const [deleteDrawerOpen, setDeleteDrawerOpen] = useState<boolean>(false);
    const [onDelete, setOnDelete] = useState<boolean>(false);
    const { delete: destroy } = useForm();
    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        setDeleteDrawerOpen(false);
        setOnDelete(true);
        destroy(`/admin/student/${student.id}`, {
            onError: (error) => {
                setOnDelete(false);
                BlastSonner({
                    type: BlastType.ERROR,
                    message: error.message,
                });
            },
            onFinish: () => {
                setOnDelete(false);
            },
        });
    };
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
                        <Link
                            className="flex items-center gap-1 justify-start text-blue-700 hover:text-blue-800 w-fit"
                            href={`/admin/supervisor/${student?.workshop?.supervisor.id}`}
                        >
                            <KeyAndValue
                                keyIdentifier="Nama"
                                value={`${student?.workshop?.supervisor.full_name} `}
                            />
                            <ChevronRight className="mt-3" size={18} />
                        </Link>
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
                        href={`/admin/workshop/${student?.workshop?.id}`}
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
                    <div className="mb-2">
                        <p className="text-sm font-semibold text-slate-600">
                            Absensi
                        </p>
                        <div className="flex flex-col">
                            <span className="text-sm">
                                Masuk (
                                {latest_activity.attendance?.check_in == null
                                    ? "-"
                                    : ymdToIdDate(
                                          latest_activity.attendance?.check_in?.toDateString()
                                      )}
                                )
                            </span>
                            <span className="text-sm">
                                Pulang (
                                {latest_activity.attendance?.check_out == null
                                    ? "-"
                                    : ymdToIdDate(
                                          latest_activity.attendance?.check_out?.toDateString()
                                      )}
                                )
                            </span>
                        </div>
                    </div>
                    <KeyAndValue
                        keyIdentifier="Jurnal"
                        value={latest_activity.journal?.activity}
                    />
                </div>
            </Card>

            <div className="flex justify-between items-center gap-8 mt-6">
                <Link
                    href={"/admin/student/" + student.id + "/edit"}
                    className="w-full"
                >
                    <Button
                        size={"lg"}
                        type="button"
                        variant="outline"
                        className="w-full bg-blue-200 border mb-5 hover:bg-blue-300 flex justify-center items-center gap-2"
                    >
                        <Pencil size={20} />
                        <span>Edit</span>
                    </Button>
                </Link>
                <div className="w-full">
                    <Button
                        size={"lg"}
                        type="button"
                        variant="outline"
                        className="w-full bg-red-200 border mb-5 hover:bg-red-300 flex justify-center items-center gap-2"
                        onClick={() => setDeleteDrawerOpen(true)}
                        disabled={onDelete}
                    >
                        {onDelete ? (
                            <span className="flex items-center gap-2">
                                <FiLoader className="animate-spin" size={20} />
                                <span>Hapus</span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Trash size={20} />
                                <span>Hapus</span>
                            </span>
                        )}
                    </Button>
                    <DrawerConfirmAction
                        title="Konfirmasi Hapus"
                        description="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
                        confirmAction={handleDelete}
                        isOpen={deleteDrawerOpen}
                        onClose={() => setDeleteDrawerOpen(false)}
                    />
                </div>
            </div>
        </MainLayout>
    );
}

import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { DrawerConfirmAction } from "@/Components/custom/FormElement";
import KeyAndValue from "@/Components/custom/KeyAndValue";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { ymdToIdDate } from "@/Services/additionalService";
import { Student } from "@/Types/student";
import { Supervisor } from "@/Types/supervisor";
import { Link, useForm } from "@inertiajs/react";
import { ChevronRight, IdCard, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { FaUserGear, FaHourglassHalf } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { HiBuildingStorefront } from "react-icons/hi2";
import { PiStudentFill } from "react-icons/pi";

type AdminSupervisorShowProps = {
    title: string;
    supervisor: Supervisor;
};

export default function AdminSupervisorShow({
    title,
    supervisor,
}: AdminSupervisorShowProps) {
    const nowDate = ymdToIdDate(new Date().toDateString());
    const [deleteDrawerOpen, setDeleteDrawerOpen] = useState<boolean>(false);
    const [onDelete, setOnDelete] = useState<boolean>(false);
    const { delete: destroy } = useForm();
    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        setDeleteDrawerOpen(false);
        setOnDelete(true);
        destroy(`/admin/supervisor/${supervisor.id}`, {
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
                description="Detail informasi pembimbing"
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
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-amber-100 to-white rounded-l-md"></div>
                <div className="flex flex-col z-10">
                    <KeyAndValue
                        keyIdentifier="NIP"
                        value={supervisor.nip?.toString()}
                    />
                    <KeyAndValue
                        keyIdentifier="Nama"
                        value={supervisor.full_name}
                    />
                    <KeyAndValue
                        keyIdentifier="Email"
                        value={`${supervisor.user?.email ?? "Tanpa email"}`}
                    />
                </div>
            </Card>
            {supervisor?.workshop != null ? (
                <div className="">
                    <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                        <div className="z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <HiBuildingStorefront
                                    className="text-slate-500"
                                    size={18}
                                />
                                <h3 className="text-lg font-semibold">
                                    Tempat Bertugas (DuDi)
                                </h3>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-muted font-semibold text-sm"></p>
                            </div>
                        </div>
                        <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-amber-100 to-white rounded-l-md"></div>
                        <div className="flex flex-col z-10">
                            <Link
                                className="flex items-center gap-2 justify-start text-amber-700                        hover:text-amber-800"
                                href={`/admin/workshop/${supervisor.workshop?.id}`}
                            >
                                <KeyAndValue
                                    keyIdentifier="Nama"
                                    value={`${supervisor.workshop?.name} `}
                                />
                                <ChevronRight className="mt-3" size={18} />
                            </Link>
                            <KeyAndValue
                                keyIdentifier="Nama Pemilik"
                                value={supervisor.workshop?.owner_name}
                            />
                            <KeyAndValue
                                keyIdentifier="Telepon"
                                value={supervisor.workshop?.phone}
                            />
                            <KeyAndValue
                                keyIdentifier="Alamat"
                                value={supervisor.workshop?.address}
                            />
                        </div>
                    </Card>

                    <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                        <div className="z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <PiStudentFill
                                    className="text-slate-500"
                                    size={18}
                                />
                                <h3 className="text-lg font-semibold">
                                    Siswa yang Didampingi (
                                    {supervisor?.workshop?.students?.length ??
                                        0}
                                    )
                                </h3>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-muted font-semibold text-sm"></p>
                            </div>
                        </div>
                        <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-amber-100 to-white rounded-l-md"></div>
                        {supervisor?.workshop?.students == null ||
                        supervisor?.workshop?.students?.length == 0 ? (
                            <div className="flex flex-col z-10">
                                <span>
                                    Tidak ada siswa PKL yang terdaftar pada DuDi
                                    ini
                                </span>
                            </div>
                        ) : (
                            <div className="flex overflow-x-auto z-10 snap-x snap-mandatory">
                                <div className="flex gap-4">
                                    {supervisor?.workshop.students.map(
                                        (student) => (
                                            <div
                                                key={student.id}
                                                className="min-w-full flex-shrink-0 snap-center"
                                            >
                                                <div className="flex flex-col gap-1 mb-2">
                                                    <Link
                                                        className="flex items-center gap-1 justify-start text-amber-700 hover:text-amber-800"
                                                        href={`/admin/student/${student?.id}`}
                                                    >
                                                        <KeyAndValue
                                                            keyIdentifier="NIS"
                                                            value={`${student?.nis} `}
                                                        />
                                                        <ChevronRight
                                                            className="mt-3"
                                                            size={18}
                                                        />
                                                    </Link>
                                                    <KeyAndValue
                                                        dense={true}
                                                        keyIdentifier="Nama"
                                                        value={
                                                            student.full_name ??
                                                            "-"
                                                        }
                                                    />
                                                    <KeyAndValue
                                                        keyIdentifier="Kelas & Jurusan"
                                                        value={`${
                                                            student.class ??
                                                            "Tanpa kelas"
                                                        } - ${
                                                            student.major ??
                                                            "Tanpa jurusan"
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            ) : (
                <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                    <div className="z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <HiBuildingStorefront
                                className="text-slate-500"
                                size={18}
                            />
                            <h3 className="text-lg font-semibold">
                                Tempat Bertugas (DuDi)
                            </h3>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-muted font-semibold text-sm"></p>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-amber-100 to-white rounded-l-md"></div>
                    <div className="flex flex-col z-10">
                        <span>Tidak bertugas di DuDi manapun</span>
                    </div>
                </Card>
            )}

            <div className="flex justify-between items-center gap-8 mt-6">
                <Link
                    href={"/admin/supervisor/" + supervisor.id + "/edit"}
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

import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { DrawerConfirmAction } from "@/Components/custom/FormElement";
import KeyAndValue from "@/Components/custom/KeyAndValue";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { Workshop } from "@/Types/workshop";
import { Link, useForm } from "@inertiajs/react";
import { ChevronRight, MapPinned, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { FaUserGear } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { HiBuildingStorefront } from "react-icons/hi2";
import { PiStudentFill } from "react-icons/pi";
import MapPicker from "@/Components/custom/MapPicker";
import { Separator } from "@/Components/ui/separator";

type AdminWorkshopShowProps = {
    title: string;
    workshop: Workshop;
};

export default function AdminWorkshopShow({
    title,
    workshop,
}: AdminWorkshopShowProps) {
    const [deleteDrawerOpen, setDeleteDrawerOpen] = useState<boolean>(false);
    const [onDelete, setOnDelete] = useState<boolean>(false);
    const { delete: destroy } = useForm();
    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        setDeleteDrawerOpen(false);
        setOnDelete(true);
        destroy(`/admin/workshop/${workshop.id}`, {
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
                description="Detail informasi DuDi"
                backUrl="/admin/workshop"
            />

            <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                <div className="z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <HiBuildingStorefront className="text-slate-500" />
                        <h3 className="text-lg font-semibold">Identitas</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-muted font-semibold text-sm"></p>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-green-100 to-white rounded-l-md"></div>
                <div className="flex flex-col z-10">
                    <KeyAndValue
                        keyIdentifier="Nama DuDi"
                        value={workshop.name}
                    />
                    <KeyAndValue
                        keyIdentifier="Nama Pemilik"
                        value={workshop.owner_name ?? "-"}
                    />
                    <KeyAndValue
                        keyIdentifier="No Telepon"
                        value={workshop.phone ?? "-"}
                    />
                    <KeyAndValue
                        keyIdentifier="Alamat"
                        value={workshop.address ?? "-"}
                    />
                </div>
            </Card>
            <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                <div className="z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <FaUserGear className="text-slate-500" size={18} />
                        <h3 className="text-lg font-semibold">
                            Pembimbing siswa PKL (Guru)
                        </h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-muted font-semibold text-sm"></p>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-green-100 to-white rounded-l-md"></div>
                {workshop?.supervisor == null ? (
                    <div className="flex flex-col z-10">
                        <span>
                            Tidak ada pembimbing yang ditugaskan untuk DuDi ini
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col z-10">
                        <KeyAndValue
                            keyIdentifier="NIP"
                            value={workshop.supervisor?.nip ?? "-"}
                        />
                        <Link
                            className="flex items-center gap-1 justify-start text-green-700 hover:text-green-800 w-fit"
                            href={`/admin/supervisor/${workshop?.supervisor.id}`}
                        >
                            <KeyAndValue
                                keyIdentifier="Nama"
                                value={`${workshop?.supervisor.full_name} `}
                            />
                            <ChevronRight className="mt-3" size={18} />
                        </Link>
                        <KeyAndValue
                            keyIdentifier="Email"
                            value={workshop.supervisor?.user?.email ?? "-"}
                        />
                    </div>
                )}
            </Card>

            <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                <div className="z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <PiStudentFill className="text-slate-500" size={18} />
                        <h3 className="text-lg font-semibold">
                            Siswa PKL ({workshop.students?.length ?? 0})
                        </h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-muted font-semibold text-sm"></p>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-green-100 to-white rounded-l-md"></div>
                {workshop?.students == null ||
                workshop?.students?.length == 0 ? (
                    <div className="flex flex-col z-10">
                        <span>
                            Tidak ada siswa PKL yang terdaftar pada DuDi ini
                        </span>
                    </div>
                ) : (
                    <div className="flex overflow-x-auto z-10 snap-x snap-mandatory">
                        {workshop.students?.length ? (
                            workshop.students.map((student, index) => (
                                <div
                                    key={student.id}
                                    className="flex flex-col gap-1 snap-center min-w-full"
                                >
                                    <Link
                                        className="flex items-center gap-1 justify-start text-green-700 hover:text-green-800 w-fit"
                                        href={`/admin/student/${student?.id}`}
                                    >
                                        <KeyAndValue
                                            dense={true}
                                            keyIdentifier="NIS"
                                            value={`${student?.nis} `}
                                        />
                                        <ChevronRight
                                            className="mt-5"
                                            size={18}
                                        />
                                    </Link>
                                    <KeyAndValue
                                        dense={true}
                                        keyIdentifier="Nama"
                                        value={student.full_name ?? "-"}
                                    />
                                    <KeyAndValue
                                        keyIdentifier="Kelas & Jurusan"
                                        value={`${
                                            student.class ?? "Tanpa kelas"
                                        } - ${
                                            student.major ?? "Tanpa jurusan"
                                        }`}
                                    />
                                </div>
                            ))
                        ) : (
                            <span>
                                Tidak ada siswa yang terdaftar pada DuDi ini
                            </span>
                        )}
                    </div>
                )}
            </Card>

            <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                <div className="z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPinned className="text-slate-500" size={18} />
                        <h3 className="text-lg font-semibold">
                            Koordinat DuDi
                        </h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-muted font-semibold text-sm"></p>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-green-100 to-white rounded-l-md"></div>
                {workshop.latitude == null || workshop.longitude == null ? (
                    <div className="flex flex-col z-10">
                        <span>Titik koordinat DuDi tidak ditentukan</span>
                    </div>
                ) : (
                    <MapPicker
                        readonly={true}
                        latitude={workshop.latitude ?? undefined}
                        longitude={workshop.longitude ?? undefined}
                    />
                )}
            </Card>

            <div className="flex justify-between items-center gap-8 mt-6">
                <Link
                    href={"/admin/workshop/" + workshop.id + "/edit"}
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

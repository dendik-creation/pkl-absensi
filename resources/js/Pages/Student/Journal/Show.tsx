import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { DrawerConfirmAction } from "@/Components/custom/FormElement";
import KeyAndValue from "@/Components/custom/KeyAndValue";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { ymdToIdDate } from "@/Services/additionalService";
import { Journal } from "@/Types/journal";
import { Link, useForm } from "@inertiajs/react";
import { Activity, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";

type StudentJournalShowProps = {
    title: string;
    journal: Journal;
};

export default function StudentJournalShow({
    title,
    journal,
}: StudentJournalShowProps) {
    const nowDate = ymdToIdDate(new Date().toDateString());
    const [deleteDrawerOpen, setDeleteDrawerOpen] = useState<boolean>(false);
    const [onDelete, setOnDelete] = useState<boolean>(false);
    const { delete: destroy } = useForm();
    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        setDeleteDrawerOpen(false);
        setOnDelete(true);
        destroy(`/student/journal/${journal.id}`, {
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
                description="Detail aktivitas siswa"
            />

            <Card className="shadow-md p-4 mb-4 flex flex-col relative overflow-hidden">
                <div className="z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Activity className="text-slate-500" />
                        <h3 className="text-lg font-semibold">
                            Aktivitas Kamu
                        </h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-muted font-semibold text-sm">A</p>
                    </div>
                </div>
                <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-blue-100 to-white rounded-l-md"></div>
                <div className="flex flex-col z-10">
                    <KeyAndValue
                        keyIdentifier="Hari dan Tanggal"
                        value={ymdToIdDate(
                            journal.date.toString(),
                            false,
                            false,
                            true
                        )}
                    />
                    <KeyAndValue
                        keyIdentifier="Kegiatan"
                        value={journal.activity}
                        htmlContent={true}
                    />
                </div>
            </Card>

            <div className="flex justify-between items-center gap-8 mt-6">
                <Link
                    href={"/student/journal/" + journal.id + "/edit"}
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

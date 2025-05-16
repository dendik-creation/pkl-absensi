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

type SupervisorStudentJournalShowProps = {
    title: string;
    journal: Journal;
};

export default function SupervisorStudentJournalShow({
    title,
    journal,
}: SupervisorStudentJournalShowProps) {
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
                            Aktivitas Siswa
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
        </MainLayout>
    );
}

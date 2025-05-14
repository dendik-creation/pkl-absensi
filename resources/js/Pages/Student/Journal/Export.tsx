import PDFExportLayout from "@/Layouts/PDFExportLayout";
import { ymdToIdDate } from "@/Services/additionalService";
import { Journal } from "@/Types/journal";
import { Student } from "@/Types/student";
import React from "react";

type StudentJournalExportProps = {
    title?: string;
    student: Student;
    setting: GlobalSetting;
    journals: Journal[];
    month_selected?: string;
};

export default function StudentJournalExport({
    title,
    student,
    setting,
    journals,
    month_selected,
}: StudentJournalExportProps) {
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
    return (
        <PDFExportLayout title={title as string} appSetting={setting}>
            <h3 className="font-bold text-xl mb-3">
                {month_selected == null
                    ? "Jurnal Siswa PKL Keseluruhan"
                    : `Jurnal Siswa PKL Bulan ${
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
                        <th className="border border-black/50 bg-amber-400 text-white p-2">
                            No
                        </th>
                        <th className="border border-black/50 bg-amber-400 text-white p-2">
                            Tanggal
                        </th>
                        <th className="border border-black/50 bg-amber-400 text-white p-2">
                            Kegiatan
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {journals.map((journal, index) => (
                        <tr key={journal.id}>
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
                                {ymdToIdDate(journal.date.toString())}
                            </td>
                            <td className="border border-black/50 p-2">
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: journal.activity,
                                    }}
                                ></span>
                                <style>
                                    {`
                                        td img {
                                            max-width: 300px;
                                            max-height: 300px;
                                        }
                                    `}
                                </style>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </PDFExportLayout>
    );
}

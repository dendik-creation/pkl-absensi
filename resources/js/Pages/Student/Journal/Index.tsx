import { DatePickerInput } from "@/Components/custom/FormElement";
import NotFoundInList from "@/Components/custom/NotFoundInList";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { inputDebounce, ymdToIdDate } from "@/Services/additionalService";
import { Link, router } from "@inertiajs/react";
import { ChevronRight, PlusCircle } from "lucide-react";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { Journal } from "@/Types/journal";

export type StudentJournalIndexProps = {
    title?: string;
    journals: Journal[];
    has_journal_today?: boolean;
    has_attendance_today?: boolean;
};

export default function StudentJournalIndex({
    title,
    journals,
    has_journal_today,
    has_attendance_today,
}: StudentJournalIndexProps) {
    const { flash } = usePage().props as any;
    const [journalsData, setJournalsData] = useState<Journal[]>(journals);
    const [searchValue, setSearchValue] = useState<string>("");

    if (flash.success) {
        BlastSonner({
            type: BlastType.SUCCESS,
            message: flash.success,
        });
    }

    if (flash.error) {
        BlastSonner({
            type: BlastType.ERROR,
            message: flash.error,
        });
    }

    const debouncedSearch = inputDebounce(async (value: string) => {
        router.get(
            "/student/journal",
            { date: value },
            {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    setJournalsData(page.props.journals as Journal[]);
                },
            }
        );
    });

    const handleSearch = (date: string | undefined) => {
        setSearchValue(date || "");
        debouncedSearch(date || "");
    };

    return (
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description="Aktivitas yang kamu lakukan selama PKL"
            />

            <DatePickerInput
                value={searchValue}
                mode="single"
                placeholder="Pilih Tanggal"
                onChange={handleSearch}
                className="mb-5 py-2"
            />

            {!has_journal_today && (
                <Link
                    href={
                        has_attendance_today ? "/student/journal/create" : "#"
                    }
                >
                    <Button
                        size={"lg"}
                        disabled={!has_attendance_today}
                        variant="outline"
                        className="w-full bg-green-200 border mb-5 hover:bg-green-300 flex justify-center items-center gap-2"
                    >
                        <PlusCircle size={20} />
                        <span>
                            {has_attendance_today
                                ? "Tambah Jurnal"
                                : "Kamu harus absensi masuk dahulu"}
                        </span>
                    </Button>
                </Link>
            )}

            <div className="grid grid-cols-1">
                {journalsData.length > 0 ? (
                    journalsData.map((journal, index) => (
                        <Link
                            key={index}
                            href={`/student/journal/${journal.id}`}
                        >
                            <Card className="shadow-md p-4 mb-3 flex items-center overflow-hidden justify-between relative">
                                <div className="z-10">
                                    <h3 className={`text-xl font-semibold`}>
                                        {ymdToIdDate(
                                            journal?.date?.toString() || ""
                                        )}
                                    </h3>
                                    <p className="text-base text-slate-600">
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    journal.activity?.length >
                                                    70
                                                        ? `${journal.activity.substring(
                                                              0,
                                                              70
                                                          )}...`
                                                        : journal.activity,
                                            }}
                                        />
                                    </p>
                                </div>
                                <ChevronRight
                                    size={28}
                                    className="text-amber-400 z-10"
                                />
                                <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-amber-100 to-white rounded-l-md"></div>
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

import {
    DatePickerInput,
    SelectSearchInput,
} from "@/Components/custom/FormElement";
import NotFoundInList from "@/Components/custom/NotFoundInList";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { inputDebounce, ymdToIdDate } from "@/Services/additionalService";
import { Link, router } from "@inertiajs/react";
import { ChevronRight, Download, FileDown, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { Journal } from "@/Types/journal";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

export type StudentJournalIndexProps = {
    title?: string;
    journals: Journal[];
    has_journal_today?: boolean;
    has_attended_today?: boolean;
};

export default function StudentJournalIndex({
    title,
    journals,
    has_journal_today,
    has_attended_today,
}: StudentJournalIndexProps) {
    const { flash } = usePage().props as any;
    const [journalsData, setJournalsData] = useState<Journal[]>(journals);
    const [dateFilter, setDateFilter] = useState<string>("");
    const [monthFilter, setMonthFilter] = useState<string>("");
    const [monthOptions, setMonthOptions] = useState<
        {
            label: string;
            value: string;
        }[]
    >([]);

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

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const dateParam = queryParams.get("date") || "";
        const monthParam = queryParams.get("month") || "";

        setDateFilter(dateParam);
        setMonthFilter(monthParam);

        if (dateParam || monthParam) {
            debounceValue(dateParam, monthParam);
        }
    }, []);

    useEffect(() => {
        const monthNow = new Date().getMonth() + 1;
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

        const updatedMonthOptions = monthNames.map((month, index) => {
            return {
                label: month,
                value: new Date(new Date().setMonth(index)).toLocaleString(
                    "id-ID",
                    {
                        month: "numeric",
                    }
                ),
            };
        });

        setMonthOptions((prev) => [...prev, ...updatedMonthOptions]);
    }, []);

    const debounceValue = inputDebounce(
        async (dateVal: string, monthVal: string) => {
            router.get(
                "/student/journal",
                { date: dateVal, month: monthVal },
                {
                    preserveState: true,
                    replace: true,
                    onSuccess: (page) => {
                        setJournalsData(page.props.journals as Journal[]);
                    },
                }
            );
        }
    );

    const handleMonth = (month: string | undefined) => {
        setMonthFilter(month || "");
        debounceValue(dateFilter, month || "");
        setDateFilter("");
    };

    const handleDate = (date: string | undefined) => {
        setMonthFilter("");
        setDateFilter(date || "");
        debounceValue(date || "");
    };

    return (
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description="Aktivitas yang kamu lakukan selama PKL"
            />

            <div className="grid grid-cols-2 gap-3 mb-5">
                <DatePickerInput
                    value={dateFilter}
                    mode="single"
                    placeholder="Pilih Tanggal"
                    onChange={handleDate}
                    className="py-2"
                />

                <SelectSearchInput
                    value={monthFilter}
                    placeholder="Pilih Bulan"
                    onChange={(value) =>
                        handleMonth(value as string | undefined)
                    }
                    options={monthOptions || []}
                    className="py-2"
                    removeValue={() => {
                        handleMonth("");
                    }}
                />
            </div>

            {!has_journal_today && (
                <Link
                    href={has_attended_today ? "/student/journal/create" : "#"}
                >
                    <Button
                        size={"lg"}
                        disabled={!has_attended_today}
                        variant="outline"
                        className="w-full bg-green-200 border mb-3 hover:bg-green-300 flex justify-center items-center gap-2"
                    >
                        <PlusCircle size={20} />
                        <span>
                            {has_attended_today
                                ? "Tambah Jurnal"
                                : "Kamu harus absensi masuk dahulu"}
                        </span>
                    </Button>
                </Link>
            )}
            <Popover>
                <PopoverTrigger asChild className="w-full">
                    <Button
                        size={"lg"}
                        variant="outline"
                        disabled={journalsData.length === 0}
                        className="w-full bg-blue-200 border mb-5 hover:bg-blue-300 flex justify-center items-center gap-2"
                    >
                        <FileDown size={20} />
                        <span>Export Jurnal</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent sideOffset={8} side={"bottom"} align="center">
                    <a
                        href={
                            "/student/journal/export?format=PDF&month=" +
                            monthFilter
                        }
                        target="_blank"
                    >
                        <Button
                            size={"sm"}
                            variant="outline"
                            className="w-full bg-amber-200 border mb-2 hover:bg-amber-300 flex justify-center items-center gap-2"
                        >
                            <Download size={20} />
                            <span>Format PDF</span>
                        </Button>
                    </a>
                    <a
                        href={
                            "/student/journal/export?format=XLSX&month=" +
                            monthFilter
                        }
                    >
                        <Button
                            size={"sm"}
                            variant="outline"
                            className="w-full bg-amber-200 border mb-2 hover:bg-amber-300 flex justify-center items-center gap-2"
                        >
                            <Download size={20} />
                            <span>Format Excel</span>
                        </Button>
                    </a>
                </PopoverContent>
            </Popover>

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

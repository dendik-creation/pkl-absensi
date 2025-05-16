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
import { Journal } from "@/Types/journal";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

export type SupervisorStudentJournalIndexProps = {
    title?: string;
    journals: Journal[];
    student_options: {
        label: string;
        value: string;
    }[];
};

export default function SupervisorStudentJournalIndex({
    title,
    journals,
    student_options,
}: SupervisorStudentJournalIndexProps) {
    const [journalsData, setJournalsData] = useState<Journal[]>(journals);
    const [dateFilter, setDateFilter] = useState<string>("");
    const [monthFilter, setMonthFilter] = useState<string>("");
    const [studentFilter, setStudentFilter] = useState<string>("");
    const [monthOptions, setMonthOptions] = useState<
        {
            label: string;
            value: string;
        }[]
    >([]);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const dateParam = queryParams.get("date") || "";
        const monthParam = queryParams.get("month") || "";
        const studentParam = queryParams.get("student_id") || "";

        setDateFilter(dateParam);
        setMonthFilter(monthParam);
        setStudentFilter(studentParam);

        if (dateParam || monthParam || studentParam) {
            debounceValue(dateParam, monthParam, studentParam);
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
        async (dateVal: string, monthVal: string, studentVal: string) => {
            router.get(
                "/supervisor/student/journal",
                { date: dateVal, month: monthVal, student_id: studentVal },
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
        debounceValue(dateFilter, month, studentFilter || "");
        setDateFilter("");
    };

    const handleDate = (date: string | undefined) => {
        setMonthFilter("");
        setDateFilter(date || "");
        debounceValue(date || "");
    };

    const handleStudent = (student: string | undefined) => {
        setStudentFilter(student || "");
        setDateFilter("");
        debounceValue(dateFilter, monthFilter, student || "");
    };

    return (
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description="Aktivitas yang dilakukan siswa selama PKL"
            />

            <div className="grid grid-cols-2 gap-3 mb-5">
                <SelectSearchInput
                    value={studentFilter}
                    placeholder="Pilih Siswa"
                    onChange={(value) =>
                        handleStudent(value.toString() as string | undefined)
                    }
                    options={student_options || []}
                    className="py-2 col-span-2"
                    removeValue={() => {
                        handleStudent("");
                    }}
                />
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

            {/* <Popover>
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
            </Popover> */}

            <div className="grid grid-cols-1">
                {journalsData.length > 0 ? (
                    journalsData.map((journal, index) => (
                        <Link
                            key={index}
                            href={`/supervisor/student/journal/${journal.id}`}
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

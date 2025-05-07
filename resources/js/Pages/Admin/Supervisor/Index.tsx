import { ImportFileDrawer, SearchInput } from "@/Components/custom/FormElement";
import NotFoundInList from "@/Components/custom/NotFoundInList";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { inputDebounce } from "@/Services/additionalService";
import { Link, router, useForm } from "@inertiajs/react";
import { ArrowUpFromLine, ChevronRight, PlusCircle } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { usePage } from "@inertiajs/react";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { Supervisor } from "@/Types/supervisor";

export type AdminSupervisorIndexProps = {
    title?: string;
    supervisors: Supervisor[];
};

export default function AdminSupervisorIndex({
    title,
    supervisors,
}: AdminSupervisorIndexProps) {
    const { flash } = usePage().props as any;
    const [supervisorsData, setSupervisorsData] =
        useState<Supervisor[]>(supervisors);
    const [searchValue, setSearchValue] = useState<string>("");

    const [importDrawerOpen, setImportDrawerOpen] = useState<boolean>(false);
    const [onImport, setOnImport] = useState<boolean>(false);

    const { data, post, setData } = useForm({
        file_excel: null as File | null,
    });
    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file_excel) return;

        setOnImport(true);

        post(`/admin/supervisor/import`, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            preserveScroll: true,
            replace: true,
            onError: (error: any) => {
                setOnImport(false);
                BlastSonner({
                    type: BlastType.ERROR,
                    message: error.message,
                });
            },
            onFinish: () => {
                setOnImport(false);
                setImportDrawerOpen(false);
                setData("file_excel", null);
            },
        });
    };

    if (flash.success) {
        BlastSonner({
            type: BlastType.SUCCESS,
            message: flash.success,
        });
    }

    const debouncedSearch = inputDebounce(async (value: string) => {
        router.get(
            "/admin/supervisor",
            { search: value },
            {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    setSupervisorsData(page.props.supervisors as Supervisor[]);
                },
            }
        );
    });

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        debouncedSearch(value);
    };

    return (
        <MainLayout title="Data Pembimbing">
            <PageTitle
                title={title as string}
                description="Data pembinbing yang bertugas di DuDi"
            />

            <SearchInput
                className="mb-5"
                value={searchValue}
                onChange={handleSearch}
                placeholder="Cari NIP atau nama pembimbing"
            />

            <Link href={"/admin/supervisor/create"}>
                <Button
                    size={"lg"}
                    variant="outline"
                    className="w-full bg-green-200 border mb-3 hover:bg-green-300 flex justify-center items-center gap-2"
                >
                    <PlusCircle size={20} />
                    <span>Tambah Pembimbing</span>
                </Button>
            </Link>

            <div className="w-full">
                <Button
                    size={"lg"}
                    onClick={() => setImportDrawerOpen(true)}
                    variant="outline"
                    className="w-full bg-blue-200 border mb-5 hover:bg-blue-300 flex justify-center items-center gap-2"
                >
                    <ArrowUpFromLine size={20} />
                    <span>Import Data Pembimbing</span>
                </Button>
                <ImportFileDrawer
                    title="Import Data Pembimbing"
                    description="Import data Pembimbing dari file excel"
                    file={data.file_excel}
                    onFileChange={(file: File | null) =>
                        setData("file_excel", file)
                    }
                    submitting={onImport}
                    onSubmit={handleImport}
                    isOpen={importDrawerOpen}
                    templatePath="assets/files/template/import-pembimbing-pkl.xlsx"
                    onClose={() => setImportDrawerOpen(false)}
                />
            </div>

            <div className="grid grid-cols-1">
                {supervisorsData.length > 0 ? (
                    supervisorsData.map((supervisor, index) => (
                        <Link
                            key={index}
                            href={`/admin/supervisor/${supervisor.id}`}
                        >
                            <Card className="shadow-md p-4 mb-3 flex items-center overflow-hidden justify-between relative">
                                <div className="z-10">
                                    <h3
                                        className={`text-xl font-semibold ${
                                            supervisor?.nip ?? "italic"
                                        }`}
                                    >
                                        {supervisor.nip ?? "NIP tidak ada"}
                                    </h3>
                                    <p className="text-base">
                                        {supervisor?.full_name}{" "}
                                        <span className="text-sm">
                                            {" - "}
                                            {supervisor?.user?.email ??
                                                "Tanpa email"}
                                        </span>
                                    </p>
                                    {supervisor?.workshops?.length > 0 ? (
                                        <div className="">
                                            <p className="text-base">
                                                Bertugas di{" "}
                                                <span className="font-medium text-slate-700">
                                                    {
                                                        supervisor?.workshops
                                                            ?.length
                                                    }{" "}
                                                    DuDi
                                                </span>
                                            </p>
                                            <p className="text-base">
                                                Mendampingi{" "}
                                                <span className="font-medium">
                                                    {supervisor?.workshops?.reduce(
                                                        (total, workshop) =>
                                                            total +
                                                            (workshop?.students
                                                                ?.length || 0),
                                                        0
                                                    )}{" "}
                                                </span>
                                                Siswa
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-base">
                                            Tidak bertugas di DuDi apapun
                                        </p>
                                    )}
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

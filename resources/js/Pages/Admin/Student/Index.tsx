import { ImportFileDrawer, SearchInput } from "@/Components/custom/FormElement";
import NotFoundInList from "@/Components/custom/NotFoundInList";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { inputDebounce } from "@/Services/additionalService";
import { Student } from "@/Types/student";
import { Link, router, useForm } from "@inertiajs/react";
import { ArrowUpFromLine, ChevronRight, PlusCircle } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { usePage } from "@inertiajs/react";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";

export type AdminStudentIndexProps = {
    title?: string;
    students: Student[];
};

export default function AdminStudentIndex({
    title,
    students,
}: AdminStudentIndexProps) {
    const { flash } = usePage().props as any;
    const [studentsData, setStudentsData] = useState<Student[]>(students);
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

        post(`/admin/student/import`, {
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
            "/admin/student",
            { search: value },
            {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    setStudentsData(page.props.students as Student[]);
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
        <MainLayout title="Data Siswa">
            <PageTitle
                title={title as string}
                description="Seluruh informasi siswa yang terdafar disistem"
            />

            <SearchInput
                className="mb-5"
                value={searchValue}
                onChange={handleSearch}
                placeholder="Cari NIS atau nama siswa"
            />

            <Link href={"/admin/student/create"}>
                <Button
                    size={"lg"}
                    variant="outline"
                    className="w-full bg-green-200 border mb-3 hover:bg-green-300 flex justify-center items-center gap-2"
                >
                    <PlusCircle size={20} />
                    <span>Tambah Siswa</span>
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
                    <span>Import Data Siswa</span>
                </Button>
                <ImportFileDrawer
                    title="Import Data Siswa"
                    description="Import data siswa dari file excel"
                    file={data.file_excel}
                    onFileChange={(file: File | null) =>
                        setData("file_excel", file)
                    }
                    submitting={onImport}
                    onSubmit={handleImport}
                    isOpen={importDrawerOpen}
                    templatePath="assets/files/template/import-siswa-pkl.xlsx"
                    onClose={() => setImportDrawerOpen(false)}
                />
            </div>

            <div className="grid grid-cols-1">
                {studentsData.length > 0 ? (
                    studentsData.map((student, index) => (
                        <Link key={index} href={`/admin/student/${student.id}`}>
                            <Card className="shadow-md p-4 mb-3 flex items-center overflow-hidden justify-between relative">
                                <div className="z-10">
                                    <h3 className="text-xl font-semibold">
                                        {student.nis ?? "NIM tidak ada"}
                                    </h3>
                                    <p className="text-base">
                                        {student?.full_name}
                                    </p>
                                    <p className="text-sm">
                                        {student.class ?? "Tanpa kelas"} -{" "}
                                        {student.major ?? "Tanpa jurusan"}
                                    </p>
                                    {/* <p className="text-sm">
                                        {student?.user?.email ?? "Tanpa email"}
                                    </p> */}
                                </div>
                                <ChevronRight
                                    size={28}
                                    className="text-blue-400 z-10"
                                />
                                <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-blue-100 to-white rounded-l-md"></div>
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

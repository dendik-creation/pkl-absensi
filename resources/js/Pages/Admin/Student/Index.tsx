import NotFoundInList from "@/Components/custom/NotFoundInList";
import SearchInput from "@/Components/custom/SearchInput";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { inputDebounce } from "@/Services/additionalService";
import { Student } from "@/Types/student";
import { router } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { ChangeEvent, useState } from "react";

export type AdminStudentIndexProps = {
    title?: string;
    students: Student[];
};

export default function AdminStudentIndex({
    title,
    students,
}: AdminStudentIndexProps) {
    const [studentsData, setStudentsData] = useState<Student[]>(students);
    const [searchValue, setSearchValue] = useState<string>("");

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
                placeholder="Cari NIM atau nama siswa"
            />

            <div className="grid grid-cols-1">
                {studentsData.length > 0 ? (
                    studentsData.map((student, index) => (
                        <Card
                            key={index}
                            className="shadow-md p-4 flex items-center justify-between"
                        >
                            <div className="">
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
                                <p className="text-sm">
                                    {student?.user?.email ?? "Tanpa email"}
                                </p>
                            </div>
                            <ChevronRight size={28} className="text-gray-500" />
                        </Card>
                    ))
                ) : (
                    <NotFoundInList />
                )}
            </div>
        </MainLayout>
    );
}

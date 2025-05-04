import { SearchInput } from "@/Components/custom/FormElement";
import NotFoundInList from "@/Components/custom/NotFoundInList";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { inputDebounce } from "@/Services/additionalService";
import { Student } from "@/Types/student";
import { Link, router } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { usePage } from "@inertiajs/react";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";

export type SupervisorStudentIndexProps = {
    title?: string;
    students: Student[];
};

export default function SupervisorStudentIndex({
    title,
    students,
}: SupervisorStudentIndexProps) {
    const { flash } = usePage().props as any;
    const [studentsData, setStudentsData] = useState<Student[]>(students);
    const [searchValue, setSearchValue] = useState<string>("");

    if (flash.success) {
        BlastSonner({
            type: BlastType.SUCCESS,
            message: flash.success,
        });
    }

    const debouncedSearch = inputDebounce(async (value: string) => {
        router.get(
            "/supervisor/student",
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
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description="Siswa dibawah bimbingan Anda"
            />

            <SearchInput
                className="mb-5"
                value={searchValue}
                onChange={handleSearch}
                placeholder="Cari NIS atau nama siswa"
            />

            <div className="grid grid-cols-1">
                {studentsData.length > 0 ? (
                    studentsData.map((student, index) => (
                        <Link
                            key={index}
                            href={`/supervisor/student/${student.id}`}
                        >
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

import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { ErrorInput, SelectSearchInput } from "@/Components/custom/FormElement";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { handleNipNisInput } from "@/Services/additionalService";
import { Student } from "@/Types/student";
import { useForm } from "@inertiajs/react";
import React from "react";
import { FiLoader, FiSave } from "react-icons/fi";

type AdminStudentEditProps = {
    title?: string;
    student: Student;
    workshops: {
        label: string;
        value: string;
    }[];
};

export default function AdminStudentEdit({
    title,
    student,
    workshops,
}: AdminStudentEditProps) {
    const { data, setData, put, processing, errors, setError, clearErrors } =
        useForm({
            nis: student.nis || "",
            full_name: student.full_name || "",
            class: student.class || "",
            major: student.major || "",
            workshop_id: student.workshop_id?.toString() || "",
        });
    const handleErrorInput = () => {
        const fields: { key: keyof typeof data; message: string }[] = [
            { key: "nis", message: "NIS tidak boleh kosong" },
            { key: "full_name", message: "Nama tidak boleh kosong" },
            { key: "class", message: "Kelas tidak boleh kosong" },
            { key: "major", message: "Jurusan tidak boleh kosong" },
            { key: "workshop_id", message: "Tempat DuDi tidak boleh kosong" },
        ];

        let hasError = false;

        fields.forEach(({ key, message }) => {
            if (!data[key]) {
                setError(key, message);
                hasError = true;
            } else {
                clearErrors(key);
            }
        });

        return hasError;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const hasError = handleErrorInput();

        if (hasError) {
            return;
        }

        clearErrors();

        put(`/admin/student/${student.id}`, {
            preserveScroll: true,
            replace: true,
            onError: (errors) => {
                return BlastSonner({
                    type: BlastType.ERROR,
                    message: errors.message,
                });
            },
            onFinish: () => {
                clearErrors();
            },
        });
    };
    return (
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description="Perbarui informasi siswa"
            />
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">NIS Siswa</label>
                        <Input
                            type="text"
                            placeholder="Masukkan NIS"
                            value={data.nis}
                            onChange={(e) =>
                                setData(
                                    "nis",
                                    handleNipNisInput(e.target.value)
                                )
                            }
                            className={`py-6 ${
                                errors.nis ? "border-red-500" : ""
                            }`}
                        />
                        {errors.nis && <ErrorInput error={errors.nis} />}
                    </div>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Nama Siswa</label>
                        <Input
                            type="text"
                            placeholder="Masukkan Nama Lengkap"
                            value={data.full_name}
                            onChange={(e) =>
                                setData("full_name", e.target.value)
                            }
                            className={`py-6 ${
                                errors.full_name ? "border-red-500" : ""
                            }`}
                        />
                        {errors.full_name && (
                            <ErrorInput error={errors.full_name} />
                        )}
                    </div>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Kelas</label>
                        <Input
                            type="text"
                            placeholder="Masukkan Kelas"
                            value={data.class}
                            onChange={(e) => setData("class", e.target.value)}
                            className={`py-6 ${
                                errors.class ? "border-red-500" : ""
                            }`}
                        />
                        {errors.class && <ErrorInput error={errors.class} />}
                    </div>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Jurusan</label>
                        <Input
                            type="text"
                            placeholder="Masukkan Jurusan"
                            value={data.major}
                            onChange={(e) => setData("major", e.target.value)}
                            className={`py-6 ${
                                errors.major ? "border-red-500" : ""
                            }`}
                        />
                        {errors.major && <ErrorInput error={errors.major} />}
                    </div>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Tempat DuDi (Bengkel)
                        </label>
                        <SelectSearchInput
                            value={data.workshop_id}
                            options={workshops}
                            onChange={(value) =>
                                setData("workshop_id", value.toString())
                            }
                            placeholder="Pilih Tempat DuDi"
                            removeValue={() => setData("workshop_id", "")}
                        />
                        {errors.workshop_id && (
                            <ErrorInput error={errors.workshop_id} />
                        )}
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full mt-4 p-6 bg-blue-500 hover:bg-blue-600"
                    disabled={processing}
                >
                    {processing ? (
                        <FiLoader className="animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">
                            <FiSave />
                            <span>Simpan</span>
                        </span>
                    )}
                </Button>
            </form>
        </MainLayout>
    );
}

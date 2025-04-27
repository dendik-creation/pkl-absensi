import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { ErrorInput, SelectSearchInput } from "@/Components/custom/FormElement";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { handleNipNisInput } from "@/Services/additionalService";
import { Supervisor } from "@/Types/supervisor";
import { useForm } from "@inertiajs/react";
import React from "react";
import { FiLoader, FiSave } from "react-icons/fi";

type AdminSupervisorEditProps = {
    title?: string;
    supervisor: Supervisor;
    workshops: {
        label: string;
        value: string;
    }[];
};

export default function AdminSupervisorEdit({
    title,
    supervisor,
    workshops,
}: AdminSupervisorEditProps) {
    const { data, setData, put, processing, errors, setError, clearErrors } =
        useForm({
            nip: supervisor.nip || "",
            full_name: supervisor.full_name || "",
            email: supervisor?.user?.email || "",
            workshop_id: supervisor?.workshop?.id?.toString() || "",
        });
    const handleErrorInput = () => {
        const fields: { key: keyof typeof data; message: string }[] = [
            { key: "nip", message: "NIP tidak boleh kosong" },
            { key: "full_name", message: "Nama tidak boleh kosong" },
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

        put(`/admin/supervisor/${supervisor.id}`, {
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
                description="Perbarui data pembimbing"
            />
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">NIP</label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="Masukkan NIP"
                            value={data.nip}
                            onChange={(e) =>
                                setData(
                                    "nip",
                                    handleNipNisInput(e.target.value)
                                )
                            }
                            className={`py-6 ${
                                errors.nip ? "border-red-500" : ""
                            }`}
                        />
                        {errors.nip && <ErrorInput error={errors.nip} />}
                    </div>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Nama Pembimbing
                        </label>
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
                        <label className="text-base mb-1">
                            Email (Opsional)
                        </label>
                        <Input
                            type="email"
                            placeholder="Masukkan Email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className={`py-6 ${
                                errors.email ? "border-red-500" : ""
                            }`}
                        />
                        {errors.email && <ErrorInput error={errors.email} />}
                    </div>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Tempat DuDi (Opsional)
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
                    className="w-full mt-4 p-6 bg-amber-500 hover:bg-amber-600"
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

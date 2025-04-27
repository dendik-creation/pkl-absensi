"use client";

import { useForm } from "@inertiajs/react";
import { FiLoader, FiSave } from "react-icons/fi";
import React from "react";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { ErrorInput, SelectSearchInput } from "@/Components/custom/FormElement";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import MapPicker from "@/Components/custom/MapPicker";
import "leaflet/dist/leaflet.css";
import { Textarea } from "@/Components/ui/textarea";
import { getFullAddress } from "@/Services/additionalService";

type AdminWorkshopCreateProps = {
    title?: string;
    supervisors: {
        label: string;
        value: string;
    }[];
};

export default function AdminWorkshopCreate({
    title,
    supervisors,
}: AdminWorkshopCreateProps) {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            name: "",
            owner_name: "",
            phone: "",
            address: "",
            supervisor_id: "",
            latitude: "",
            longitude: "",
        });

    const handleErrorInput = () => {
        const fields: { key: keyof typeof data; message: string }[] = [
            { key: "name", message: "Nama tidak boleh kosong" },
            { key: "owner_name", message: "Nama Pemilik tidak boleh kosong" },
            { key: "phone", message: "Telepon tidak boleh kosong" },
            { key: "address", message: "Alamat tidak boleh kosong" },
            { key: "latitude", message: "Pilih lokasi di peta" },
            { key: "longitude", message: "Pilih lokasi di peta" },
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

        if (hasError) return;

        clearErrors();

        post("/admin/workshop", {
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
        <MainLayout title={title || ""}>
            <PageTitle
                title={title || "Tambah Workshop"}
                description="Mendaftarkan DuDi baru ke sistem"
            />
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Nama DuDi</label>
                        <Input
                            type="text"
                            placeholder="Masukkan Nama DuDi"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className={`py-6 ${
                                errors.name ? "border-red-500" : ""
                            }`}
                        />
                        {errors.name && <ErrorInput error={errors.name} />}
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Nama Pemilik</label>
                        <Input
                            type="text"
                            placeholder="Masukkan Nama Pemilik"
                            value={data.owner_name}
                            onChange={(e) =>
                                setData("owner_name", e.target.value)
                            }
                            className={`py-6 ${
                                errors.owner_name ? "border-red-500" : ""
                            }`}
                        />
                        {errors.owner_name && (
                            <ErrorInput error={errors.owner_name} />
                        )}
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Telepon (yang dapat dihubungi)
                        </label>
                        <Input
                            type="tel"
                            placeholder="Masukkan No Telepon"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className={`py-6 ${
                                errors.phone ? "border-red-500" : ""
                            }`}
                        />
                        {errors.phone && <ErrorInput error={errors.phone} />}
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Alamat Lengkap (Gunakan peta untuk memilih lokasi)
                        </label>
                        <Textarea
                            className="resize-none"
                            rows={4}
                            value={data.address ?? ""}
                            onChange={(e) => setData("address", e.target.value)}
                        />
                        {errors.address && (
                            <ErrorInput error={errors.address} />
                        )}
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Koordinat Alamat DuDi
                        </label>

                        <MapPicker
                            readonly={false}
                            onLocationPicked={(lat, lon) => {
                                setData("latitude", lat.toString());
                                setData("longitude", lon.toString());

                                getFullAddress(lat, lon).then((address) => {
                                    if (address) setData("address", address);
                                });
                            }}
                        />

                        {errors.latitude && errors.longitude && (
                            <ErrorInput error="Tentukan koordinat DuDi" />
                        )}
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Pembimbing PKL yang ditugaskan (Opsional)
                        </label>
                        <SelectSearchInput
                            value={data.supervisor_id}
                            options={supervisors}
                            onChange={(value) =>
                                setData("supervisor_id", value.toString())
                            }
                            placeholder="Pilih Pembimbing"
                        />
                        {errors.supervisor_id && (
                            <ErrorInput error={errors.supervisor_id} />
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 p-6 bg-green-500 hover:bg-green-600"
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

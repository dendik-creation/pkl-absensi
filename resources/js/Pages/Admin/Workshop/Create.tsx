"use client";

import { useForm } from "@inertiajs/react";
import { FiLoader, FiSave } from "react-icons/fi";
import React, { useEffect } from "react";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { ErrorInput, SelectSearchInput } from "@/Components/custom/FormElement";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import MapPicker from "@/Components/custom/MapPicker";
import "leaflet/dist/leaflet.css";
import { Textarea } from "@/Components/ui/textarea";
import {
    getFullAddress,
    handleNumericInput,
    inputDebounce,
} from "@/Services/additionalService";
import axios from "axios";

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
    const [onFindingAddress, setOnFindingAddress] = React.useState(false);
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            name: "",
            owner_name: "",
            phone: "",
            address: "",
            supervisor_id: "",
            latitude: null as number | null,
            longitude: null as number | null,
        });

    const handleErrorInput = () => {
        const fields: { key: keyof typeof data; message: string }[] = [
            { key: "name", message: "Nama tidak boleh kosong" },
            { key: "owner_name", message: "Nama Pemilik tidak boleh kosong" },
            { key: "phone", message: "Telepon tidak boleh kosong" },
            { key: "address", message: "Alamat tidak boleh kosong" },
            { key: "latitude", message: "Latitude tidak boleh kosong" },
            { key: "longitude", message: "Longitude tidak boleh kosong" },
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

    const debounceRevereseLocation = inputDebounce(async (url: string) => {
        try {
            setOnFindingAddress(true);
            const response = await axios(`/api/reverse-gmaps-url?url=${url}`);
            const { latitude, longitude } = response.data;
            setData("latitude", latitude);
            setData("longitude", longitude);
        } catch (error: any) {
            setOnFindingAddress(false);
            BlastSonner({
                message: error?.response?.data.error,
                type: BlastType.ERROR,
            });
        } finally {
            setOnFindingAddress(false);
        }
    });

    useEffect(() => {
        onChangedLatitudeLongitudeByInput();
    }, [data.latitude, data.longitude]);

    const onChangedLatitudeLongitudeByInput = inputDebounce(() => {
        if (data.latitude && data.longitude) {
            getFullAddress(
                data.latitude,
                data.longitude,
                setOnFindingAddress
            ).then((address) => {
                if (address) setData("address", address);
            });
        }
    });

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
                            Pembimbing PKL yang ditugaskan (Bisa nanti)
                        </label>
                        <SelectSearchInput
                            value={data.supervisor_id}
                            options={supervisors}
                            onChange={(value) =>
                                setData("supervisor_id", value.toString())
                            }
                            placeholder="Pilih Pembimbing"
                            removeValue={() => setData("supervisor_id", "")}
                        />
                        {errors.supervisor_id && (
                            <ErrorInput error={errors.supervisor_id} />
                        )}
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Lokasi Default (Untuk Preview Map)
                        </label>
                        <Input
                            type="url"
                            placeholder="Masukkan URL Pendek Google Maps"
                            onChange={(e) =>
                                debounceRevereseLocation(e.target.value)
                            }
                            className={`py-6 mb-3 ${
                                errors.latitude || errors.longitude
                                    ? "border-red-500"
                                    : ""
                            }`}
                        />
                    </div>
                </div>

                <div className="mb-5 flex items-center gap-2">
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1">
                            Koordinat Latitude
                        </label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            disabled={onFindingAddress}
                            placeholder="Masukkan Latitude"
                            value={
                                onFindingAddress
                                    ? "Menyesuaikan latitude"
                                    : data.latitude?.toString() ?? ""
                            }
                            onChange={(e) => {
                                const value = handleNumericInput(
                                    e.target.value
                                );
                                const parsedValue = parseFloat(value);

                                if (!isNaN(parsedValue)) {
                                    setData("latitude", parsedValue);
                                    onChangedLatitudeLongitudeByInput();
                                }
                            }}
                            onPaste={(e) => {
                                const pastedValue =
                                    e.clipboardData.getData("text");
                                const value = handleNumericInput(pastedValue);
                                const parsedValue = parseFloat(value);

                                if (!isNaN(parsedValue)) {
                                    setData("latitude", parsedValue);
                                    onChangedLatitudeLongitudeByInput();
                                }
                            }}
                            className={`py-6 ${
                                errors.latitude ? "border-red-500" : ""
                            }`}
                        />
                        {errors.latitude && (
                            <ErrorInput error={errors.latitude} />
                        )}
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-base mb-1">
                            Koordinat Longitude
                        </label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="Masukkan Longitude"
                            disabled={onFindingAddress}
                            value={
                                onFindingAddress
                                    ? "Menyesuaikan longitude"
                                    : data.longitude?.toString() ?? ""
                            }
                            onChange={(e) => {
                                const value = handleNumericInput(
                                    e.target.value
                                );
                                const parsedValue = parseFloat(value);

                                if (!isNaN(parsedValue)) {
                                    setData("longitude", parsedValue);
                                    onChangedLatitudeLongitudeByInput();
                                }
                            }}
                            onPaste={(e) => {
                                const pastedValue =
                                    e.clipboardData.getData("text");
                                const value = handleNumericInput(pastedValue);
                                const parsedValue = parseFloat(value);

                                if (!isNaN(parsedValue)) {
                                    setData("longitude", parsedValue);
                                    onChangedLatitudeLongitudeByInput();
                                }
                            }}
                            className={`py-6 ${
                                errors.longitude ? "border-red-500" : ""
                            }`}
                        />
                        {errors.longitude && (
                            <ErrorInput error={errors.longitude} />
                        )}
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Alamat Lengkap</label>
                        <div className="relative overflow-hidden">
                            <Textarea
                                className="resize-none"
                                rows={4}
                                disabled={onFindingAddress}
                                value={data.address ?? ""}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                            />
                            {onFindingAddress && (
                                <span className="absolute top-0 left-0 flex justify-center items-center w-full h-full text-xs text-gray-500">
                                    <FiLoader
                                        className="animate-spin"
                                        size={28}
                                    />
                                    <span className="ml-2">
                                        Menyesuaikan alamat...
                                    </span>
                                </span>
                            )}
                        </div>
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

                        <div className="relative overflow-hidden">
                            {onFindingAddress && (
                                <div className="absolute z-[10] rounded-lg h-full w-full bg-slate-50/50 rounded-white">
                                    <div className="flex flex-col gap-3 items-center justify-center h-full">
                                        <FiLoader
                                            className="animate-spin"
                                            size={64}
                                        />
                                        <h3>Menyesuaikan koordinat</h3>
                                    </div>
                                </div>
                            )}

                            <MapPicker
                                readonly={false}
                                latitude={data.latitude ?? undefined}
                                longitude={data.longitude ?? undefined}
                                onLocationPicked={(lat, lon) => {
                                    setData("latitude", lat);
                                    setData("longitude", lon);

                                    getFullAddress(
                                        lat,
                                        lon,
                                        setOnFindingAddress
                                    ).then((address) => {
                                        if (address)
                                            setData("address", address);
                                    });
                                }}
                            />
                        </div>

                        {errors.latitude && errors.longitude && (
                            <ErrorInput error="Tentukan koordinat DuDi" />
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 p-6 bg-green-500 hover:bg-green-600"
                    disabled={processing || onFindingAddress}
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

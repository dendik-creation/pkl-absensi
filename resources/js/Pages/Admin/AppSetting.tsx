import { ErrorInput } from "@/Components/custom/FormElement";
import { Input } from "@/Components/ui/input";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { useForm } from "@inertiajs/react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import React, { useState } from "react";
import MapPicker from "@/Components/custom/MapPicker";
import { Separator } from "@/Components/ui/separator";
import axios from "axios";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { inputDebounce } from "@/Services/additionalService";
import { FiLoader, FiSave } from "react-icons/fi";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

type AppSettingProps = {
    title: string;
    app_setting: GlobalSetting;
};

export default function AppSetting({ title, app_setting }: AppSettingProps) {
    const [appIconPond, setAppIconPond] = useState<any[]>([]);
    const [schoolIconPond, setSchoolIconPond] = useState<any[]>([]);
    const [onReversingMaps, setOnReversingMaps] = useState(false);

    const {
        data,
        setData,
        errors,
        post,
        processing,
        hasErrors,
        setError,
        clearErrors,
    } = useForm({
        app_name: app_setting.app_name ?? "",
        app_icon: null as File | null,
        default_latitude: app_setting.default_latitude ?? 0,
        default_longitude: app_setting.default_longitude ?? 0,
        max_attendance_radius: app_setting.max_attendance_radius ?? 0,
        check_in_start: app_setting.check_in_start ?? "",
        check_in_end: app_setting.check_in_end ?? "",
        check_out_start: app_setting.check_out_start ?? "",
        check_out_end: app_setting.check_out_end ?? "",
        // School Field
        school_name: app_setting.school_name ?? "",
        school_icon: null as File | null,
        school_address: app_setting.school_address ?? "",
        school_phone: app_setting.school_phone ?? "",
        school_email: app_setting.school_email ?? "",
        school_website: app_setting.school_website ?? "",
    });

    const loadInitiateAppIcon = async () => {
        if (app_setting.app_icon) {
            try {
                const imageUrl = app_setting.app_icon.startsWith("http")
                    ? app_setting.app_icon
                    : `${window.location.origin}${
                          app_setting.app_icon.startsWith("/") ? "" : "/"
                      }${app_setting.app_icon}`;

                const response = await fetch(imageUrl, { mode: "no-cors" });
                if (!response.ok) throw new Error("Failed to fetch image");

                const blob = await response.blob();
                const file = new File([blob], "favicon.png", {
                    type: blob.type,
                });

                setAppIconPond([
                    {
                        source: file,
                        options: {
                            type: "local",
                        },
                    },
                ]);
            } catch (error) {
                console.error("Error loading image:", error);
                setAppIconPond([]);
            }
        }
        if (app_setting.school_icon) {
            try {
                const imageUrl = app_setting.school_icon.startsWith("http")
                    ? app_setting.school_icon
                    : `${window.location.origin}${
                          app_setting.school_icon.startsWith("/") ? "" : "/"
                      }${app_setting.school_icon}`;

                const response = await fetch(imageUrl, { mode: "no-cors" });
                if (!response.ok) throw new Error("Failed to fetch image");

                const blob = await response.blob();
                const file = new File([blob], "favicon.png", {
                    type: blob.type,
                });

                setSchoolIconPond([
                    {
                        source: file,
                        options: {
                            type: "local",
                        },
                    },
                ]);
            } catch (error) {
                console.error("Error loading image:", error);
                setSchoolIconPond([]);
            }
        }
    };

    const handleLatLang = (key: string, value: number) => {
        if (key === "default_latitude") {
            setData("default_latitude", value || 0);
        } else if (key === "default_longitude") {
            setData("default_longitude", value || 0);
        }
    };

    const handleGetLatLong = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const mapsUrl = e.target.value;
        debounceRevereseLocation(mapsUrl);
    };

    const debounceRevereseLocation = inputDebounce(async (url: string) => {
        try {
            setOnReversingMaps(true);
            const response = await axios(`/api/reverse-gmaps-url?url=${url}`);
            const { latitude, longitude } = response.data;
            setData("default_latitude", latitude);
            setData("default_longitude", longitude);
        } catch (error: any) {
            setOnReversingMaps(false);
            BlastSonner({
                message: error?.response?.data.error,
                type: BlastType.ERROR,
            });
        } finally {
            setOnReversingMaps(false);
        }
    });

    const handleIcon = (key: "app_icon" | "school_icon", file: File | null) => {
        setData(key, file);
    };

    const validateForm: () => boolean = () => {
        const errors: any = {};
        if (!data.app_name) {
            errors.app_name = "Nama aplikasi tidak boleh kosong";
        }
        if (!data.app_icon) {
            errors.app_icon = "Ikon aplikasi tidak boleh kosong";
        }

        if (!data.school_name) {
            errors.school_name = "Nama sekolah tidak boleh kosong";
        }
        if (!data.school_icon) {
            errors.school_icon = "Logo sekolah tidak boleh kosong";
        }
        if (!data.school_address) {
            errors.school_address = "Alamat sekolah tidak boleh kosong";
        }
        if (!data.school_phone) {
            errors.school_phone = "Nomor telepon sekolah tidak boleh kosong";
        }
        if (!data.school_email) {
            errors.school_email = "Email sekolah tidak boleh kosong";
        }
        if (!data.school_website) {
            errors.school_website = "Website sekolah tidak boleh kosong";
        }

        if (!data.default_latitude || data.default_latitude === 0) {
            errors.default_latitude = "Latitude tidak boleh kosong";
        }
        if (!data.default_longitude || data.default_longitude === 0) {
            errors.default_longitude = "Longitude tidak boleh kosong";
        }
        if (!data.max_attendance_radius) {
            errors.max_attendance_radius =
                "Maksimum radius absensi tidak boleh kosong";
        }
        if (!data.check_in_start) {
            errors.check_in_start = "Jam buka absensi masuk tidak boleh kosong";
        }
        if (!data.check_in_end) {
            errors.check_in_end = "Jam tutup absensi masuk tidak boleh kosong";
        }
        if (!data.check_out_start) {
            errors.check_out_start =
                "Jam buka absensi pulang tidak boleh kosong";
        }
        if (!data.check_out_end) {
            errors.check_out_end =
                "Jam tutup absensi pulang tidak boleh kosong";
        }

        setError(errors);

        return Object.keys(errors).length === 0;
    };

    const submitForm = () => {
        post("/admin/app-setting/update", {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onSuccess: () => {
                BlastSonner({
                    message: "Pengaturan berhasil disimpan",
                    type: BlastType.SUCCESS,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            },
            onError: () => {
                BlastSonner({
                    message: "Gagal menyimpan pengaturan",
                    type: BlastType.ERROR,
                });
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            clearErrors();
            submitForm();
        }
    };

    return (
        <MainLayout title={title}>
            <PageTitle
                title={title}
                description="Genggaman aplikasi ada di tangan Anda"
            />
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Nama Aplikasi</label>
                        <Input
                            type="text"
                            placeholder="Masukkan Nama Aplikasi"
                            value={data.app_name}
                            onChange={(e) =>
                                setData("app_name", e.target.value)
                            }
                            className={`py-6 ${
                                errors.app_name ? "border-red-500" : ""
                            }`}
                        />
                        {errors.app_name && (
                            <ErrorInput error={errors.app_name} />
                        )}
                    </div>
                </div>

                <div className="">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Ikon Aplikasi</label>
                        <FilePond
                            oninit={loadInitiateAppIcon}
                            files={appIconPond}
                            onupdatefiles={(fileItems) => {
                                const selectedFile =
                                    fileItems.length > 0
                                        ? fileItems[0].file
                                        : null;
                                handleIcon(
                                    "app_icon",
                                    selectedFile as File | null
                                );
                                setAppIconPond(fileItems);
                            }}
                            allowImagePreview={true}
                            allowMultiple={false}
                            acceptedFileTypes={["image/jpeg", "image/png"]}
                            labelIdle='<span class="filepond--label-action">Cari File Gambar</span>'
                        />
                        {errors.app_icon && (
                            <ErrorInput error={errors.app_icon} />
                        )}
                    </div>
                </div>

                <Separator className="my-5 h-1 rounded-full bg-blue-200" />

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Nama Sekolah</label>
                        <Input
                            type="text"
                            placeholder="Masukkan Nama Sekolah"
                            value={data.school_name}
                            onChange={(e) =>
                                setData("school_name", e.target.value)
                            }
                            className={`py-6 ${
                                errors.school_name ? "border-red-500" : ""
                            }`}
                        />
                        {errors.school_name && (
                            <ErrorInput error={errors.school_name} />
                        )}
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Logo Sekolah</label>
                        <FilePond
                            oninit={loadInitiateAppIcon}
                            files={schoolIconPond}
                            onupdatefiles={(fileItems) => {
                                const selectedFile =
                                    fileItems.length > 0
                                        ? fileItems[0].file
                                        : null;
                                handleIcon(
                                    "school_icon",
                                    selectedFile as File | null
                                );
                                setSchoolIconPond(fileItems);
                            }}
                            allowImagePreview={true}
                            allowMultiple={false}
                            acceptedFileTypes={["image/jpeg", "image/png"]}
                            labelIdle='<span class="filepond--label-action">Cari File Gambar</span>'
                        />
                        {errors.school_icon && (
                            <ErrorInput error={errors.school_icon} />
                        )}
                    </div>
                </div>

                <div className="flex mb-5 w-full gap-3 items-center">
                    <div className="w-full">
                        <div className="flex flex-col">
                            <label className="text-base mb-1">
                                Email Sekolah
                            </label>
                            <Input
                                type="email"
                                placeholder="Masukkan Email Sekolah"
                                value={data.school_email}
                                onChange={(e) =>
                                    setData("school_email", e.target.value)
                                }
                                className={`py-6 ${
                                    errors.school_email ? "border-red-500" : ""
                                }`}
                            />
                            {errors.school_email && (
                                <ErrorInput error={errors.school_email} />
                            )}
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-col">
                            <label className="text-base mb-1">
                                No Telepon Sekolah
                            </label>
                            <Input
                                type="tel"
                                placeholder="Masukkan No Telepon Sekolah"
                                value={data.school_phone}
                                onChange={(e) =>
                                    setData("school_phone", e.target.value)
                                }
                                className={`py-6 ${
                                    errors.school_phone ? "border-red-500" : ""
                                }`}
                            />
                            {errors.school_phone && (
                                <ErrorInput error={errors.school_phone} />
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Alamat Sekolah</label>
                        <Textarea
                            placeholder="Masukkan Alamat Sekolah"
                            value={data.school_address}
                            onChange={(e) =>
                                setData("school_address", e.target.value)
                            }
                            rows={3}
                            className={`resize-none ${
                                errors.school_address ? "border-red-500" : ""
                            }`}
                        />
                        {errors.school_address && (
                            <ErrorInput error={errors.school_address} />
                        )}
                    </div>
                </div>

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Webiste Sekolah
                        </label>
                        <Input
                            type="text"
                            placeholder="Masukkan Webiste Sekolah"
                            value={data.school_website}
                            onChange={(e) =>
                                setData("school_website", e.target.value)
                            }
                            className={`py-6 ${
                                errors.school_website ? "border-red-500" : ""
                            }`}
                        />
                        {errors.school_website && (
                            <ErrorInput error={errors.school_website} />
                        )}
                    </div>
                </div>

                <Separator className="my-5 h-1 rounded-full bg-blue-200" />

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Lokasi Default (Untuk Preview Map)
                        </label>
                        <Input
                            type="url"
                            placeholder="Masukkan URL Pendek Google Maps"
                            onChange={handleGetLatLong}
                            className={`py-6 mb-3 ${
                                errors.default_latitude ||
                                errors.default_longitude
                                    ? "border-red-500"
                                    : ""
                            }`}
                        />

                        <div className="flex gap-4 items-center">
                            <div className="w-full">
                                <label className="text-sm mb-1">Latitude</label>
                                <Input
                                    type="text"
                                    disabled={onReversingMaps}
                                    placeholder="Masukkan Longitude"
                                    onChange={(e) =>
                                        handleLatLang(
                                            "default_latitude",
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    value={
                                        onReversingMaps
                                            ? "Menyesuaikan Latitude"
                                            : data.default_latitude
                                    }
                                    className={`py-3 text-sm ${
                                        errors.default_latitude
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {errors.default_latitude && (
                                    <ErrorInput
                                        error={errors.default_latitude}
                                    />
                                )}
                            </div>
                            <div className="w-full">
                                <label className="text-sm mb-1">
                                    Longitude
                                </label>
                                <Input
                                    type="text"
                                    disabled={onReversingMaps}
                                    placeholder="Masukkan Longitude"
                                    onChange={(e) =>
                                        handleLatLang(
                                            "default_longitude",
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    value={
                                        onReversingMaps
                                            ? "Menyesuaikan Longitude"
                                            : data.default_longitude
                                    }
                                    className={`py-3 text-sm ${
                                        errors.default_longitude
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {errors.default_longitude && (
                                    <ErrorInput
                                        error={errors.default_longitude}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Preview Map</label>

                        <div className="relative overflow-hidden">
                            {onReversingMaps && (
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
                                readonly={onReversingMaps}
                                latitude={data.default_latitude ?? undefined}
                                longitude={data.default_longitude ?? undefined}
                                onLocationPicked={(lat, lon) => {
                                    setData("default_latitude", lat);
                                    setData("default_longitude", lon);
                                }}
                            />
                        </div>

                        {errors.default_latitude &&
                            errors.default_longitude && (
                                <ErrorInput error="Tentukan koordinat DuDi" />
                            )}
                    </div>
                </div>

                <Separator className="my-5 h-1 rounded-full bg-blue-200" />

                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Maksimum Radius Absensi (Meter)
                        </label>
                        <Input
                            type="number"
                            placeholder="Masukkan Radius"
                            value={data.max_attendance_radius}
                            onChange={(e) =>
                                setData(
                                    "max_attendance_radius",
                                    parseInt(e.target.value)
                                )
                            }
                            className={`py-6 ${
                                errors.max_attendance_radius
                                    ? "border-red-500"
                                    : ""
                            }`}
                        />
                        {errors.max_attendance_radius && (
                            <ErrorInput error={errors.max_attendance_radius} />
                        )}
                    </div>
                </div>
                <div className="mb-3 flex items-center gap-4">
                    <label className="text-sm mb-1 w-full">
                        Jam Buka Absensi Masuk
                    </label>
                    <div className="flex flex-col w-full">
                        <Input
                            type="time"
                            placeholder="Masukkan Waktu"
                            value={data.check_in_start}
                            onChange={(e) =>
                                setData("check_in_start", e.target.value)
                            }
                            className={`py-3 text-sm ${
                                errors.check_in_start ? "border-red-500" : ""
                            }`}
                        />
                        {errors.check_in_start && (
                            <ErrorInput error={errors.check_in_start} />
                        )}
                    </div>
                    <div className="flex flex-col w-full">
                        <Input
                            type="time"
                            placeholder="Masukkan Waktu"
                            value={data.check_in_end}
                            onChange={(e) =>
                                setData("check_in_end", e.target.value)
                            }
                            className={`py-3 text-sm ${
                                errors.check_in_end ? "border-red-500" : ""
                            }`}
                        />
                        {errors.check_in_end && (
                            <ErrorInput error={errors.check_in_end} />
                        )}
                    </div>
                </div>
                <div className="mb-3 flex items-center gap-4">
                    <label className="text-sm mb-1 w-full">
                        Jam Buka Absensi Pulang
                    </label>
                    <div className="flex flex-col w-full">
                        <Input
                            type="time"
                            placeholder="Masukkan Waktu"
                            value={data.check_out_start}
                            onChange={(e) =>
                                setData("check_out_start", e.target.value)
                            }
                            className={`py-3 text-sm ${
                                errors.check_out_start ? "border-red-500" : ""
                            }`}
                        />
                        {errors.check_out_start && (
                            <ErrorInput error={errors.check_out_start} />
                        )}
                    </div>
                    <div className="flex flex-col w-full">
                        <Input
                            type="time"
                            placeholder="Masukkan Waktu"
                            value={data.check_out_end}
                            onChange={(e) =>
                                setData("check_out_end", e.target.value)
                            }
                            className={`py-3 text-sm ${
                                errors.check_out_end ? "border-red-500" : ""
                            }`}
                        />
                        {errors.check_out_end && (
                            <ErrorInput error={errors.check_out_end} />
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
                            <span>Simpan Pengaturan</span>
                        </span>
                    )}
                </Button>
            </form>
        </MainLayout>
    );
}

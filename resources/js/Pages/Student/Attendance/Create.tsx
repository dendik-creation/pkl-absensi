import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { ErrorInput, SelectSearchInput } from "@/Components/custom/FormElement";
import KeyAndValue from "@/Components/custom/KeyAndValue";
import MapPicker from "@/Components/custom/MapPicker";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { MainLayout } from "@/Layouts/MainLayout";
import MustActiveOnAttendance from "@/Pages/Permisson/MustActiveOnAttendance";
import { PageTitle } from "@/Partials/PageTitle";
import { ymdToIdDate } from "@/Services/additionalService";
import { Student } from "@/Types/student";
import { useForm } from "@inertiajs/react";
import React, { useCallback, useEffect, useRef } from "react";
import { FiLoader, FiSave } from "react-icons/fi";

type StudentAttendanceCreateProps = {
    title: string;
    student: Student;
    max_radius: number;
};

export default function StudentAttendanceCreate({
    title,
    student,
    max_radius,
}: StudentAttendanceCreateProps) {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            check_in: new Date().toString(),
            check_out: "",
            status: "PRESENT",
            reason: "",
            latitude_in: 0.0,
            longitude_in: 0.0,
            latitude_out: 0.0,
            longitude_out: 0.0,
            isInRadius: false as boolean,
        });

    const validateRequiredFields = useCallback((): boolean => {
        const fields: { key: keyof typeof data; message: string }[] = [
            { key: "check_in", message: "Absensi Masuk tidak boleh kosong" },
            { key: "status", message: "Status tidak boleh kosong" },
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
    }, [data, setError, clearErrors]);

    const calculateDistance = (
        lat1: number,
        lng1: number,
        lat2: number,
        lng2: number
    ): number => {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371e3; // Earth radius in meters

        const φ1 = toRad(lat1);
        const φ2 = toRad(lat2);
        const Δφ = toRad(lat2 - lat1);
        const Δλ = toRad(lng2 - lng1);

        const a =
            Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // in meters
    };

    const evaluateRadius = useCallback(() => {
        const { latitude_in, longitude_in } = data;
        const wsLat = student?.workshop?.latitude;
        const wsLng = student?.workshop?.longitude;

        if (!latitude_in || !longitude_in || !wsLat || !wsLng) {
            setData("isInRadius", false);
            setError("latitude_in", "radius out");
            setError("longitude_in", "radius out");
            return;
        }

        const distance = calculateDistance(
            latitude_in,
            longitude_in,
            wsLat,
            wsLng
        );

        setData("isInRadius", distance <= max_radius);

        if (distance > max_radius) {
            setError("latitude_in", "radius out");
            setError("longitude_in", "radius out");
        }
    }, [data.latitude_in, data.longitude_in, student, max_radius]);

    // Trigger validasi radius hanya ketika status = "PRESENT"
    useEffect(() => {
        if (data.status === "PRESENT") {
            evaluateRadius();
        } else {
            setData("isInRadius", true);
            clearErrors("latitude_in");
            clearErrors("longitude_in");
        }
    }, [data.status, data.latitude_in, data.longitude_in, evaluateRadius]);

    const handleLocationChange = useCallback(
        (lat: number, lng: number) => {
            setData("latitude_in", lat);
            setData("longitude_in", lng);
        },
        [setData]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateRequiredFields()) return;

        clearErrors();
        post("/student/attendance", {
            preserveScroll: true,
            replace: true,
            onError: (errors) => {
                BlastSonner({
                    type: BlastType.ERROR,
                    message: errors.message,
                });
            },
            onFinish: () => clearErrors(),
        });
    };

    return (
        <MustActiveOnAttendance onLocationChange={handleLocationChange}>
            <MainLayout title={title}>
                <PageTitle title={title} description="Absensi tepat waktu" />
                <form onSubmit={handleSubmit}>
                    {/* Info Siswa */}
                    <div className="mb-5">
                        <KeyAndValue
                            keyIdentifier="Tempat DuDi"
                            value={student?.workshop?.name}
                        />
                        <KeyAndValue
                            keyIdentifier="Tanggal & Waktu"
                            value={ymdToIdDate(data.check_in.toString(), true)}
                        />
                    </div>

                    {/* Status Absensi */}
                    <div className="mb-5">
                        <label className="text-base mb-1">Status Absensi</label>
                        <SelectSearchInput
                            value={data.status}
                            options={[
                                { label: "Hadir", value: "PRESENT" },
                                { label: "Izin", value: "EXCUSED" },
                            ]}
                            onChange={(value) =>
                                setData("status", value.toString())
                            }
                            placeholder="Pilih Status Absensi"
                            removeValue={() => setData("status", "PRESENT")}
                        />
                        {errors.status && <ErrorInput error={errors.status} />}
                    </div>

                    {/* Alasan Izin */}
                    {data.status === "EXCUSED" && (
                        <div className="mb-5">
                            <label className="text-base mb-1">
                                Alasan Izin
                            </label>
                            <Textarea
                                className="resize-none"
                                rows={4}
                                value={data.reason}
                                onChange={(e) =>
                                    setData("reason", e.target.value)
                                }
                            />
                            {errors.status && (
                                <ErrorInput error={errors.status} />
                            )}
                        </div>
                    )}

                    {/* Lokasi */}
                    <div className="mb-5">
                        <label className="text-base mb-1">
                            Lokasi Terkini Siswa
                        </label>
                        <MapPicker
                            readonly={true}
                            latitude={data.latitude_in ?? undefined}
                            longitude={data.longitude_in ?? undefined}
                        />
                        {errors.latitude_in && errors.longitude_in && (
                            <ErrorInput
                                error={"Kamu harus disekitar tempat DuDi"}
                            />
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full mt-4 p-6 bg-blue-500 hover:bg-blue-600"
                        disabled={
                            processing ||
                            (!data.isInRadius && data.status == "PRESENT")
                        }
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
        </MustActiveOnAttendance>
    );
}

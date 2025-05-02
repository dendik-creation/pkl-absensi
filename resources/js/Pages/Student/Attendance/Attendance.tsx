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
    attendance_time_name: "MASUK" | "PULANG";
    utm_source?: string;
};

export default function StudentAttendance({
    title,
    student,
    max_radius,
    attendance_time_name,
    utm_source = "",
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
            utm_source: utm_source,
        });

    const validateRequiredFields = useCallback((): boolean => {
        const fields: { key: keyof typeof data; message: string }[] = [
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
    }, [data, setError, clearErrors, attendance_time_name]);

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
        const latitudeKey =
            attendance_time_name === "MASUK" ? "latitude_in" : "latitude_out";
        const longitudeKey =
            attendance_time_name === "MASUK" ? "longitude_in" : "longitude_out";

        const latitude = data[latitudeKey];
        const longitude = data[longitudeKey];
        const wsLat = student?.workshop?.latitude;
        const wsLng = student?.workshop?.longitude;

        if (!latitude || !longitude || !wsLat || !wsLng) {
            setData("isInRadius", false);
            setError(latitudeKey, "radius out");
            setError(longitudeKey, "radius out");
            return;
        }

        const distance = calculateDistance(latitude, longitude, wsLat, wsLng);
        setData("isInRadius", distance <= max_radius);

        if (distance > max_radius) {
            setError(latitudeKey, "radius out");
            setError(longitudeKey, "radius out");
        }
    }, [
        data.latitude_in,
        data.longitude_in,
        data.latitude_out,
        data.longitude_out,
        student,
        max_radius,
        attendance_time_name,
    ]);

    useEffect(() => {
        if (data.status === "PRESENT") {
            evaluateRadius();
        } else {
            setData("isInRadius", true);
            clearErrors("latitude_in");
            clearErrors("longitude_in");
            clearErrors("latitude_out");
            clearErrors("longitude_out");
        }
    }, [
        data.status,
        data.latitude_in,
        data.longitude_in,
        data.latitude_out,
        data.longitude_out,
        evaluateRadius,
    ]);

    const handleLocationChange = useCallback(
        (lat: number, lng: number) => {
            const latitudeKey =
                attendance_time_name === "MASUK"
                    ? "latitude_in"
                    : "latitude_out";
            const longitudeKey =
                attendance_time_name === "MASUK"
                    ? "longitude_in"
                    : "longitude_out";

            setData(latitudeKey, lat);
            setData(longitudeKey, lng);
        },
        [setData, attendance_time_name]
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
            <MainLayout
                title={`${title} ${
                    attendance_time_name.charAt(0).toUpperCase() +
                    attendance_time_name.slice(1).toLowerCase()
                }`}
            >
                <PageTitle
                    title={`${title} ${
                        attendance_time_name.charAt(0).toUpperCase() +
                        attendance_time_name.slice(1).toLowerCase()
                    }`}
                    description="Absensi tepat waktu"
                />
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
                    {attendance_time_name == "MASUK" && (
                        <div className="mb-5">
                            <label className="text-base mb-1">
                                Status Absensi
                            </label>
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
                            {errors.status && (
                                <ErrorInput error={errors.status} />
                            )}
                        </div>
                    )}

                    {/* Alasan Izin */}
                    {data.status === "EXCUSED" &&
                        attendance_time_name == "MASUK" && (
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
                            latitude={
                                attendance_time_name === "MASUK"
                                    ? data.latitude_in ?? undefined
                                    : data.latitude_out ?? undefined
                            }
                            longitude={
                                attendance_time_name === "MASUK"
                                    ? data.longitude_in ?? undefined
                                    : data.longitude_out ?? undefined
                            }
                        />
                        {!data.isInRadius && (
                            <ErrorInput
                                error={"Kamu terlalu jauh dari tempat DuDi"}
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

import { RefreshCcwDot } from "lucide-react";
import React, { useEffect, useState } from "react";

interface MustActiveOnAttendanceProps {
    children: React.ReactNode;
    onLocationChange: (latitude: number, longitude: number) => void;
}

export default function MustActiveOnAttendance({
    children,
    onLocationChange,
}: MustActiveOnAttendanceProps) {
    const [locationStatus, setLocationStatus] = useState<
        "default" | "granted" | "denied"
    >("default");
    const [gpsEnabled, setGpsEnabled] = useState(false);

    const checkGpsStatus = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    setLocationStatus("granted");
                    setGpsEnabled(true);

                    // Panggil callback untuk mengirimkan lokasi ke parent
                    onLocationChange(latitude, longitude);
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error(
                                "User denied the request for geolocation."
                            );
                            setLocationStatus("denied");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error(
                                "Location information is unavailable."
                            );
                            setGpsEnabled(false);
                            break;
                        case error.TIMEOUT:
                            console.error(
                                "The request to get user location timed out."
                            );
                            setGpsEnabled(false);
                            break;
                    }
                }
            );
        } else {
            console.error("Geolocation is not available in this browser.");
            setLocationStatus("denied");
            setGpsEnabled(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            checkGpsStatus();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    if (locationStatus === "granted" && gpsEnabled) {
        return <>{children}</>;
    }

    return (
        <main className="h-screen w-screen">
            <div className="flex flex-col gap-3 w-full h-full justify-center items-center">
                <RefreshCcwDot
                    className="text-blue-500 animate-spin"
                    size={60}
                />
                <h1 className="text-md font-medium text-slate-500 w-3/4 text-center">
                    Izinkan akses lokasi dan Aktifkan GPS perangkat untuk
                    absensi
                </h1>
            </div>
        </main>
    );
}

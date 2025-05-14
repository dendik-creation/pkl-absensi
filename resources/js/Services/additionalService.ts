import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import React from "react";

export const ymdToIdDate = (
    dateString: string | null | undefined,
    withTime: boolean = false,
    timeOnly: boolean = false,
    withDay: boolean = false
) => {
    if (!dateString) return null;
    const parsedDate = new Date(dateString as string);

    if (timeOnly) {
        return format(parsedDate, "HH:mm", { locale: id });
    }

    const formatString = withDay
        ? withTime
            ? "EEEE, d MMMM yyyy - HH:mm"
            : "EEEE, d MMMM yyyy"
        : withTime
        ? "d MMMM yyyy - HH:mm"
        : "d MMMM yyyy";

    return format(parsedDate, formatString, { locale: id });
};

export const currentTimeGreeting = () => {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 5 && hours < 11) {
        return "Pagi 🌤️";
    } else if (hours >= 11 && hours < 15) {
        return "Siang 🌞";
    } else if (hours >= 15 && hours < 18) {
        return "Sore ⛅";
    } else {
        return "Malam 🌙";
    }
};

export const currentTimeCode = () => {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 5 && hours < 11) {
        return "M";
    } else if (hours >= 11 && hours < 15) {
        return "A";
    } else if (hours >= 15 && hours < 18) {
        return "E";
    } else {
        return "N";
    }
};

export const inputDebounce = (
    callback: (...args: any[]) => void,
    delay: number = 1000
) => {
    let timer: NodeJS.Timeout;

    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};

export const getFullAddress = async (
    lat: number,
    lon: number,
    setFindingAddress?: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        if (setFindingAddress) {
            setFindingAddress(true);
        }
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
                params: {
                    format: "json",
                    lat: lat,
                    lon: lon,
                    "accept-language": "id",
                },
            }
        );
        return response.data.display_name || "";
    } catch (error) {
        if (setFindingAddress) {
            setFindingAddress(false);
        }
        console.error("Gagal mengambil alamat:", error);
        return "";
    } finally {
        if (setFindingAddress) {
            setFindingAddress(false);
        }
    }
};

export const handleNipNisInput = (value: string) => {
    const regex = /^[0-9]+$/;
    if (!regex.test(value)) {
        return value.replace(/[^0-9]/g, "");
    }
    return value;
};

export const handleNumericInput = (value: string) => {
    const regex = /^[0-9.-]+$/;
    if (!regex.test(value)) {
        return value.replace(/[^0-9.-]/g, "");
    }
    return value;
};

export const distanceConverter = (distance: number) => {
    if (distance < 1000) {
        return `${distance} m`;
    } else {
        const km = (distance / 1000).toFixed(2).replace(/\.00$/, "");
        return `${km} km`;
    }
};

export const isWithinTimeRange = (
    startTime: string,
    endTime: string,
    currentTime: string
): boolean => {
    const parseTime = (time: string, baseDate: Date) => {
        const [hours, minutes] = time.split(":").map(Number);
        const date = new Date(baseDate);
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const baseDate = new Date(currentTime);
    const start = parseTime(startTime, baseDate);
    const end = parseTime(endTime, baseDate);
    const current = new Date(currentTime);

    return current >= start && current <= end;
};

export const setLocalStorage = (key: string, value: any) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

export const getLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
    return null;
};

export const clearLocalStorage = () => {
    if (typeof window !== "undefined") {
        localStorage.clear();
    }
};

export const requestNotificationPermission = async (
    from: "student" | "supervisor",
    setGrantedNotif: React.Dispatch<React.SetStateAction<boolean>>
): Promise<boolean> => {
    if (!("Notification" in window)) return false;

    const handlePermission = (permission: NotificationPermission) => {
        const isGranted = permission === "granted";
        setGrantedNotif(isGranted);
        BlastSonner({
            message: isGranted ? "Notifikasi diizinkan" : "Notifikasi ditolak",
            type: isGranted ? BlastType.SUCCESS : BlastType.ERROR,
        });
        return isGranted;
    };

    if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        return handlePermission(permission);
    }

    return handlePermission(Notification.permission);
};

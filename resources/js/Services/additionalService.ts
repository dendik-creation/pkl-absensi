import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const ymdToIdDate = (
    dateString: string | null | undefined,
    withTime: boolean = false
) => {
    if (!dateString) return null;
    const parsedDate = new Date(dateString as string);
    const formatString = withTime
        ? "EEEE, d MMMM yyyy HH:mm"
        : "EEEE, d MMMM yyyy";
    return format(parsedDate, formatString, { locale: id });
};

export const currentTime = () => {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 5 && hours < 12) {
        return "Pagi 🌤️";
    } else if (hours >= 12 && hours < 17) {
        return "Siang 🌞";
    } else if (hours >= 17 && hours < 18) {
        return "Sore ⛅";
    } else {
        return "Malam 🌙";
    }
};

export const currentTimeCode = () => {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 5 && hours < 12) {
        return "M";
    } else if (hours >= 12 && hours < 17) {
        return "A";
    } else if (hours >= 17 && hours < 18) {
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

export const getFullAddress = async (lat: number, lon: number) => {
    try {
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
        console.error("Gagal mengambil alamat:", error);
        return "";
    }
};

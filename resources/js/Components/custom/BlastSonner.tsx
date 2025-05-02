import { toast } from "sonner";

export enum BlastType {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
}

interface BlastSonnerProps {
    type: BlastType;
    message: string;
}

export default function BlastSonner({ type, message }: BlastSonnerProps) {
    switch (type) {
        case BlastType.SUCCESS:
            return toast.success("Sukses", {
                richColors: true,
                description: message,
                icon: "✅",
                style: {
                    fontFamily: "Space Grotesk",
                },
            });
        case BlastType.ERROR:
            return toast.error("Gagal", {
                richColors: true,
                description: message,
                icon: "❌",
                style: {
                    fontFamily: "Space Grotesk",
                },
            });
        case BlastType.WARNING:
            return toast.warning("Peringatan", {
                description: message,
                richColors: true,
                icon: "⚠️",
                style: {
                    fontFamily: "Space Grotesk",
                },
            });
        default:
            return toast(message);
    }
}

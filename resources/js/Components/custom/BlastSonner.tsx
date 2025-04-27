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
            return toast.success(message, {
                richColors: true,
                icon: "✅",
            });
        case BlastType.ERROR:
            return toast.error(message, {
                richColors: true,
                icon: "❌",
            });
        case BlastType.WARNING:
            return toast.warning(message, {
                richColors: true,
                icon: "⚠️",
            });
        default:
            return toast(message);
    }
}

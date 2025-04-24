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
            });
        case BlastType.ERROR:
            return toast.error(message, {
                richColors: true,
            });
        case BlastType.WARNING:
            return toast(message);
        default:
            return toast(message);
    }
}

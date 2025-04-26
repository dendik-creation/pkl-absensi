import { Supervisor } from "@/Types/supervisor";
import { Student } from "./student";

export type Workshop = {
    id: number;
    name: string;
    phone?: string | null;
    owner_name?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    address?: string | null;
    supervisor_id?: number | null;
    supervisor?: Supervisor | null;
    students?: Student[];
};

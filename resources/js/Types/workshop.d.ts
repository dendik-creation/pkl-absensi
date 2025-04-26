import { Supervisor } from "@/Types/supervisor";

export type Workshop = {
    id: number;
    name: string;
    phone?: string | null;
    owner_name?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    supervisor_id?: number | null;
    supervisor?: Supervisor | null;
    address?: string | null;
};

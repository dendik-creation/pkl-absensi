import { User } from "@/Types/user";
import { Workshop } from "@/Types/workshop";

export type Student = {
    id: number;
    user_id: number;
    full_name: string;
    nis?: string | null;
    class?: string | null;
    major?: string | null;
    email?: string | null;
    workshop_id?: number | null;
    user: User;
    workshop?: Workshop | null;
    createdAt: Date;
    updatedAt: Date;
};

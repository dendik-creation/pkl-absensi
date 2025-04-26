import { User } from "@/Types/user";

type Supervisor = {
    id: number;
    user_id: number;
    nip?: string;
    full_name: string;
    user: User;
};

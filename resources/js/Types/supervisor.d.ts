import { User } from "@/Types/user";
import { Workshop } from "./workshop";

type Supervisor = {
    id: number;
    user_id: number;
    nip?: string;
    full_name: string;
    user: User;
    workshop: Workshop;
};

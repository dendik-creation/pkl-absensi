import { Student } from "./student";
import { Supervisor } from "./supervisor";

enum UserRole {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    SUPERVISOR = "SUPERVISOR",
}
export type User = {
    id: number;
    username?: string;
    email: string;
    password?: string;
    role: UserRole;
    student?: Student;
    supervisor?: Supervisor;
};

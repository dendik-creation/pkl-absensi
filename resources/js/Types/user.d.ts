import { Student } from "./student";
import { Supervisor } from "./supervisor";

enum UserRole {
    Admin = "ADMIN",
    STUDENT = "STUDENT",
    SUPERVISOR = "SUPERVISOR",
}
export type User = {
    id: number;
    username: string;
    email: string;
    password?: string;
    role: UserRole;
    student?: Student;
    supervisor?: Supervisor;
    attendances?: Attendance[];
    journals?: Journal[];
};

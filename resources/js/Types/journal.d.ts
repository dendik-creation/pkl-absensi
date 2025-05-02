import { Student } from "./student";

type Journal = {
    id: number;
    student_id: number;
    date: Date;
    activity: string;
    student?: Student;
};

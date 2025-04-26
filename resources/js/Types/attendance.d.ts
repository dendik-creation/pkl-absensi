enum AttendanceStatus {
    PRESENT = "PRESENT",
    EXCUSED = "EXCUSED",
    ABSENT = "ABSENT",
}
type Attendance = {
    id: number;
    user_id: number;
    check_in?: Date | null;
    check_out?: Date | null;
    reason?: string | null;
    status: AttendanceStatus;
    latitude?: number | null;
    longitude?: number | null;
};

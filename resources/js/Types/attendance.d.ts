enum AttendanceStatus {
    PRESENT = "PRESENT",
    EXCUSED = "EXCUSED",
    ABSENT = "ABSENT",
}
type Attendance = {
    id: number;
    user_id: number;
    check_in?: string | null;
    check_out?: string | null;
    reason?: string | null;
    status: AttendanceStatus;
    latitude_in?: number | null;
    longitude_in?: number | null;
    latitude_out?: number | null;
    longitude_out?: number | null;
};

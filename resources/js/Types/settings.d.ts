type GlobalSetting = {
    id: number;
    app_name: string;
    app_icon: string;
    app_description?: string;
    max_attendance_radius: number;
    default_latitude: number;
    default_longitude: number;
    check_in_start: string;
    check_in_end: string;
    check_out_start: string;
    check_out_end: string;
};

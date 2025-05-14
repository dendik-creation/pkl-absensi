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
    school_name?: string;
    school_address?: string;
    school_phone?: string;
    school_email?: string;
    school_website?: string;
    school_icon?: string;
};

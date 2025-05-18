<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\GlobalSetting;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\User;
use App\Models\Workshop;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getAttedanceChart()
    {
        $now = Carbon::now();
        $totalStudents = Student::count();

        $months = collect([$now->copy(), $now->copy()->addMonth(), $now->copy()->addMonths(2)]);

        $attendanceData = $months->map(function ($date) use ($now, $totalStudents) {
            $monthName = $date->format('M');
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();

            $rangeEnd = $date->isSameMonth($now) ? $now->copy()->endOfDay() : $end;

            $daysConsidered = $date->isSameMonth($now) ? $now->day : 0;
            $expectedTotal = $daysConsidered * $totalStudents;

            $present = Attendance::whereBetween('check_in', [$start, $rangeEnd])
                ->where('status', 'PRESENT')
                ->count();

            $excused = Attendance::whereBetween('check_in', [$start, $rangeEnd])
                ->where('status', 'EXCUSED')
                ->count();

            $absent = max($expectedTotal - ($present + $excused), 0);

            return [
                'month' => $monthName,
                'present' => $present,
                'excused' => $excused,
                'absent' => $absent,
            ];
        });

        return $attendanceData;
    }

    private function latestAttendances()
    {
        $attendances = Attendance::with('student.workshop')->orderBy('check_in', 'desc')->take(5)->get();
        return $attendances;
    }

    public function index()
    {
        $app = GlobalSetting::first();
        return Inertia::render('Admin/Dashboard', [
            'title' => 'Dashboard Admin',
            'data' => [
                'user_role' => Auth::user()->role,
                'default_location' => [
                    'latitude' => $app->default_latitude,
                    'longitude' => $app->default_longitude,
                ],
                'cards' => [
                    'student_count' => Student::count(),
                    'supervisor_count' => Supervisor::count(),
                    'workshop_count' => Workshop::count(),
                ],
                'charts' => [
                    'attendances' => $this->getAttedanceChart(),
                ],
                'lists' => [
                    'latest_attendances' => $this->latestAttendances(),
                ],
            ],
        ]);
    }

    public function appSetting()
    {
        $app_setting = GlobalSetting::first();
        return Inertia::render('Admin/AppSetting', [
            'title' => 'Pengaturan Aplikasi',
            'app_setting' => $app_setting,
            'base_url' => config('app.url'),
        ]);
    }

    public function updateAppSetting(Request $request)
    {
        $validated = $request->validate(
            [
                'app_name' => 'required|string|max:255',
                'app_icon' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                'school_name' => 'required|string|max:255',
                'school_icon' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                'school_address' => 'required|string|max:255',
                'school_phone' => 'required|string|max:255',
                'school_email' => 'required|string|email|max:255',
                'school_website' => 'required|string|max:255',
                'default_latitude' => 'required|numeric',
                'default_longitude' => 'required|numeric',
                'max_attendance_radius' => 'required|numeric',
                'check_in_start' => 'required|string',
                'check_in_end' => 'required|string',
                'check_out_start' => 'required|string',
                'check_out_end' => 'required|string',
            ],
            [
                'app_name.required' => 'Nama aplikasi tidak boleh kosong',
                'app_icon.image' => 'Ikon aplikasi harus berupa gambar',
                'app_icon.mimes' => 'Ikon aplikasi harus berupa file JPEG, PNG, JPG, atau GIF',
                'app_icon.max' => 'Ukuran ikon aplikasi tidak boleh lebih dari 2MB',
                'school_name.required' => 'Nama sekolah tidak boleh kosong',
                'school_icon.image' => 'Ikon sekolah harus berupa gambar',
                'school_icon.mimes' => 'Ikon sekolah harus berupa file JPEG, PNG, JPG, atau GIF',
                'school_icon.max' => 'Ukuran ikon sekolah tidak boleh lebih dari 2MB',
                'school_address.required' => 'Alamat sekolah tidak boleh kosong',
                'school_phone.required' => 'Nomor telepon sekolah tidak boleh kosong',
                'school_email.required' => 'Email sekolah tidak boleh kosong',
                'school_email.email' => 'Format email sekolah tidak valid',
                'school_website.required' => 'Website sekolah tidak boleh kosong',
                'default_latitude.required' => 'Latitude tidak boleh kosong',
                'default_longitude.required' => 'Longitude tidak boleh kosong',
                'max_attendance_radius.required' => 'Radius kehadiran tidak boleh kosong',
                'check_in_start.required' => 'Waktu mulai absensi masuk tidak boleh kosong',
                'check_in_end.required' => 'Waktu akhir absensi masuk tidak boleh kosong',
                'check_out_start.required' => 'Waktu mulai absensi pulang tidak boleh kosong',
                'check_out_end.required' => 'Waktu akhir absensi pulang tidak boleh kosong',
            ],
        );

        $app_setting = GlobalSetting::first();
        $app_setting->update([
            'app_name' => $validated['app_name'],
            'default_latitude' => $validated['default_latitude'],
            'default_longitude' => $validated['default_longitude'],
            'max_attendance_radius' => $validated['max_attendance_radius'],
            'check_in_start' => $validated['check_in_start'],
            'check_in_end' => $validated['check_in_end'],
            'check_out_start' => $validated['check_out_start'],
            'check_out_end' => $validated['check_out_end'],
            'school_name' => $validated['school_name'],
            'school_address' => $validated['school_address'],
            'school_phone' => $validated['school_phone'],
            'school_email' => $validated['school_email'],
            'school_website' => $validated['school_website'],
        ]);
        if ($request->hasFile('app_icon') && $request->file('app_icon')->isValid()) {
            $file = $request->file('app_icon');
            $filename = 'favicon.png';
            $file->move(public_path('/assets/img'), $filename);
            $app_setting->update(['app_icon' => "/assets/img/$filename"]);
        }
        if ($request->hasFile('school_icon') && $request->file('school_icon')->isValid()) {
            $file = $request->file('school_icon');
            $filename = 'school_icon.png';
            $file->move(public_path('/assets/img'), $filename);
            $app_setting->update(['school_icon' => "/assets/img/$filename"]);
        }
        return back()->with('success', 'Pengaturan aplikasi berhasil diperbarui');
    }
}

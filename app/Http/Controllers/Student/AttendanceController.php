<?php

namespace App\Http\Controllers\Student;

use App\Exports\AttendanceExport;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\GlobalSetting;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx\Rels;

class AttendanceController extends Controller
{
    private function getAuthUser()
    {
        return User::where('id', Auth::id())->with('student')->first();
    }

    private function currentAttendanceTime($setting)
    {
        $now = now();
        $attendance_in = [
            'start' => $setting['check_in_start'],
            'end' => $setting['check_in_end'],
        ];
        $attendance_out = [
            'start' => $setting['check_out_start'],
            'end' => $setting['check_out_end'],
        ];

        if ($now->between($attendance_in['start'], $attendance_in['end'])) {
            return 'MASUK';
        } elseif ($now->between($attendance_out['start'], $attendance_out['end'])) {
            return 'PULANG';
        }

        return 'DI LUAR WAKTU';
    }

    public function index(Request $request)
    {
        $user = $this->getAuthUser();
        $setting = GlobalSetting::first();
        $attendance_time_name = $this->currentAttendanceTime($setting);
        $filtered_date = $request->input('date') ?: null;
        $filtered_month = $request->input('month') ?: null;

        $attendances = Attendance::where('student_id', $user->student->id)
            ->when($filtered_date, function ($query) use ($filtered_date) {
                $query->whereDate('check_in', $filtered_date);
            })
            ->when($filtered_month, function ($query) use ($filtered_month) {
                $query->whereMonth('check_in', $filtered_month);
            })
            ->when(!$filtered_date && !$filtered_month, function ($query) {
                $query->limit(20);
            })
            ->orderBy('check_in', 'desc')
            ->get();
        return inertia('Student/Attendance/Index', [
            'title' => 'Daftar Absensi',
            'attendances' => $attendances,
            'attendance_time_name' => $attendance_time_name,
            'setting' => $setting,
        ]);
    }

    public function create(Request $request)
    {
        $now = now()->format('Y-m-d');
        $setting = GlobalSetting::first();
        $attendance_time_name = $this->currentAttendanceTime($setting);
        $user = $this->getAuthUser();
        $student = Student::with('workshop')->where('id', $user->student->id)->first();

        $existingAttendanceInToday = Attendance::where('student_id', $student->id)->whereDate('check_in', $now)->exists();

        if ($attendance_time_name == 'DI LUAR WAKTU') {
            Session::flash('error', 'Diluar waktu absensi, akses ditolak 😁');
            return back();
        }

        if ($attendance_time_name == 'PULANG' && !$existingAttendanceInToday) {
            Session::flash('error', 'Kamu di nyatakan tidak absensi hari ini, akses ditolak 😁');
            return back();
        }

        return inertia('Student/Attendance/Attendance', [
            'title' => 'Absensi',
            'student' => $student,
            'max_radius' => $setting->max_attendance_radius,
            'attendance_time_name' => $attendance_time_name,
            'utm_source' => $request->utm_source ?? null,
        ]);
    }

    public function store(Request $request)
    {
        $attendance_time_name = $this->currentAttendanceTime(GlobalSetting::first());

        if ($attendance_time_name === 'MASUK') {
            $validated = $request->validate([
                'latitude_in' => 'required|numeric',
                'longitude_in' => 'required|numeric',
                'status' => 'required|in:PRESENT,EXCUSED',
            ]);

            if ($validated['status'] == 'EXCUSED') {
                $validated['reason'] = $request->reason;
            }

            $user = $this->getAuthUser();

            Attendance::create([
                'student_id' => $user->student->id,
                'latitude_in' => $validated['latitude_in'],
                'longitude_in' => $validated['longitude_in'],
                'status' => $validated['status'],
                'check_in' => now(),
                'reason' => $validated['status'] == 'EXCUSED' ? $validated['reason'] : null,
            ]);

            Session::flash('success', 'Absensi Masuk Berhasil');
        } elseif ($attendance_time_name === 'PULANG') {
            $validated = $request->validate([
                'latitude_out' => 'required|numeric',
                'longitude_out' => 'required|numeric',
            ]);

            $user = $this->getAuthUser();

            $attendance = Attendance::where('student_id', $user->student->id)
                ->whereDate('check_in', now()->toDateString())
                ->first();

            if ($attendance) {
                $attendance->update([
                    'check_out' => now(),
                    'latitude_out' => $validated['latitude_out'],
                    'longitude_out' => $validated['longitude_out'],
                ]);

                Session::flash('success', 'Absensi Pulang Berhasil');
            } else {
                Session::flash('error', 'Tidak ada data absensi masuk untuk hari ini.');
            }
        } else {
            Session::flash('error', 'Waktu absensi tidak valid.');
        }

        if ($request->has('utm_source') && $request->utm_source == 'student_dashboard') {
            return Inertia::location('/student/dashboard');
        } else {
            return Inertia::location('/student/attendance');
        }
    }

    public function show($id)
    {
        $attendance = Attendance::with('student.workshop')->findOrFail($id);
        return inertia('Student/Attendance/Show', [
            'title' => 'Detail Absensi',
            'attendance' => $attendance,
            'workshop' => $attendance->student->workshop,
        ]);
    }

    private function attendanceExport($studentId, $monthSelected = null)
    {
        $startDate = $monthSelected
            ? Carbon::create(now()->year, $monthSelected, 1)
            : Attendance::where('student_id', $studentId)
                ->orderBy('check_in', 'asc')
                ->value('check_in');

        $startDate = $startDate ? Carbon::parse($startDate)->startOfDay() : now()->startOfDay();
        $endDate = now()->endOfDay();

        $attendancesFromDb = Attendance::where('student_id', $studentId)
            ->whereBetween('check_in', [$startDate, $endDate])
            ->orderBy('check_in', 'asc')
            ->get()
            ->keyBy(function ($attendance) {
                return Carbon::parse($attendance->check_in)->toDateString();
            });

        $attendances = [];
        $currentDate = $startDate->copy();

        while ($currentDate->lte($endDate)) {
            $dateString = $currentDate->toDateString();

            if ($attendancesFromDb->has($dateString)) {
                $attendances[] = $attendancesFromDb->get($dateString);
            } else {
                $attendances[] = [
                    'student_id' => $studentId,
                    'check_in' => $currentDate->toDateTimeString(),
                    'check_out' => null,
                    'status' => Attendance::ABSENT,
                    'latitude_in' => null,
                    'longitude_in' => null,
                    'latitude_out' => null,
                    'longitude_out' => null,
                    'reason' => null,
                ];
            }

            $currentDate->addDay();
        }

        return $attendances;
    }

    public function export(Request $request)
    {
        $setting = GlobalSetting::first();
        $student = Student::where('user_id', Auth::user()->id)->first();
        $format = $request->input('format');
        $month_selected = $request->input('month') ?: null;

        if ($format == 'PDF') {
            $attendances = $this->attendanceExport($student->id, $month_selected);

            return Inertia::render('Student/Attendance/Export', [
                'title' => $student->nis . '_' . 'ABSENSI' . '_' . ($month_selected == null ? 'ALL' : strtoupper(substr(Carbon::create()->month(intval($month_selected))->format('F'), 0, 3))),
                'attendances' => $attendances,
                'setting' => $setting,
                'month_selected' => $month_selected,
                'student' => $student,
            ]);
        } elseif ($format == 'XLSX') {
            $attendances = $this->attendanceExport($student->id, $month_selected);
            $monthName = $month_selected ? date('F Y', mktime(0, 0, 0, $month_selected, 1)) : date('F Y');
            $title = $month_selected ? "Absensi PKL Bulan $monthName" : "Absensi PKL Keseluruhan";
            return Excel::download(new AttendanceExport($title ,$attendances, $student), $student->nis . '_' . 'ABSENSI' . '_' . ($month_selected == null ? 'ALL' : strtoupper(substr(Carbon::create()->month(intval($month_selected))->format('F'), 0, 3))) . '.xlsx');
        }
    }
}

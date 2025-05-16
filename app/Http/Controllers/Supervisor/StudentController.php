<?php

namespace App\Http\Controllers\Supervisor;

use App\Exports\AttendanceExport;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\GlobalSetting;
use App\Models\Journal;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\Workshop;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $supervisor = Supervisor::where('user_id', Auth::id())->first();
        if (!$supervisor) {
            return Inertia::location('/');
        }
        $workshops_id = Workshop::where('supervisor_id', $supervisor->id)->pluck('id');
        $students = Student::with('user', 'workshop')
            ->when($search, function ($query, $search) use ($workshops_id) {
                $query
                    ->whereIn('workshop_id', $workshops_id)
                    ->where('full_name', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%");
            })
            ->paginate(20);
        return Inertia::render('Supervisor/Student/Index', [
            'title' => 'Daftar Siswa',
            'students' => $students->items(),
        ]);
    }

    public function show($id)
    {
        $student = Student::with('user', 'workshop.supervisor')->findOrFail($id);
        $currentDate = now()->format('Y-m-d');
        $latest_activity = [
            'attendance' => $student->attendances()->whereDate('check_in', $currentDate)->latest()->first(),
            'journal' => $student->journals()->whereDate('date', $currentDate)->latest()->first(),
        ];

        return Inertia::render('Supervisor/Student/Show', [
            'title' => 'Informasi Siswa',
            'student' => $student,
            'latest_activity' => $latest_activity,
        ]);
    }

    public function attendanceList(Request $request)
    {
        $filtered_date = $request->input('date') ?: null;
        $filtered_month = $request->input('month') ?: null;
        $student_id = $request->input('student_id') ?: null;

        $supervisor = Supervisor::where('user_id', Auth::id())->first();
        $workshops_id = Workshop::where('supervisor_id', $supervisor->id)->pluck('id');

        $student_options = Student::with('user')->whereIn('workshop_id', $workshops_id)->get();

        $attendances = Attendance::with('student')
            ->when($filtered_date, function ($query, $filtered_date) {
                $query->whereDate('check_in', $filtered_date);
            })
            ->when($filtered_month, function ($query, $filtered_month) {
                $query->whereMonth('check_in', $filtered_month);
            })
            ->when($student_id, function ($query, $student_id) {
                $query->where('student_id', $student_id);
            })
            ->orderBy('check_in', 'desc')
            ->paginate(20);

        return Inertia::render('Supervisor/Student/Attendance/Index', [
            'title' => 'Daftar Absensi',
            'attendances' => $attendances->items(),
            'student_options' => $student_options->map(function ($student) {
                return [
                    'label' => $student->full_name,
                    'value' => "$student->id",
                ];
            }),
        ]);
    }

    public function attendanceDetail($attendance_id)
    {
        $attendance = Attendance::with('student.workshop')->findOrFail($attendance_id);

        return Inertia::render('Supervisor/Student/Attendance/Show', [
            'title' => 'Detail Absensi ' . $attendance->student->user->full_name,
            'student' => $attendance->student,
            'attendance' => $attendance,
        ]);
    }

    private function attendanceExportData($studentId = null, $monthSelected = null, $workshops_id)
    {
        $startDate = $monthSelected
            ? Carbon::create(now()->year, $monthSelected, 1)
            : Attendance::whereHas('student', function ($query) use ($workshops_id) {
                $query->whereIn('workshop_id', $workshops_id);
            })
                ->when($studentId, function ($query) use ($studentId) {
                    $query->where('student_id', $studentId);
                })
                ->orderBy('check_in', 'asc')
                ->value('check_in');

        $startDate = $startDate ? Carbon::parse($startDate)->startOfDay() : now()->startOfDay();
        $endDate = now()->endOfDay();

        $attendancesFromDb = Attendance::when($studentId, function ($query) use ($studentId) {
            $query->where('student_id', $studentId);
        })
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

    // public function attendanceExport(Request $request){
    //     $setting = GlobalSetting::first();
    //     $supervisor = Supervisor::where('user_id', Auth::id())->first();
    //     $student_id = $request->input('student_id') ?: null;
    //     $student = $student_id
    //         ? Student::find($student_id)
    //         : null;
    //     $workshops_id = Workshop::where('supervisor_id', $supervisor->id)->pluck('id');

    //     $format = $request->input('format');
    //     $month_selected = $request->input('month') ?: null;

    //     if ($format == 'PDF') {
    //         $attendances = $this->attendanceExportData($student_id, $month_selected, $workshops_id);

    //         return Inertia::render('Supervisor/Student/Attendance/Export', [
    //             'title' => ($student ? $student->nis : 'ALL') . '_' . 'ABSENSI' . '_' . ($month_selected == null ? 'ALL' : strtoupper(substr(Carbon::create()->month(intval($month_selected))->format('F'), 0, 3))),
    //             'attendances' => $attendances,
    //             'setting' => $setting,
    //             'month_selected' => $month_selected,
    //             'student' => $student,
    //         ]);
    //     } elseif ($format == 'XLSX') {
    //         $attendances = $this->attendanceExportData($student_id, $month_selected, $workshops_id);
    //         $monthName = $month_selected ? date('F Y', mktime(0, 0, 0, $month_selected, 1)) : date('F Y');
    //         $title = $month_selected ? "Absensi PKL Bulan $monthName" : "Absensi PKL Keseluruhan";
    //         return Excel::download(new AttendanceExport($title, $attendances, $student), ($student ? $student->nis : 'ALL') . '_' . 'ABSENSI' . '_' . ($month_selected == null ? 'ALL' : strtoupper(substr(Carbon::create()->month(intval($month_selected))->format('F'), 0, 3))) . '.xlsx');
    //     }
    // }

    public function journalList(Request $request)
    {
        $filtered_student = $request->input('student_id') ?: null;
        $filtered_date = $request->input('date') ?: null;
        $filtered_month = $request->input('month') ?: null;

        $supervisor = Supervisor::where('user_id', Auth::id())->first();
        $workshops_id = Workshop::where('supervisor_id', $supervisor->id)->pluck('id');

        $student_options = Student::with('user')->whereIn('workshop_id', $workshops_id)->get();

        $journals = Journal::query()
            ->when($filtered_student, function ($query) use ($filtered_student) {
                $query->where('student_id', $filtered_student);
            })
            ->when($filtered_date, function ($query) use ($filtered_date) {
                $query->where('date', $filtered_date);
            })
            ->when($filtered_month, function ($query) use ($filtered_month) {
                $query->whereMonth('date', $filtered_month);
            })
            ->orderBy('date', 'desc')
            ->paginate(20);

        return Inertia::render('Supervisor/Student/Journal/Index', [
            'title' => 'Jurnal PKL Siswa',
            'journals' => $journals->items(),
            'student_options' => $student_options->map(function ($student) {
                return [
                    'label' => $student->full_name,
                    'value' => "$student->id",
                ];
            }),
        ]);
    }

    public function journalDetail($id)
    {
        $journal = Journal::with('student')->findOrFail($id);
        return Inertia::render('Supervisor/Student/Journal/Show', [
            'title' => 'Detail Jurnal PKL',
            'journal' => $journal,
        ]);
    }
}

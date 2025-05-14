<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\Workshop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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

        $student_options = Student::with('user')
            ->whereIn('workshop_id', $workshops_id)
            ->get();

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
}

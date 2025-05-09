<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\User;
use App\Models\Workshop;
use Carbon\Carbon;
use Illuminate\Http\Request;
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

            $present = Attendance::
                whereBetween('check_in', [$start, $rangeEnd])
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
        $attendances = Attendance::with('student.workshop')
            ->latest()
            ->take(5)
            ->get();
        return $attendances;
    }

    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'title' => 'Dashboard Admin',
            'data' => [
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
            ]
        ]);
    }
}

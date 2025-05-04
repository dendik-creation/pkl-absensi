<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\Workshop;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    private function getAttedanceChart($workshops_id)
    {
        $now = Carbon::now();
        $totalStudents = Student::whereIn('workshop_id', $workshops_id)->count();

        $months = collect([$now->copy(), $now->copy()->addMonth(), $now->copy()->addMonths(2)]);

        $attendanceData = $months->map(function ($date) use ($now, $totalStudents, $workshops_id) {
            $monthName = $date->format('M');
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();

            $rangeEnd = $date->isSameMonth($now) ? $now->copy()->endOfDay() : $end;

            $daysConsidered = $date->isSameMonth($now) ? $now->day : 0;
            $expectedTotal = $daysConsidered * $totalStudents;

            $present = Attendance::whereHas('student', function ($query) use ($workshops_id) {
                $query->whereIn('workshop_id', $workshops_id);
            })
                ->whereBetween('check_in', [$start, $rangeEnd])
                ->where('status', 'PRESENT')
                ->count();

            $excused = Attendance::whereHas('student', function ($query) use ($workshops_id) {
                $query->whereIn('workshop_id', $workshops_id);
            })
                ->whereBetween('check_in', [$start, $rangeEnd])
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

    public function getDailyAttendance($workshops_id)
    {
        $now = Carbon::now();
        $totalStudents = Student::whereIn('workshop_id', $workshops_id)->count();

        $attendanceData = Attendance::whereHas('student', function ($query) use ($workshops_id) {
            $query->whereIn('workshop_id', $workshops_id);
        })
            ->whereDate('check_in', $now->toDateString())
            ->get();

        return [
            'total_students' => $totalStudents,
            'attendances' => $attendanceData,
        ];
    }

    public function index()
    {
        $supervisor = Supervisor::where('user_id', Auth::id())->firstOrFail();
        $workshops_id = $supervisor->workshops->pluck('id')->toArray();

        return inertia('Supervisor/Dashboard', [
            'title' => 'Dashboard',
            'supervisor' => $supervisor,
            'data' => [
                'attendances_daily' => $this->getDailyAttendance($workshops_id),
                'attendances_month' => $this->getAttedanceChart($workshops_id),
            ],
        ]);
    }
}

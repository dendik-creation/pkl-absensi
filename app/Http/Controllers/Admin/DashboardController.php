<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attedance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function getAttedanceChart()
    {
        $now = Carbon::now();
        $totalStudents = User::where('role', 'STUDENT')->count();

        $months = collect([$now->copy(), $now->copy()->addMonth(), $now->copy()->addMonths(2)]);

        $attendanceData = $months->map(function ($date) use ($now, $totalStudents) {
            $monthName = $date->format('M');
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();
            if ($date->gt($now)) {
                return [
                    'month' => $monthName,
                    'present' => 0,
                    'excused' => 0,
                    'absent' => 0,
                ];
            }

            $rangeEnd = $date->isSameMonth($now) ? $now->copy()->endOfDay() : $end;

            $daysConsidered = $date->isSameMonth($now) ? $now->day : $date->daysInMonth;
            $expectedTotal = $daysConsidered * $totalStudents;

            $present = Attedance::whereBetween('created_at', [$start, $rangeEnd])
                ->where('status', 'PRESENT')
                ->count();

            $excused = Attedance::whereBetween('created_at', [$start, $rangeEnd])
                ->where('status', 'EXCUSED')
                ->count();

            $absent = max($expectedTotal - ($present + $excused), 0);

            return [
                'month' => $monthName,
                'present' => 0,
                'excused' => 0,
                'absent' => 0,
            ];
        });

        return $attendanceData;
    }

    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'title' => 'Dashboard Admin',
            'attendances' => $this->getAttedanceChart(),
        ]);
    }
}

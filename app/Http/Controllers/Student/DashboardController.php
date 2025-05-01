<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\GlobalSetting;
use App\Models\Journal;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function calculateRadiusGap($lat_attendance, $long_attendance, $lat_workshop, $long_workshop){
        $earth_radius = 6371000;
        $dLat = deg2rad($lat_workshop - $lat_attendance);
        $dLon = deg2rad($long_workshop - $long_attendance);
        $a = sin($dLat / 2) * sin($dLat / 2) + cos(deg2rad($lat_attendance)) * cos(deg2rad($lat_workshop)) * sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return floor($earth_radius * $c);
    }

    public function index(){
        $student = Student::with('workshop')->where('user_id', Auth::user()->id)->first();
        $setting = GlobalSetting::first();
        $now = now()->format('Y-m-d');
        $latest_activity = [
            'attendance' => Attendance::where('student_id', $student->id)->whereDate('check_in', $now)->first(),
            'journal' => Journal::where('student_id', $student->id)->whereDate('date', $now)->first(),
        ];
        if($latest_activity['attendance']){
            $latest_activity['attendance']['radius_gap_attendance_in'] = $this->calculateRadiusGap($latest_activity['attendance']->latitude_in, $latest_activity['attendance']->longitude_in, $student->workshop->latitude, $student->workshop->longitude);

            if($latest_activity['attendance']->check_out){
                $latest_activity['attendance']['radius_gap_attendance_out'] = $this->calculateRadiusGap($latest_activity['attendance']->latitude_out, $latest_activity['attendance']->longitude_out, $student->workshop->latitude, $student->workshop->longitude);
            }
        }

        return Inertia::render('Student/Dashboard', [
            'title' => 'Dashboard',
            'student' => $student,
            'latest_activity' => $latest_activity,
            'setting' => $setting,
        ]);
    }
}

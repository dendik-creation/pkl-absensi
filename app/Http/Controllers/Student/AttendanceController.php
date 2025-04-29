<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    private function getAuthUser(){
        return User::where('id', Auth::id())->with('student')->first();
    }

    public function index(){
        $user = $this->getAuthUser();
        $attendances = Attendance::where('student_id', $user->student->id)->get();
        return inertia('Student/Attendance/Index', [
            'title' => 'Daftar Absensi',
            'attendances' => $attendances,
        ]);
    }

    public function create(){
        $user = $this->getAuthUser();
        $student = Student::with('workshop')->where('id', $user->student->id)->first();
        return inertia('Student/Attendance/Create', [
            'title' => 'Absensi',
            'student' => $student,
            'max_radius' => Attendance::MAX_RADIUS,
        ]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'latitude_in' => 'required|numeric',
            'longitude_in' => 'required|numeric',
            'status' => 'required|in:PRESENT,EXCUSED',
        ]);

        if($validated['status'] == 'EXCUSED'){
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
        return Inertia::location('/student/dashboard');
    }
}

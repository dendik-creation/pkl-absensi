<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Journal;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){
        $student = Student::where('user_id', Auth::user()->id)->first();
        $latest_activity = [
            'attendance' => Attendance::where('student_id', $student->id)->latest()->first(),
            'journal' => Journal::where('student_id', $student->id)->latest()->first(),
        ];
        return Inertia::render('Student/Dashboard', [
            'title' => 'Dashboard',
            'student' => $student,
            'latest_activity' => $latest_activity,
        ]);
    }
}

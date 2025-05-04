<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
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
}

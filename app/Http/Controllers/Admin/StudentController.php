<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $students = Student::with('user', 'workshop')
            ->when($search, function ($query, $search) {
                $query->where('full_name', 'like', "%{$search}%")
                      ->orWhere('nis', 'like', "%{$search}%");
            })
            ->paginate(20);

        return Inertia::render('Admin/Student/Index', [
            'title' => "Data Siswa",
            'students' => $students->items(),
        ]);
    }

    public function show($id){
        $student = Student::with('user', 'workshop.supervisor')->findOrFail($id);
        $currentDate = now()->format('Y-m-d');
        $latest_activity = [
            'attendance' => $student->user->attendances()->whereDate('check_in', $currentDate)->latest()->first(),
            'journal' => $student->user->journals()->whereDate('date', $currentDate)->latest()->first(),
        ];

        return Inertia::render('Admin/Student/Show', [
            'title' => "Informasi Siswa",
            'student' => $student,
            'latest_activity' => $latest_activity,
        ]);
    }
}

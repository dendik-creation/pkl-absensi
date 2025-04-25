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
}

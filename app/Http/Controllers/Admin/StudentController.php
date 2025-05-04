<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\StudentImport;
use App\Models\Student;
use App\Models\User;
use App\Models\Workshop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $students = Student::with('user', 'workshop')
            ->when($search, function ($query, $search) {
                $query->where('full_name', 'like', "%{$search}%")->orWhere('nis', 'like', "%{$search}%");
            })
            ->paginate(20);

        return Inertia::render('Admin/Student/Index', [
            'title' => 'Data Siswa',
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

        return Inertia::render('Admin/Student/Show', [
            'title' => 'Informasi Siswa',
            'student' => $student,
            'latest_activity' => $latest_activity,
        ]);
    }

    public function edit($id)
    {
        $student = Student::with('user', 'workshop')->findOrFail($id);
        $workshops = Workshop::all()->map(function ($workshop) {
            return [
                'value' => '' . $workshop->id . '',
                'label' => $workshop->name,
            ];
        });
        return Inertia::render('Admin/Student/Edit', [
            'title' => 'Edit Siswa',
            'student' => $student,
            'workshops' => $workshops,
        ]);
    }

    public function create()
    {
        $workshops = Workshop::all()->map(function ($workshop) {
            return [
                'value' => '' . $workshop->id . '',
                'label' => $workshop->name,
            ];
        });
        return Inertia::render('Admin/Student/Create', [
            'title' => 'Tambah Siswa',
            'workshops' => $workshops,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required',
            'full_name' => 'required',
            'class' => 'required',
            'major' => 'required',
            'workshop_id' => 'required',
        ]);

        $existingStudent = Student::where('nis', $validated['nis'])->first();
        if ($existingStudent) {
            return back()->withErrors([
                'message' => 'NIS telah digunakan siswa lain',
            ]);
        }
        $user = User::create([
            'username' => $validated['nis'],
            'password' => bcrypt(config('app.default_password')),
            'role' => User::STUDENT_ROLE,
        ]);
        $student = Student::create(
            array_merge($validated, [
                'user_id' => $user->id,
            ]),
        );

        Session::flash('success', 'Siswa baru berhasil ditambahkan');
        return Inertia::location('/admin/student');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nis' => 'required',
            'full_name' => 'required',
            'class' => 'required',
            'major' => 'required',
            'workshop_id' => 'required',
        ]);

        $student = Student::findOrFail($id);
        $existingStudent = Student::where('nis', $validated['nis'])->where('id', '<>', $student->id)->first();
        if ($existingStudent) {
            return back()->withErrors([
                'message' => 'NIS telah digunakan siswa lain',
            ]);
        }

        if ($student->nis !== $validated['nis']) {
            $student->user->update([
                'username' => $validated['nis'],
            ]);
        }

        $student->update($validated);

        Session::flash('success', 'Siswa berhasil diperbarui');
        return Inertia::location('/admin/student');
    }

    public function import(Request $request)
    {
        try {
            $request->validate([
                'file_excel' => 'required|mimes:xlsx|max:2048|file',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors([
                'message' => 'File yang diunggah tidak valid. Pastikan format dan ukuran file sesuai.',
            ]);
        }

        $file = $request->file('file_excel');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('private/import/students', $fileName);

        Excel::import(new StudentImport(), $filePath);
        Session::flash('success', 'File berhasil diunggah dan disimpan.');
        return Inertia::location('/admin/student');
        // try {
        // } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
        //     return back()->withErrors([
        //         'message' => 'Terjadi kesalahan saat proses import',
        //     ]);
        // }
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->user->delete();
        $student->delete();

        Session::flash('success', 'Siswa berhasil dihapus');
        return Inertia::location('/admin/student');
    }
}

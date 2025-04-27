<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supervisor;
use App\Models\User;
use App\Models\Workshop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class SupervisorController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $supervisors = Supervisor::with('workshop.students', 'user')
            ->when($search, function ($query, $search) {
                $query->where('full_name', 'like', "%{$search}%")->orWhere('nip', 'like', "%{$search}%");
            })
            ->paginate(20);

        return Inertia::render('Admin/Supervisor/Index', [
            'title' => 'Data Pembimbing',
            'supervisors' => $supervisors->items(),
        ]);
    }

    public function show($id)
    {
        $supervisor = Supervisor::with('user', 'workshop.students')->findOrFail($id);

        return Inertia::render('Admin/Supervisor/Show', [
            'title' => 'Informasi Pembimbing',
            'supervisor' => $supervisor,
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
        return Inertia::render('Admin/Supervisor/Create', [
            'title' => 'Tambah Pembimbing',
            'workshops' => $workshops,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'required',
            'full_name' => 'required',
        ]);

        if ($request->workshop_id != '' && $request->workshop_id != null) {
            $workshopHasSupervisor = Workshop::where('id', $request->workshop_id)->first();
            if ($workshopHasSupervisor->supervisor_id != null) {
                return back()->withErrors([
                    'message' => 'Pembimbing lain sudah ditugaskan pada DuDi ini',
                ]);
            }
        }

        $user = User::create([
            'username' => $validated['nip'],
            'email' => $request->email ?: null,
            'password' => bcrypt(config('app.default_password')),
            'role' => User::SUPERVISOR_ROLE,
        ]);

        Supervisor::create([
            'user_id' => $user->id,
            'full_name' => $validated['full_name'],
            'nip' => $validated['nip'],
            'workshop_id' => $request->workshop_id ?: null,
        ]);

        Session::flash('success', 'Pembimbing baru berhasil ditambahkan');
        return Inertia::location('/admin/supervisor');
    }

    public function edit($id)
    {
        $supervisor = Supervisor::with('user', 'workshop')->findOrFail($id);
        $workshops = Workshop::all()->map(function ($workshop) {
            return [
                'value' => '' . $workshop->id . '',
                'label' => $workshop->name,
            ];
        });

        return Inertia::render('Admin/Supervisor/Edit', [
            'title' => 'Edit Pembimbing',
            'supervisor' => $supervisor,
            'workshops' => $workshops,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nip' => 'required',
            'full_name' => 'required',
        ]);

        if ($request->workshop_id != '' && $request->workshop_id != null) {
            $workshopHasSupervisor = Workshop::where('id', $request->workshop_id)->first();
            if ($workshopHasSupervisor->supervisor_id != null && $workshopHasSupervisor->supervisor_id != $id) {
                return back()->withErrors([
                    'message' => 'Pembimbing lain sudah ditugaskan pada DuDi ini',
                ]);
            } elseif ($workshopHasSupervisor->supervisor_id != $id) {
                $workshopHasSupervisor->supervisor_id = $id;
                $workshopHasSupervisor->save();
            }
        }

        $supervisor = Supervisor::findOrFail($id);

        if ($supervisor->nip !== $validated['nip']) {
            $supervisor->user->update([
                'username' => $validated['nip'],
            ]);
        }

        $supervisor->update([
            'full_name' => $validated['full_name'],
            'nip' => $validated['nip'],
        ]);

        Session::flash('success', 'Pembimbing berhasil diperbarui');
        return Inertia::location('/admin/supervisor');
    }

    public function destroy($id)
    {
        $supervisor = Supervisor::findOrFail($id);
        $supervisor->user->delete();
        $supervisor->delete();

        Session::flash('success', 'Pembimbing berhasil dihapus');
        return Inertia::location('/admin/supervisor');
    }
}

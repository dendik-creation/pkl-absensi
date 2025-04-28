<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supervisor;
use App\Models\User;
use App\Models\Workshop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class SupervisorController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $supervisors = Supervisor::with('workshops.students', 'user')
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
        $supervisor = Supervisor::with('user', 'workshops.students')->findOrFail($id);

        return Inertia::render('Admin/Supervisor/Show', [
            'title' => 'Informasi Pembimbing',
            'supervisor' => $supervisor,
        ]);
    }

    public function create()
    {
        $workshops = Workshop::where('supervisor_id', null)->get()->map(function ($workshop) {
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
            'email' => 'required|email',
            'full_name' => 'required',
        ]);

        $conflictingWorkshops = collect();
        if ($request->workshop_id && is_array($request->workshop_id)) {
            $conflictingWorkshops = Workshop::whereIn('id', $request->workshop_id)
                ->whereNotNull('supervisor_id')
                ->get();

            if ($conflictingWorkshops->isNotEmpty()) {
                return back()->withErrors([
                    'message' => 'Beberapa DuDi sudah memiliki pembimbing yang ditugaskan',
                ]);
            }
        }

        DB::transaction(function () use ($request, $validated) {
            $user = User::create([
                'username' => $request->nip ?: null,
                'email' => $validated['email'],
                'password' => bcrypt(config('app.default_password')),
                'role' => User::SUPERVISOR_ROLE,
            ]);

            $supervisor = Supervisor::create([
                'user_id' => $user->id,
                'full_name' => $validated['full_name'],
                'nip' => $request->nip ?: null,
            ]);

            if ($request->workshop_id && is_array($request->workshop_id)) {
                Workshop::whereIn('id', $request->workshop_id)->update(['supervisor_id' => $supervisor->id]);
            }
        });

        Session::flash('success', 'Pembimbing baru berhasil ditambahkan');
        return Inertia::location('/admin/supervisor');
    }

    public function edit($id)
    {
        $supervisor = Supervisor::with('user', 'workshops')->findOrFail($id);
        $workshops = Workshop::where('supervisor_id', null)->get()->map(function ($workshop) {
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
            'email' => 'required|email',
            'full_name' => 'required',
        ]);

        $supervisor = Supervisor::findOrFail($id);

        if ($request->workshop_id && is_array($request->workshop_id)) {
            $conflictingWorkshops = Workshop::whereIn('id', $request->workshop_id)
                ->whereNotNull('supervisor_id')
                ->where('supervisor_id', '!=', $id)
                ->exists();

            if ($conflictingWorkshops) {
                return back()->withErrors([
                    'message' => 'Beberapa DuDi sudah memiliki pembimbing yang ditugaskan',
                ]);
            }

            Workshop::whereIn('id', $request->workshop_id)
                ->update(['supervisor_id' => $id]);

            Workshop::where('supervisor_id', $id)
                ->whereNotIn('id', $request->workshop_id)
                ->update(['supervisor_id' => null]);
        }

        if ($supervisor->nip !== $request->nip) {
            $supervisor->user->update([
                'username' => $request->nip ?: null,
            ]);
        }

        $supervisor->update([
            'full_name' => $validated['full_name'],
            'nip' => $request->nip ?: null,
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

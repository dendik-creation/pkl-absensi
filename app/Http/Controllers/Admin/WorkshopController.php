<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supervisor;
use App\Models\Workshop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class WorkshopController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $workshops = Workshop::with('supervisor')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%");
            })
            ->paginate(20);

        return Inertia::render('Admin/Workshop/Index', [
            'title' => "Data DuDi",
            'workshops' => $workshops->items(),
        ]);
    }

    public function create()
    {
        $supervisors = Supervisor::all()->map(function ($supervisor) {
            return [
                'value' => "" . $supervisor->id . "",
                'label' => $supervisor->full_name,
            ];
        });
        return Inertia::render('Admin/Workshop/Create', [
            'title' => "Tambah DuDi",
            'supervisors' => $supervisors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'owner_name' => 'required',
            'phone' => 'required',
            'address' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
        ]);

        if($request->supervisor_id != "" && $request->supervisor_id != null){
            $validated['supervisor_id'] = $request->supervisor_id;
            $supervisorHasWorkshop = Workshop::where('supervisor_id', $request->supervisor_id)->first();
            if($supervisorHasWorkshop){
                return back()->withErrors([
                    'message' => 'Pembimbing sudah ditugaskan di Dudi lain'
                ]);
            }
        }

        Workshop::create([
            'name' => $validated['name'],
            'owner_name' => $validated['owner_name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'latitude' => (float) $validated['latitude'],
            'longitude' => (float) $validated['longitude'],
            'supervisor_id' => $request->supervisor_id ?: null,
        ]);

        Session::flash('success', 'DuDi baru berhasil ditambahkan');
        return Inertia::location('/admin/workshop');
    }

    public function show($id){
        $workshop = Workshop::with('supervisor', 'students')->findOrFail($id);

        return Inertia::render('Admin/Workshop/Show', [
            'title' => "Informasi Siswa",
            'workshop' => $workshop,
        ]);
    }

    public function edit($id)
    {
        $workshop = Workshop::findOrFail($id);
        $supervisors = Supervisor::all()->map(function ($supervisor) {
            return [
                'value' => "" . $supervisor->id . "",
                'label' => $supervisor->full_name,
            ];
        });

        return Inertia::render('Admin/Workshop/Edit', [
            'title' => "Edit DuDi",
            'workshop' => $workshop,
            'supervisors' => $supervisors,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required',
            'owner_name' => 'required',
            'phone' => 'required',
            'address' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
        ]);

        if($request->supervisor_id != "" && $request->supervisor_id != null){
            $validated['supervisor_id'] = $request->supervisor_id;
            $supervisorHasWorkshop = Workshop::where('supervisor_id', $request->supervisor_id)->first();
            if($supervisorHasWorkshop){
                return back()->withErrors([
                    'message' => 'Pembimbing sudah ditugaskan di Dudi lain'
                ]);
            }
        }

        Workshop::where('id', $id)->update([
            'name' => $validated['name'],
            'owner_name' => $validated['owner_name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'latitude' => (float) $validated['latitude'],
            'longitude' => (float) $validated['longitude'],
            'supervisor_id' => $request->supervisor_id ?: null,
        ]);

        Session::flash('success', 'DuDi berhasil diperbarui');
        return Inertia::location('/admin/workshop');
    }

    public function destroy($id)
    {
        $workshop = Workshop::findOrFail($id);
        $workshop->delete();

        Session::flash('success', 'DuDi berhasil dihapus');
        return Inertia::location('/admin/workshop');
    }
}

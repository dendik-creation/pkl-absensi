<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Supervisor;
use App\Models\Workshop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WorkshopController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $supervisor = Supervisor::where('user_id', Auth::user()->id)->first();
        $workshops = Workshop::when($search, function ($query, $search) use ($supervisor) {
                $query->where('supervisor_id', $supervisor->id)->where('name', 'like', "%{$search}%")->orWhere('address', 'like', "%{$search}%");
            })
            ->paginate(20);

        return Inertia::render('Supervisor/Workshop/Index', [
            'title' => 'Data DuDi',
            'workshops' => $workshops->items(),
        ]);
    }

    public function show($id)
    {
        $workshop = Workshop::with('supervisor', 'students')->findOrFail($id);

        return Inertia::render('Supervisor/Workshop/Show', [
            'title' => 'Informasi DuDi',
            'workshop' => $workshop,
        ]);
    }
}

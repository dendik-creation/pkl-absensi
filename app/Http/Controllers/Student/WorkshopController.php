<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WorkshopController extends Controller
{
    public function index(){
        $user = Auth::user()->id;
        $student = Student::where('user_id', $user)
            ->with([
            'workshop' => function ($query) {
                $query->with(['students', 'supervisor']);
            }
            ])->first();

        return Inertia::render('Student/Workshop/Index', [
            'title' => 'Tempat DuDi Kamu',
            'workshop' => $student?->workshop,
        ]);
    }
}

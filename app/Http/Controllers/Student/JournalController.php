<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Journal;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index(Request $request)
    {
        $now = now()->format('Y-m-d');
        $student = Student::where('user_id', Auth::user()->id)->first();
        $hasJournalToday = Journal::where('date', $now)->where('student_id', $student->id)->exists();
        $hasAttendedToday = Attendance::whereDate('check_in', $now)
            ->where('student_id', $student->id)
            ->exists();
        $filtered_date = $request->input('date');

        $journals = Journal::when($filtered_date, function ($query, $filtered_date) {
            $query->where('date', $filtered_date);
        })->orderBy('date', 'desc')->paginate(20);

        return Inertia::render('Student/Journal/Index', [
            'title' => 'Jurnal PKL Kamu',
            'journals' => $journals->items(),
            'has_journal_today' => $hasJournalToday,
            'has_attended_today' => $hasAttendedToday,
        ]);
    }

    public function create()
    {
        $now = now()->format('Y-m-d');
        $student = Student::where('user_id', Auth::user()->id)->first();
        $journal = Journal::where('date', $now)->where('student_id', $student->id)->first();
        if ($journal) {
            Session::flash('error', 'Kamu telah membuat jurnal pada hari ini');
            return back();
        }
        return Inertia::render('Student/Journal/Create', [
            'title' => 'Buat Jurnal PKL',
            'date' => $now,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'activity' => 'required|string',
        ]);

        $student = Student::where('user_id', Auth::user()->id)->first();
        Journal::create([
            'student_id' => $student->id,
            'date' => $request->input('date'),
            'activity' => $request->input('activity'),
        ]);

        Session::flash('success', 'Jurnal berhasil ditambahkan');
        return Inertia::location('/student/journal');
    }

    public function show($id){
        $journal = Journal::with('student')->findOrFail($id);
        return Inertia::render('Student/Journal/Show', [
            'title' => 'Detail Jurnal PKL',
            'journal' => $journal,
        ]);
    }

    public function edit($id){
        $journal = Journal::findOrFail($id);
        return Inertia::render('Student/Journal/Edit', [
            'title' => 'Detail Jurnal PKL',
            'journal' => $journal,
        ]);
    }

    public function update(Request $request, $id){
        $request->validate([
            'date' => 'required|date',
            'activity' => 'required|string',
        ]);

        $journal = Journal::findOrFail($id);
        $journal->update([
            'date' => $request->input('date'),
            'activity' => $request->input('activity'),
        ]);

        Session::flash('success', 'Jurnal berhasil diperbarui');
        return Inertia::location('/student/journal');
    }

    public function destroy($id){
        $journal = Journal::findOrFail($id);
        $journal->delete();

        Session::flash('success', 'Jurnal berhasil dihapus');
        return Inertia::location('/student/journal');
    }
}

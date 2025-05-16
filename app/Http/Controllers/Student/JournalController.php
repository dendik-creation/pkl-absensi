<?php

namespace App\Http\Controllers\Student;

use App\Exports\JournalExport;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\GlobalSetting;
use App\Models\Journal;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

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
        $filtered_month = $request->input('month');

        $journals = Journal::where('student_id', $student->id)->when(!empty($filtered_date), function ($query) use ($filtered_date) {
            $query->where('date', $filtered_date);
        })->when(!empty($filtered_month), function ($query) use ($filtered_month) {
            $query->whereMonth('date', $filtered_month);
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
        $attended_today = Attendance::whereDate('check_in', $now)
            ->where('student_id', $student->id)
            ->exists();
        if (!$attended_today) {
            Session::flash('error', 'Kamu tidak melakukan absensi pada hari ini');
            return back();
        }
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
        $has_attendance_today = Attendance::whereDate('check_in', $request->input('date'))
            ->where('student_id', $student->id)
            ->exists();
        if(!$has_attendance_today) {
            return back()->withErrors(['message' => "Kamu tidak absensi pada tanggal tersebut"]);
        }
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

        $student = Student::where('user_id', Auth::user()->id)->first();
        $has_attendance_today = Attendance::whereDate('check_in', $request->input('date'))
            ->where('student_id', $student->id)
            ->exists();
        if(!$has_attendance_today) {
            return back()->withErrors(['message' => "Kamu tidak absensi pada tanggal tersebut"]);
        }

        $journal = Journal::findOrFail($id);
        $journal->update([
            'date' => $request->input('date'),
            'activity' => $request->input('activity'),
        ]);

        Session::flash('success', 'Jurnal berhasil diperbarui');
        return Inertia::location('/student/journal');
    }

    public function export(Request $request){
        $format = $request->input('format');
        $setting = GlobalSetting::first();
        $student = Student::where('user_id', Auth::user()->id)->first();
        $month_selected = $request->input('month') ?: null;
        if($format == "PDF"){
            $journals = Journal::where('student_id', $student->id)->when($month_selected, function ($query) use ($month_selected) {
                $query->whereMonth('date', $month_selected);
            })->orderBy('date', 'asc')->get();
            return Inertia::render('Student/Journal/Export', [
                'title' => $student->nis . "_" . "JURNAL_" . ($month_selected == null ? "ALL" : strtoupper(substr(\Carbon\Carbon::create()->month(intval($month_selected))->format('F'), 0, 3))),
                'student' => $student,
                'setting' => $setting,
                'journals' => $journals,
                'month_selected' => $month_selected,
            ]);
        }
        elseif($format == "XLSX"){
            $month_selected = $request->input('month') ?: null;
            $journals = Journal::where('student_id', $student->id)->when($month_selected, function ($query) use ($month_selected) {
                $query->whereMonth('date', $month_selected);
            })->orderBy('date', 'asc')->get();
            return Excel::download(new JournalExport($journals, $student, $month_selected), $student->nis . "_" . "JURNAL_" . ($month_selected == null ? "ALL" : strtoupper(substr(\Carbon\Carbon::create()->month(intval($month_selected))->format('F'), 0, 3))) . ".xlsx");
        }
    }

    public function destroy($id){
        $journal = Journal::findOrFail($id);
        $journal->delete();

        Session::flash('success', 'Jurnal berhasil dihapus');
        return Inertia::location('/student/journal');
    }
}

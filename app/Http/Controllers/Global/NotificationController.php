<?php

namespace App\Http\Controllers\Global;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Supervisor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function updateFcmToken(Request $request)
    {
        $request->validate([
            'fcm_token' => 'required|string',
        ]);

        $supervisor = Supervisor::where('user_id', Auth::user()->id)->first();
        if (!$supervisor) {
            return response()->json(['message' => 'Supervisor not found.'], 404);
        }
        $supervisor->update([
            'fcm_token' => $request->input('fcm_token'),
        ]);

        return response()->json(['message' => 'FCM token updated successfully.']);
    }

    public function studentSubscribeReminder()
    {
        $student = Student::where('user_id', Auth::id())->first();
        if (!$student) {
            return response()->json(['message' => 'Student not found.'], 404);
        }
        $student->update([
            'reminder_active' => true,
        ]);
        return response()->json(['message' => 'Reminder subscription successful.']);
    }
}

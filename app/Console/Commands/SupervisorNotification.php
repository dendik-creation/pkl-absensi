<?php
namespace App\Console\Commands;

use App\Http\Controllers\Global\NotificationController;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Supervisor;
use Illuminate\Console\Command;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Kreait\Firebase\Messaging\CloudMessage;

class SupervisorNotification extends Command
{
    protected $signature = 'notification:supervisor';
    protected $description = 'Blast notification to all supervisors with attendance student daily report';

    private function getExptectedStudentCount($workshops_id)
    {
        return Student::whereIn('workshop_id', $workshops_id)->pluck('id');
    }

    private function getAttendedToday($students_id)
    {
        return Attendance::whereIn('student_id', $students_id)->whereDate('check_in', now())->where('status', Attendance::PRESENT)->count();
    }

    private function getExcusedToday($students_id)
    {
        return Attendance::whereIn('student_id', $students_id)->whereDate('check_in', now())->where('status', Attendance::EXCUSED)->count();
    }

    private function getLatestAttendanceCount($workshops_id)
    {
        $students_id = $this->getExptectedStudentCount($workshops_id);
        $expected_count = count($students_id);
        $attended_count = $this->getAttendedToday($students_id);
        $excused_count = $this->getExcusedToday($students_id);
        return "Dari $expected_count siswa, $attended_count siswa hadir, dan $excused_count siswa izin 📍";
    }

    public function handle()
    {
        $this->info('🔃 Sending notification to supervisors...');
        $supervisors = Supervisor::whereNotNull('fcm_token')->with('workshops')->get();
        if ($supervisors->isEmpty()) {
            $this->info('No supervisors found.');
            return;
        }

        $now = now()->format('H:i');

        $messages = [];
        $notif_title = 'Laporan Harian PKL Siswa';
        $notif_image = config('app.url') . '/assets/img/favicon.png';

        foreach ($supervisors as $supervisor) {
            if (!$supervisor->fcm_token) {
                continue;
            }
            $notif_body = $this->getLatestAttendanceCount($supervisor->workshops->pluck('id'));
            $notification_data = [
                'title' => $notif_title,
                'body' => "($now) $notif_body",
                'image' => $notif_image,
            ];
            $messages[] = CloudMessage::new()
                ->toToken($supervisor->fcm_token)
                ->withData($notification_data);
        }

        $batchSize = 500;
        $chunks = array_chunk($messages, $batchSize);
        $success_count = 0;
        $messaging = Firebase::messaging();
        foreach ($chunks as $chunk) {
            $responses = $messaging->sendAll($chunk);
            $success_count += $responses->successes()->count();
        }

        $this->info("✅ Notifications successfully sent to $success_count out of {$supervisors->count()} supervisors.");
    }
}

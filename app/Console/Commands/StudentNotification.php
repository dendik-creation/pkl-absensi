<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use Illuminate\Console\Command;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Kreait\Laravel\Firebase\Facades\Firebase;

class StudentNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notification:student {type : Jenis reminder (in|out)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder notification to students to mark attendance (in or out)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->argument('type');

        if (!in_array($type, ['in', 'out'])) {
            $this->error("Argumen 'type' hanya boleh 'in' atau 'out'");
            return Command::FAILURE;
        }

        $this->info("Sending Student Attendance Reminder: {$type}...");

        try {
            $messaging = Firebase::messaging();
            $topic = Attendance::ATTENDANCE_REMINDER_TOPIC;

            $title = 'Hai 😁, Absen dulu Yuk!';
            $body = $type === 'in'
                ? 'Waktunya absen masuk! Jangan sampai lupa dan terlambat ya!'
                : 'Waktunya absen pulang! Jangan sampai lupa ya!';

            $message = CloudMessage::new()->toTopic($topic)
                ->withData([
                    'title' => $title,
                    'body' => $body,
                    'image' => config('app.url') . '/assets/img/favicon.png'
                ]);

            $messaging->send($message);

            $this->info("Reminder '{$type}' berhasil dikirim ke topic '{$topic}'");
            return Command::SUCCESS;

        } catch (\Throwable $e) {
            $this->error("Gagal mengirim notifikasi: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}

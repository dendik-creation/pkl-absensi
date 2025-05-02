<?php

namespace Database\Seeders;

use App\Models\Attendance;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Attendance::create([
            'student_id' => 1,
            'check_in' => now()->format('Y-m-d') . ' 08:15:32',
            'check_out' => now()->format('Y-m-d') . ' 15:45:21',
            'status' => 'PRESENT',
            'latitude_in' => -6.826408 + (20 / 111320),
            'longitude_in' => 110.876416 + (20 / (111320 * cos(deg2rad(-6.826408)))),
            'latitude_out' => -6.826408 + (20 / 111320),
            'longitude_out' => 110.876416 + (20 / (111320 * cos(deg2rad(-6.826408)))),
        ]);
        Attendance::create([
            'student_id' => 1,
            'check_in' => now()->format('Y-m-d') . ' 09:05:47',
            'check_out' => now()->format('Y-m-d') . ' 16:30:12',
            'status' => 'PRESENT',
            'latitude_in' => -6.826408 + (20 / 111320),
            'longitude_in' => 110.876416 + (20 / (111320 * cos(deg2rad(-6.826408)))),
            'latitude_out' => -6.826408 + (20 / 111320),
            'longitude_out' => 110.876416 + (20 / (111320 * cos(deg2rad(-6.826408)))),
        ]);
        Attendance::create([
            'student_id' => 1,
            'check_in' => now()->format('Y-m-d') . ' 10:20:14',
            'check_out' => now()->format('Y-m-d') . ' 19:10:45',
            'status' => 'PRESENT',
            'latitude_in' => -6.826408 + (20 / 111320),
            'longitude_in' => 110.876416 + (20 / (111320 * cos(deg2rad(-6.826408)))),
            'latitude_out' => -6.826408 + (20 / 111320),
            'longitude_out' => 110.876416 + (20 / (111320 * cos(deg2rad(-6.826408)))),
        ]);
        Attendance::create([
            'student_id' => 2,
            'check_in' => now()->format('Y-m-d') . ' 08:45:10',
            'check_out' => now()->format('Y-m-d') . ' 17:25:33',
            'status' => 'PRESENT',
            'latitude_in' => -6.826408 + (20 / 111320),
            'longitude_in' => 110.876416 + (20 / (111320 * cos(deg2rad(-6.826408)))),
            'latitude_out' => -6.826408 + (20 / 111320),
            'longitude_out' => 110.876416 + (20 / (111320 * cos(deg2rad(-6.826408)))),
        ]);
        Attendance::create([
            'student_id' => 3,
            'check_in' => now()->format('Y-m-d') . ' 09:30:22',
            'check_out' => now()->format('Y-m-d') . ' 18:40:55',
            'status' => 'PRESENT',
            'latitude_in' => -6.826408 + (20 / 111320),
            'longitude_in' => 110.876416 + (20 / (111320 * cos(deg2rad(-6.826408)))),
            'latitude_out' => -6.826408 + (20 / 111320),
            'longitude_out' => 110.876416 + (20 / (111320 * cos(deg2rad(-6.826408)))),
        ]);
    }
}

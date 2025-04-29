<?php

namespace Database\Seeders;

use App\Models\Attendance;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Attendance::create([
            'student_id' => 1,
            'check_in' => now(),
            'check_out' => now()->addHours(8),
            'status' => 'PRESENT',
            'latitude_in' => 37.7749,
            'longitude_in' => -122.4194,
            'latitude_out' => 37.7749,
            'longitude_out' => -122.4194,
        ]);
        Attendance::create([
            'student_id' => 1,
            'check_in' => now()->addDay(),
            'check_out' => now()->addDay()->addHours(8),
            'status' => 'PRESENT',
            'latitude_in' => 37.7749,
            'longitude_in' => -122.4194,
            'latitude_out' => 37.7749,
            'longitude_out' => -122.4194,
        ]);
        Attendance::create([
            'student_id' => 1,
            'check_in' => now()->addDays(2),
            'check_out' => now()->addDays(2)->addHours(8),
            'status' => 'PRESENT',
            'latitude_in' => 37.7749,
            'longitude_in' => -122.4194,
            'latitude_out' => 37.7749,
            'longitude_out' => -122.4194,
        ]);
        Attendance::create([
            'student_id' => 2,
            'check_in' => now(),
            'check_out' => now()->addHours(8),
            'status' => 'PRESENT',
            'latitude_in' => 37.7749,
            'longitude_in' => -122.4194,
            'latitude_out' => 37.7749,
            'longitude_out' => -122.4194,
        ]);
        Attendance::create([
            'student_id' => 3,
            'check_in' => now(),
            'check_out' => now()->addHours(8),
            'status' => 'PRESENT',
            'latitude_in' => 37.7749,
            'longitude_in' => -122.4194,
            'latitude_out' => 37.7749,
            'longitude_out' => -122.4194,
        ]);
    }
}

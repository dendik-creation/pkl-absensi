<?php

namespace Database\Seeders;

use App\Models\GlobalSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GlobalSettingSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GlobalSetting::create([
            'app_name' => 'Absensi PKL',
            'app_icon' => 'assets/img/favicon.png',
            'max_attendance_radius' => 200,
            'check_in_start' => '07:00:00',
            'check_in_end' => '10:00:00',
            'check_out_start' => '13:00:00',
            'check_out_end' => '21:00:00',
        ]);
    }
}

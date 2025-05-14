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
            'default_latitude' => -6.5268489,
            'default_longitude' => 110.9206989,
            'check_in_start' => '07:00',
            'check_in_end' => '12:00',
            'check_out_start' => '13:00',
            'check_out_end' => '21:00',

            // School Identity
            'school_name' => 'SMK Negeri 1 Cluwak',
            'school_address' => 'Jl. Raya Tayu-Jepara No.KM 15, Gili Kidul, Sirahan, Kec. Cluwak, Kabupaten Pati, Jawa Tengah 59157',
            'school_phone' => '02914277788',
            'school_website' => 'www.smkn1cluwak.sch.id',
        ]);
    }
}

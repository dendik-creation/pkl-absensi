<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkshopSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Workshop::create([
            'name' => 'SEMESTA SOFENIR',
            'address' => 'Jl. Raya Semesta No. 1, Semesta, Kec. Semesta, Kota Semesta',
            'phone' => '081234567890',
            'supervisor_id' => 1,
            'owner_name' => 'Budi Santoso',
        ]);


        Student::create([
            'user_id' => 3,
            'full_name' => "Akbar Firdaus Wicaksono",
            'nis' => '5912',
            'class' => 'XII RPL 1',
            'major' => 'RPL',
            'workshop_id' => 1,
        ]);
    }
}

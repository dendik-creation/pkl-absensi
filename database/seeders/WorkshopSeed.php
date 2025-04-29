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
        \App\Models\Workshop::create([
            'name' => 'KEDAI ANUGERAH NYAM NYAM',
            'address' => 'Jl. Nyam Nyam No. 2, Anugerah, Kec. Anugerah, Kota Anugerah',
            'phone' => '081234567890',
            'supervisor_id' => 1,
            'owner_name' => 'ALAM',
        ]);
        \App\Models\Workshop::create([
            'name' => 'MEWALIK MEKANIK TUMBUHAN',
            'address' => 'Jl. Tumbuhan No. 3, Mekanik, Kec. Mekanik, Kota Mekanik',
            'phone' => '081234567890',
            'supervisor_id' => 2,
            'owner_name' => 'MEWALIK FESBUK',
        ]);


        Student::create([
            'user_id' => 5,
            'full_name' => "Akbar Firdaus Wicaksono",
            'nis' => '5913',
            'class' => 'XII RPL 3',
            'major' => 'RPL',
            'workshop_id' => 1,
        ]);

        Student::create([
            'user_id' => 6,
            'full_name' => "Ahmad GedagediGedao",
            'nis' => '5914',
            'class' => 'XII RPL 1',
            'major' => 'RPL',
            'workshop_id' => 1,
        ]);
        Student::create([
            'user_id' => 7,
            'full_name' => "Kurniawan Sukma Wibowo",
            'nis' => '5915',
            'class' => 'XII RPL 1',
            'major' => 'RPL',
            'workshop_id' => 2,
        ]);
    }
}

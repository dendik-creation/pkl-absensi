<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\Supervisor;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DummyUserSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'admin',
            'password' => bcrypt('12345'),
            'role' => 'ADMIN',
        ]);

        // SPV
        User::create([
            'username' => '1234567890',
            'password' => bcrypt('12345'),
            'role' => 'SUPERVISOR',
            'email' => 'supervisor@gmail.com'
        ]);

        Supervisor::create([
            "user_id" => 2,
            "full_name" => "Supervisor 1",
            "nip" => "1234567890",
        ]);

        // STD
        User::create([
            'username' => '1234',
            'password' => bcrypt('12345'),
            'role' => 'STUDENT',
            'email' => 'student@gmail.com'
        ]);

        Student::create([
            'user_id' => 3,
            'full_name' => "Akbar Firdaus Wicaksono",
            'nis' => '5912',
            'class' => 'XII RPL 1',
            'major' => 'RPL',
        ]);
    }
}

<?php

namespace Database\Seeders;

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

        // SPV 1
        User::create([
            'username' => '1234567890',
            'password' => bcrypt('12345'),
            'role' => 'SUPERVISOR',
            'email' => 'supervisor1@gmail.com'
        ]);

        Supervisor::create([
            "user_id" => 2,
            "full_name" => "Supervisor 1",
            "nip" => "1234567890",
        ]);

        // SPV 2
        User::create([
            'username' => '111111111',
            'password' => bcrypt('12345'),
            'role' => 'SUPERVISOR',
            'email' => 'supervisor2@gmail.com'
        ]);

        Supervisor::create([
            "user_id" => 3,
            "full_name" => "Supervisor 2",
            "nip" => "111111111",
        ]);

        // STD 1
        User::create([
            'username' => '5913',
            'password' => bcrypt('12345'),
            'role' => 'STUDENT',
            'email' => 'student1@gmail.com'
        ]);
        // STD 2
        User::create([
            'username' => '5914',
            'password' => bcrypt('12345'),
            'role' => 'STUDENT',
            'email' => 'student2@gmail.com'
        ]);
        // STD 3
        User::create([
            'username' => '5915',
            'password' => bcrypt('12345'),
            'role' => 'STUDENT',
            'email' => 'student3@gmail.com'
        ]);
    }
}

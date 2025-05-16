<?php

namespace App\Imports;

use App\Models\Student;
use App\Models\User;
use App\Models\Workshop;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Illuminate\Support\Collection;

class StudentImport implements ToCollection, WithHeadingRow, WithStartRow
{

    /**
     * Specify the starting row for data processing.
     *
     * @return int
     */
    public function startRow(): int
    {
        return 9;
    }

    /**
     * Handle the collection of rows from the Excel file.
     *
     * @param Collection $rows
     * @throws \Throwable
     */
    public function collection(Collection $rows)
    {
        DB::transaction(function () use ($rows) {
            $students = [];

            foreach ($rows as $row) {
                try {
                    // Check Existing Workshop
                    $workshop = null;
                    if (!empty($row[5])) {
                        $workshop = Workshop::where('name', 'like', '%' . $row[5] . '%')->first();
                        if (!$workshop) {
                            throw ValidationException::withMessages([
                                'DUDI' => "DuDi dengan nama '{$row[5]}' tidak ditemukan.",
                            ]);
                        }
                    }

                    // User create
                    $user = User::create([
                        'username' => $row[1],
                        'email' => null,
                        'password' => bcrypt(config('app.default_password')),
                        'role' => User::STUDENT_ROLE,
                    ]);

                    // Batch insert
                    $students[] = [
                        'user_id' => $user->id,
                        'nis' => $row[1],
                        'full_name' => $row[2],
                        'class' => $row[3],
                        'major' => $row[4],
                        'workshop_id' => $workshop ? $workshop->id : null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                } catch (\Exception $e) {
                    throw $e;
                }
            }

            // Batch insert
            Student::insert($students);
        });
    }
}

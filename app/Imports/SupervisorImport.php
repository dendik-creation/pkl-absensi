<?php

namespace App\Imports;

use App\Models\Supervisor;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Models\Workshop;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;

class SupervisorImport implements ToCollection, WithStartRow
{
   /**
     * Specify the starting row for data processing.
     *
     * @return int
     */
    public function startRow(): int
    {
        return 8;
    }

    /**
     * Handle the collection of rows from the Excel file.
     *
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        DB::transaction(function () use ($rows) {
            $supervisors = [];

            $filteredRows = $rows->filter(function ($row) {
                return $row->filter()->isNotEmpty();
            });

            foreach ($filteredRows as $row) {
                if (count($row) < 5) {
                    throw new \Exception('Jumlah kolom tidak sesuai. Proses import dibatalkan.');
                }

                foreach ($row as $index => $column) {
                    if (is_null($row[1]) && is_null($row[3])) {
                        throw new \Exception('Jika ada NIP kosong, email wajib diisi. Proses import dibatalkan.');
                    }
                }

                $user = User::create([
                    'username' => $row[1] ?: null,
                    'email' => $row[3] ?: null,
                    'password' => bcrypt(config('app.default_password')),
                    'role' => "SUPERVISOR",
                ]);

                $supervisors[] = [
                    'user_id' => $user->id,
                    'nip' => $row[1] ?: null,
                    'full_name' => $row[2],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $insertedSupervisors = Supervisor::insert($supervisors);

            foreach ($filteredRows as $row) {
                $workshopNames = explode(',', $row[4]);

                foreach ($workshopNames as $workshopName) {
                    $workshopName = trim($workshopName);

                    try {
                        $workshop = Workshop::where('name', 'like', '%' . $workshopName . '%')->first();

                        if (!$workshop) {
                            throw new \Exception("DuDI dengan nama '{$workshopName}' tidak ditemukan.");
                        }

                        if (!is_null($workshop->supervisor_id)) {
                            throw new \Exception("DuDI '{$workshopName}' sudah ditempati pembimbing lain.");
                        }

                        $user = User::with('supervisor')
                            ->where('username', $row[1])
                            ->orWhere('email', $row[3])
                            ->first();

                        if ($user->supervisor) {
                            $workshop->update(['supervisor_id' => $user->supervisor->id]);
                        }
                    } catch (\Exception $e) {
                        continue;
                    }
                }
            }
        });
    }
}

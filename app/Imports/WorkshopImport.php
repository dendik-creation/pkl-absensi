<?php

namespace App\Imports;

use App\Models\Workshop;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;

class WorkshopImport implements ToCollection, WithStartRow
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
     * @throws \Throwable
     */
    public function collection(Collection $rows)
    {
        DB::transaction(function () use ($rows) {
            $workshops = [];

            $filteredRows = $rows->filter(function ($row) {
                return $row->filter()->isNotEmpty();
            });

            foreach ($filteredRows as $row) {
                if (count($row) < 7) {
                    throw new \Exception('Jumlah kolom tidak sesuai. Proses import dibatalkan.');
                }

                foreach ($row as $index => $column) {
                    if (trim($column) == '') {
                        throw new \Exception('Ada data yang tidak lengkap. Proses import dibatalkan');
                    } elseif (($index === 5 || $index === 6) && !is_numeric($column)) {
                        throw new \Exception('Latitude dan longitude harus berupa angka desimal. Proses import dibatalkan.');
                    }
                }

                $workshops[] = [
                    'name' => $row[1],
                    'owner_name' => $row[2],
                    'phone' => $row[3],
                    'address' => $row[4],
                    'latitude' => $row[5],
                    'longitude' => $row[6],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            Workshop::insert($workshops);
        });
    }
}

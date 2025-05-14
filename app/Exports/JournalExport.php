<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class JournalExport implements FromArray, WithHeadings, WithStyles
{
    protected $journals;
    protected $student;
    protected $month;

    public function __construct($journals, $student, $month)
    {
        $this->journals = $journals;
        $this->student = $student;
        $this->month = $month ?: null;
    }

    public function array(): array
    {
        $data = [];
        $index = 1;

        foreach ($this->journals as $journal) {
            $data[] = [
                'No' => $index++,
                'Tanggal' => (Carbon::parse($journal->date)->translatedFormat('d F Y')),
                'Kegiatan' => strip_tags(str_replace('<br>', "\n", $journal->activity)),
            ];
        }

        return $data;
    }

    public function headings(): array
    {
        $monthName = $this->month ? date('F Y', mktime(0, 0, 0, $this->month, 1)) : date('F Y');
        return [
            [($this->month ? "Jurnal PKL " . $monthName : "Jurnal PKL Keseluruhan")],
            ['Nama Siswa', $this->student->full_name],
            ['NIS', $this->student->nis],
            ['Kelas', $this->student->class],
            ['Jurusan', $this->student->major],
            [],
            ['No', 'Tanggal', 'Kegiatan'],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->mergeCells('A1:C1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->getStyle('B2')->getFont()->setBold(true);
        $sheet->getStyle('B3')->getFont()->setBold(true);
        $sheet->getStyle('B3')->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_TEXT);
        $sheet->getStyle('B4')->getFont()->setBold(true);
        $sheet->getStyle('B5')->getFont()->setBold(true);
        $sheet->getStyle('A7:C7')->getFont()->setBold(true);
        $sheet->getStyle('A8:A' . $sheet->getHighestRow())->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_TEXT);

        $highestRow = $sheet->getHighestRow();
        $sheet->getStyle('A7:C' . $highestRow)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

        return [
            'A1' => ['alignment' => ['horizontal' => 'center']],
        ];
    }
}

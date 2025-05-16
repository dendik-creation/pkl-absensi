<?php

namespace App\Exports;

use App\Models\Attendance;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AttendanceExport implements FromArray, WithHeadings, WithStyles
{
    protected $title;
    protected $attendances;
    protected $student;

    public function __construct($title, $attendances, $student)
    {
        $this->title = $title;
        $this->attendances = $attendances;
        $this->student = $student;
    }

    private function statuses($statuses){
        switch ($statuses) {
            case Attendance::PRESENT:
                return 'Hadir';
            case Attendance::ABSENT:
                return 'Tidak Hadir';
            case Attendance::EXCUSED:
                return 'Izin';
            default:
                return 'Tidak Diketahui';
        }
    }

    public function array(): array
    {
        $data = [];
        $index = 1;

        foreach ($this->attendances as $attendance) {
            $data[] = [
                'No' => $index++,
                'Tanggal' => $attendance['check_in'] ? (Carbon::parse($attendance['check_in'])->translatedFormat('d F Y')) : '-',
                'Waktu Masuk' => $attendance['check_in'] && $attendance['status'] != Attendance::ABSENT ? Carbon::parse($attendance['check_in'])->translatedFormat('H:i') : '-',
                'Waktu Pulang' => $attendance['check_out'] ? Carbon::parse($attendance['check_out'])->translatedFormat('H:i') : '-',
                'Status' => $this->statuses($attendance['status'])
            ];
        }

        return $data;
    }

    public function headings(): array
    {
        return [
            [$this->title],
            ['Nama Siswa', $this->student->full_name],
            ['NIS', $this->student->nis],
            ['Kelas', $this->student->class],
            ['Jurusan', $this->student->major],
            [],
            ['No', 'Tanggal', 'Waktu Masuk', 'Waktu Pulang', 'Status'],
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
        $sheet->getStyle('A7:E7')->getFont()->setBold(true);
        $sheet->getStyle('A8:A' . $sheet->getHighestRow())->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_TEXT);

        foreach ($this->attendances as $index => $attendance) {
            $row = $index + 8;
            if ($attendance['status'] === Attendance::ABSENT) {
                $sheet->mergeCells("C{$row}:E{$row}");
                $sheet->setCellValue("C{$row}", $this->statuses($attendance['status']));
                $sheet->getStyle("A{$row}:E{$row}")->getFill()->setFillType('solid')->getStartColor()->setARGB('FFFFC0CB');
                $sheet->getStyle("C{$row}")->getAlignment()->setHorizontal('center');
            }
        }

        $highestRow = $sheet->getHighestRow();
        $sheet->getStyle("A7:E{$highestRow}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

        return [
            'A1' => ['alignment' => ['horizontal' => 'center']],
        ];
    }
}

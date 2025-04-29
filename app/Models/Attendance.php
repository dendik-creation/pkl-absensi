<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    const ALLOWED_STATUSES = [
        'PRESENT',
        'ABSENT',
        'EXCUSED',
    ];
    const PRESENT = 'PRESENT';
    const ABSENT = 'ABSENT';
    const EXCUSED = 'EXCUSED';
    const MAX_RADIUS = 50;

    // SEBAIKNYA DI BUAT KOLOM MANUAL GLOBAL ATMIN
    const ATTENDANCE_IN_START = 7;
    const ATTENDANCE_IN_END = 13;
    const ATTENDANCE_OUT_START = 14;
    const ATTENDANCE_OUT_END = 21;
    protected $guarded = ['id'];

    public function user(){
        return $this->belongsTo(User::class);
    }
}

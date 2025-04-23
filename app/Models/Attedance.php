<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attedance extends Model
{
    const ALLOWED_STATUSES = [
        'PRESENT',
        'ABSENT',
        'EXCUSED',
    ];
    const PRESENT = 'PRESENT';
    const ABSENT = 'ABSENT';
    const EXCUSED = 'EXCUSED';
    protected $guarded = ['id'];
}

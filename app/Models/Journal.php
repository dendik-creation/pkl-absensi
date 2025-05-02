<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    protected $guarded = ['id'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}

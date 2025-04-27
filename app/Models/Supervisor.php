<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supervisor extends Model
{
    protected $guarded = ['id'];

    public function workshop()
    {
        return $this->hasOne(Workshop::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

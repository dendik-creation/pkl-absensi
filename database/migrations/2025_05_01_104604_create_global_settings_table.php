<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('global_settings', function (Blueprint $table) {
            $table->id();
            $table->string('app_name')->default('Absensi PKL');
            $table->string('app_icon')->default('assets/img/favicon.png');
            $table->integer('max_attendance_radius')->default(200);
            $table->double('default_latitude')->default(0);
            $table->double('default_longitude')->default(0);
            $table->time('check_in_start')->default('07:00');
            $table->time('check_in_end')->default('10:00');
            $table->time('check_out_start')->default('13:00');
            $table->time('check_out_end')->default('21:00');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('global_settings');
    }
};

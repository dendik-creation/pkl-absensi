<?php

use App\Http\Controllers\Global\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\StudentController as AdminStudent;
use App\Http\Controllers\Admin\WorkshopController as AdminWorkshop;
use App\Http\Controllers\Admin\SupervisorController as AdminSupervisor;
use App\Http\Controllers\Global\GlobalController;
use App\Http\Controllers\Student\DashboardController as StudentDashboard;
use App\Http\Controllers\Student\AttendanceController as StudentAttendance;
use App\Http\Controllers\Student\JournalController as StudentJournal;
use App\Http\Controllers\Student\WorkshopController as StudentWorkshop;

use App\Http\Controllers\Supervisor\DashboardController as SupervisorDashboard;
use App\Http\Controllers\Supervisor\StudentController as SupervisorStudent;
use App\Http\Controllers\Supervisor\WorkshopController as SupervisorWorkshop;

Route::get('/', [AuthController::class, 'SignedInStatus'])->name('login');
Route::prefix('auth')->group(function () {
    Route::get('/signin', function () {
        return Inertia::render('Auth/SignIn');
    })->name('auth.signin')->middleware('guest');

    Route::post('/signin', [AuthController::class, 'signIn'])->middleware('guest');
});

Route::middleware('auth')->group(function(){
    Route::post('auth/signout', [AuthController::class, 'signOut']);

    // Global Access
    Route::prefix('/profile')->controller(GlobalController::class)->group(function () {
        Route::get('/', [GlobalController::class, 'showProfile']);
        Route::put('/update', [GlobalController::class, 'updateProfile']);
        Route::get('/change-password', 'showChangePassword');
        Route::post('/change-password/check', 'checkPassword');
        Route::put('/change-password', 'updatePassword');
    });

    // Admin Access
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboard::class, 'index']);

        Route::prefix('/student')->controller(AdminStudent::class)->group(function () {
            Route::get('/', 'index');
            Route::get('/create', 'create');
            Route::get('/{id}', 'show');
            Route::get('/{id}/edit', 'edit');
            Route::post('/', 'store');
            Route::post('/import', 'import');
            Route::put('/{id}', 'update');
            Route::delete('/{id}', 'destroy');
        });

        Route::prefix('/workshop')->controller(AdminWorkshop::class)->group(function () {
            Route::get('/', 'index');
            Route::get('/create', 'create');
            Route::get('/{id}', 'show');
            Route::get('/{id}/edit', 'edit');
            Route::post('/', 'store');
            Route::post('/import', 'import');
            Route::put('/{id}', 'update');
            Route::delete('/{id}', 'destroy');
        });

        Route::prefix('/supervisor')->controller(AdminSupervisor::class)->group(function () {
            Route::get('/', 'index');
            Route::get('/create', 'create');
            Route::get('/{id}', 'show');
            Route::get('/{id}/edit', 'edit');
            Route::post('/', 'store');
            Route::post('/import', 'import');
            Route::put('/{id}', 'update');
            Route::delete('/{id}', 'destroy');
        });
    });

    // Student Access
    Route::prefix('student')->group(function () {
        Route::get('/dashboard', [StudentDashboard::class, 'index']);

        Route::prefix('/attendance')->controller(StudentAttendance::class)->group(function () {
            Route::get('/', 'index');
            Route::get('/create', 'create');
            Route::get('/{id}', 'show');
            Route::post('/', 'store');
        });

        Route::prefix('/journal')->controller(StudentJournal::class)->group(function () {
            Route::get('/', 'index');
            Route::get('/create', 'create');
            Route::get('/{id}', 'show');
            Route::get('/{id}/edit', 'edit');
            Route::post('/', 'store');
            Route::put('/{id}', 'update');
            Route::delete('/{id}', 'destroy');
        });

        Route::prefix('/workshop')->controller(StudentWorkshop::class)->group(function () {
            Route::get('/', 'index');
        });
    });

    // Supervisor Access
    Route::prefix('supervisor')->group(function () {
        Route::get('/dashboard', [SupervisorDashboard::class, 'index']);

        Route::prefix('/student')->controller(SupervisorStudent::class)->group(function () {
            Route::get('/', 'index');
            Route::get('/{id}', 'show');
        });

        Route::prefix('/workshop')->controller(SupervisorWorkshop::class)->group(function () {
            Route::get('/', 'index');
            Route::get('/{id}', 'show');
        });
    });
});

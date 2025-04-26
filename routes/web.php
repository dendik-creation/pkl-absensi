<?php

use App\Http\Controllers\Global\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\StudentController as AdminStudent;
use App\Http\Controllers\Admin\WorkshopController as AdminWorkshop;


Route::get('/', [AuthController::class, 'SignedInStatus'])->name('login');
Route::prefix('auth')->group(function () {
    Route::get('/signin', function () {
        return Inertia::render('Auth/SignIn');
    })->name('auth.signin')->middleware('guest');

    Route::post('/signin', [AuthController::class, 'signIn'])->middleware('guest');
});

Route::middleware('auth')->group(function(){
    Route::post('auth/signout', [AuthController::class, 'signOut']);

    // Admin Access
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboard::class, 'index']);

        Route::prefix('/student')->controller(AdminStudent::class)->group(function () {
            Route::get('/', 'index');
            Route::get('/create', 'create');
            Route::get('/{id}', 'show');
            Route::get('/{id}/edit', 'edit');
            Route::post('/', 'store');
            Route::put('/{id}', 'update');
            Route::delete('/{id}', 'destroy');
        });

        Route::prefix('/workshop')->controller(AdminWorkshop::class)->group(function () {
            Route::get('/', 'index');
            Route::get('/create', 'create');
            Route::get('/{id}', 'show');
            Route::get('/{id}/edit', 'edit');
            Route::post('/', 'store');
            Route::put('/{id}', 'update');
            Route::delete('/{id}', 'destroy');
        });
    });
});

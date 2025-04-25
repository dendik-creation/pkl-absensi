<?php

use App\Http\Controllers\Global\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\StudentController as AdminStudent;


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
    Route::prefix('admin')->group(function(){
        Route::get('/dashboard', [AdminDashboard::class, 'index']);
        Route::prefix('/student')->group(function(){
            Route::get('/', [AdminStudent::class, 'index']);
        });
    });
});

<?php

use App\Http\Controllers\Global\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AuthController::class, 'SignedInStatus'])->name('home');

Route::prefix('auth')->group(function () {
    Route::get('/signin', function () {
        return Inertia::render('Auth/SignIn');
    })->name('auth.signin')->middleware('guest');

    Route::post('/signin', [AuthController::class, 'signIn'])->middleware('guest');

});

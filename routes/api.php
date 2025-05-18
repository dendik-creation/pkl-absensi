<?php

use App\Http\Controllers\Global\NotificationController;
use App\Http\Controllers\Global\ReverseGmapsUrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/reverse-gmaps-url', [ReverseGmapsUrl::class, 'reverseGmapsUrl']);

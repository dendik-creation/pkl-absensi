<?php

namespace App\Http\Controllers\Global;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function SignedInStatus(){
        $auth = Auth::user();
        if(!$auth) return Inertia::location('auth/signin');

        // Redirect By Role
        $role = $auth->role;
        if($role == 'ADMIN') return Inertia::location('admin/dashboard');
        if($role == 'STUDENT') return Inertia::location('student/dashboard');
        if($role == 'SUPERVISOR') return Inertia::location('supervisor/dashboard');
    }

    public function signIn(Request $request){
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $credentials = [
            'username' => $request->input('username'),
            'password' => $request->input('password')
        ];

        $user = User::where('username', $credentials['username'])->first();
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'message' => 'Username atau password salah'
            ]);
        }

        if (Auth::attempt($credentials)) {
            return Inertia::location('/');
        }

        return back()->withErrors([
            'message' => 'Authentication failed'
        ]);
    }

    public function signOut(){
        Auth::logout();
        return Inertia::location('/auth/signin');
    }
}

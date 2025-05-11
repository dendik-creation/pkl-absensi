<?php

namespace App\Http\Controllers\Global;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class GlobalController extends Controller
{
    public function showProfile()
    {
        $auth_id = Auth::user()->id;
        if (!$auth_id) {
            return redirect('/');
        }
        $user = User::with(['student', 'supervisor'])->findOrFail($auth_id);
        return inertia('Global/Profile', [
            'title' => 'Profil Anda',
            'user' => $user,
        ]);
    }

    private function updateAdminProfile(Request $request)
    {
        $validated = $request->validate(
            [
                'username' => 'required|string|max:255',
                'email' => 'nullable|string|email|max:255',
            ],
            [
                'username.required' => 'Nama tidak boleh kosong',
                'email.email' => 'Format email tidak valid',
            ],
        );

        $user = User::findOrFail(Auth::user()->id);
        if (!$user) {
            return back()->withErrors([
                'message' => 'User tidak ditemukan',
            ]);
        }
        $user->update([
            'username' => $validated['username'],
            'email' => $validated['email'] ?? $user->email,
        ]);
        return back()->with('success', 'Profil berhasil diperbarui');
    }

    public function updateProfile(Request $request)
    {
        $user_role = Auth::user()->role;
        switch ($user_role) {
            case 'ADMIN':
                $this->updateAdminProfile($request);
                break;
            // case "STUDENT" :
            //     $this->updateStudentProfile($request);
            //     break;
            // case "SUPERVISOR" :
            //     $this->updateSupervisorProfile($request);
            //     break;
            default:
                return back()->withErrors([
                    'message' => 'Role tidak ditemukan',
                ]);
        }
    }

    public function showChangePassword()
    {
        return inertia('Global/ChangePassword/Base', [
            'title' => 'Ubah Password',
        ]);
    }

    public function checkPassword(Request $request)
    {
        $validated = $request->validate(
            [
                'current_password' => 'required|string',
            ],
            [
                'current_password.required' => 'Password sekarang tidak boleh kosong',
            ],
        );
        $user = User::findOrFail(Auth::user()->id);
        if (!$user) {
            return back()->withErrors([
                'message' => 'User tidak ditemukan',
            ]);
        }
        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors([
                'current_password' => 'Password sekarang tidak sesuai',
            ]);
        }
        return back()->with('success', 'Password sekarang sesuai');
    }

    public function updatePassword(Request $request){
        $request->validate([
            'new_password' => 'required|string|min:8',
            'confirm_password' => 'required|string|min:8',
        ], [
            'new_password.required' => 'Password baru tidak boleh kosong',
            'new_password.min' => 'Password baru minimal 8 karakter',
            'confirm_password.required' => 'Konfirmasi password tidak boleh kosong',
            'confirm_password.min' => 'Konfirmasi password minimal 8 karakter',
        ]);
        $user = User::findOrFail(Auth::user()->id);
        if (!$user) {
            return back()->withErrors([
                'message' => 'User tidak ditemukan',
            ]);
        }
        if ($request->input('new_password') !== $request->input('confirm_password')) {
            return back()->withErrors([
                'confirm_password' => 'Konfirmasi password tidak sesuai',
            ]);
        }
        $user->update([
            'password' => Hash::make($request->input('new_password')),
        ]);
        return back()->with('success', 'Password berhasil diperbarui. Bersiap logout');
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Notifications\ResetPasswordNotification;
use App\Models\User;

class ForgotPasswordController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function showLinkRequestForm()
    {
        return view('components.auth.forgot-password');
    }

    /**
     * Handle an incoming password reset link request.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Email harus diisi',
            'email.email' => 'Format email tidak valid',
        ]);

        // Check if email exists
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'errors' => [
                    'email' => ['Email tidak terdaftar dalam sistem']
                ]
            ], 422);
        }

        // **FORCE PAKAI CUSTOM NOTIFICATION**
        // Generate token manually
        $token = Password::getRepository()->create($user);
        
        // Send custom notification
        $user->notify(new ResetPasswordNotification($token));

        return response()->json([
            'success' => true,
            'message' => 'Link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam.'
        ]);
    }
}
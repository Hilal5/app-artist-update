<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            // Cari user by Google ID atau Email
            $user = User::where('google_id', $googleUser->getId())
                       ->orWhere('email', $googleUser->getEmail())
                       ->first();
            
            if ($user) {
                // Update Google data jika belum ada
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                    ]);
                }
                
                Auth::login($user);
            } else {
                // Buat user baru
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'role' => 'client',
                    'password' => null,
                ]);
                
                Auth::login($user);
            }
            
            return redirect('/')->with('success', 'Login successful!');
            
        } catch (\Exception $e) {
            return redirect('/')->with('error', 'Failed to login with Google. Please try again.');
        }
    }
}
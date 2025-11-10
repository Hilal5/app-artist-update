<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\SiteSetting;

class ProfileController extends Controller
{
    public function uploadPhoto(Request $request)
{
    // Cek admin
    if (!Auth::check() || !Auth::user()->isAdmin()) {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
    }

    $request->validate([
        'profile_photo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:20096'
    ]);

    try {
        if ($request->hasFile('profile_photo')) {
            $file = $request->file('profile_photo');
            $filename = 'profile-' . time() . '.' . $file->getClientOriginalExtension();
            
            // Simpan file ke storage
            $path = $file->storeAs('profile', $filename, 'public');
            
            // ✅ 1. Simpan ke SiteSetting untuk profile global
            SiteSetting::updateOrCreate(
                ['key' => 'profile_photo'],
                ['value' => $filename]
            );

            // ✅ 2. Juga update profile_photo user admin yang sedang login
            $user = Auth::user();
            $user->profile_photo = $filename;
            $user->save(); // ✅ PASTIKAN INI ADA

            return response()->json([
                'success' => true,
                'photo_url' => asset('storage/profile/' . $filename) . '?t=' . time(),
                'message' => 'Profile photo updated successfully'
            ]);
        }

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error uploading photo: ' . $e->getMessage()
        ], 500);
    }
}

    // Function untuk get current profile photo (GLOBAL)
    public function getProfilePhoto()
    {
        $photoName = SiteSetting::getValue('profile_photo', 'default-avatar.png');
        $photoUrl = asset('storage/profile/' . $photoName);
            
        return response()->json(['photo_url' => $photoUrl]);
    }

    // Function untuk get profile photo URL (public accessible)
    public static function getProfilePhotoUrl()
    {
        $photoName = SiteSetting::getValue('profile_photo', 'default-avatar.png');
        return asset('storage/profile/' . $photoName);
    }
}
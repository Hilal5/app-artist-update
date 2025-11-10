<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'role',
        'profile_photo',
        'last_seen',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_seen' => 'datetime', // ✅ GABUNG SEMUA CASTS DI SINI
    ];

    // Relationships
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    // Helper methods
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isClient(): bool
    {
        return $this->role === 'client';
    }

public function getAvatarUrl()
{
    // Jika user punya profile_photo
    if ($this->profile_photo) {
        // ✅ Gunakan Storage facade untuk cek existence
        if (Storage::disk('public')->exists('profile/' . $this->profile_photo)) {
            // ✅ Tambah cache busting parameter
            return asset('storage/profile/' . $this->profile_photo) . '?v=' . time();
        }
        // ❌ JANGAN reset profile_photo di sini
    }
    
    // Fallback ke default avatar dengan cache busting
    return asset('images/profile/default-avatar.png') . '?v=' . time();
}

    public function canLeaveReview(): bool
    {
        if ($this->isAdmin()) {
            return false;
        }

        $hasCompletedOrder = $this->orders()
            ->where('status', 'completed')
            ->exists();

        if (!$hasCompletedOrder) {
            return false;
        }

        return !$this->hasReviewed();
    }

    public function hasReviewed(): bool
    {
        return $this->reviews()
                    ->where('is_approved', true)
                    ->exists();
    }

    public function getCompletedOrdersCount(): int
    {
        return $this->orders()->where('status', 'completed')->count();
    }

    public function getReviewableOrders()
    {
        return $this->orders()
            ->where('status', 'completed')
            ->where('can_review', true)
            ->whereDoesntHave('review')
            ->get();
    }

    public function isOnline()
    {
        return $this->last_seen && $this->last_seen->gt(now()->subMinutes(1));
    }

    /**
     * Send the password reset notification.
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
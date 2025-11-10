<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $appends = ['time_ago'];
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'rating',
        'comment',
        'commission_type',
        'images',
        'badges',        // ✅ TAMBAH INI
        'verified',
        'is_approved',
    ];

    protected $casts = [
        'rating' => 'integer',
        'images' => 'array',
        'badges' => 'array',  // ✅ TAMBAH INI
        'verified' => 'boolean',
        'is_approved' => 'boolean',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    public function scopeWithImages($query)
    {
        return $query->whereNotNull('images')
                     ->where('images', '!=', '[]');
    }

    // Accessor
    public function getTimeAgoAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }
    
    // ✅ TAMBAH: Helper method untuk badge configuration
    public static function getBadgeOptions()
    {
        return [
            'positive' => [
                ['id' => 'good_communication', 'label' => '💬 Good Communication', 'icon' => 'message-circle'],
                ['id' => 'professional', 'label' => '👔 Professional', 'icon' => 'briefcase'],
                ['id' => 'fast_delivery', 'label' => '⚡ Fast Delivery', 'icon' => 'zap'],
                ['id' => 'great_quality', 'label' => '⭐ Great Quality', 'icon' => 'award'],
                ['id' => 'creative', 'label' => '🎨 Very Creative', 'icon' => 'palette'],
                ['id' => 'friendly', 'label' => '😊 Friendly Service', 'icon' => 'smile'],
                ['id' => 'responsive', 'label' => '📱 Responsive', 'icon' => 'message-square'],
                ['id' => 'detail_oriented', 'label' => '🔍 Detail Oriented', 'icon' => 'eye'],
            ],
            'negative' => [
                ['id' => 'poor_communication', 'label' => '💭 Poor Communication', 'icon' => 'message-circle'],
                ['id' => 'slow_delivery', 'label' => '🐌 Slow Delivery', 'icon' => 'clock'],
                ['id' => 'low_quality', 'label' => '📉 Low Quality', 'icon' => 'trending-down'],
                ['id' => 'not_creative', 'label' => '😐 Not Creative', 'icon' => 'frown'],
                ['id' => 'unprofessional', 'label' => '❌ Unprofessional', 'icon' => 'x-circle'],
                ['id' => 'unresponsive', 'label' => '📵 Unresponsive', 'icon' => 'phone-off'],
            ]
        ];
    }
}
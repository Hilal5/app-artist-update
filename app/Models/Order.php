<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'commission_id',
        'order_number',
        'price',
        'details',
        'payment_method',
        'payment_proof',
        'status',
        'can_review',
        'admin_notes',
        'completed_at',
    ];

    protected $casts = [
        'price' => 'integer',
        'can_review' => 'boolean',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function commission(): BelongsTo
    {
        return $this->belongsTo(Commission::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    // Helper methods
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function canBeReviewed(): bool
    {
        return $this->isCompleted() && $this->can_review && !$this->review;
    }

    // Auto-generate order number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (!$order->order_number) {
                $order->order_number = 'ORD-' . strtoupper(uniqid());
            }
        });

        // When order completed, allow review
        static::updating(function ($order) {
            if ($order->isDirty('status') && $order->status === 'completed') {
                $order->can_review = true;
                $order->completed_at = now();
            }
        });
    }
}
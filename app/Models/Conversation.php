<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'admin_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id');
    }

    // Get unread count
    public function unreadCount($userId)
    {
        return Message::where('receiver_id', $userId)
            ->where(function($query) {
                $query->where('sender_id', $this->user_id)
                      ->orWhere('sender_id', $this->admin_id);
            })
            ->where('is_read', false)
            ->count();
    }
}
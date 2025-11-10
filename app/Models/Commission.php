<?php
// app/Models/Commission.php ← NAMA FILE SINGULAR

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model // ← CLASS NAME SINGULAR
{
    use HasFactory;

    // Laravel otomatis tahu table name = 'commissions' (plural)
    // Tapi kalau nama table berbeda, bisa set manual:
    // protected $table = 'commissions';

    protected $fillable = [
        'name',
        'description',
        'price',
        'delivery_time',
        'slots_available',
        'images',
        'is_active',
    ];

    protected $casts = [
        'price' => 'integer',
        'slots_available' => 'integer',
        'is_active' => 'boolean',
        'images' => 'array',
    ];

    // Relationship dengan Message (untuk chat)
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommissionSetting extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'value'];
    
    protected $table = 'commission_settings';
    
    public $timestamps = true;
}
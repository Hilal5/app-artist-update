<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description', 
        'category',
        'client_name',
        'images',
        'videos',
    ];

    protected $casts = [
        'images' => 'array',
        'videos' => 'array',
    ];

    public function getImagesAttribute($value)
    {
        if (is_array($value)) return $value;
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return $decoded ?? [];
        }
        return [];
    }
    
    public function getVideosAttribute($value)
    {
        if (is_array($value)) return $value;
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return $decoded ?? [];
        }
        return [];
    }
    
    // ✅ GET ALL MEDIA (images + videos combined)
    public function getAllMediaAttribute()
    {
        $media = [];
        
        foreach ($this->images as $image) {
            $media[] = [
                'type' => 'image',
                'url' => asset('storage/works/' . $image),
                'name' => $image
            ];
        }
        
        foreach ($this->videos as $video) {
            $media[] = [
                'type' => 'video',
                'url' => asset('storage/works/' . $video),
                'name' => $video
            ];
        }
        
        return $media;
    }
    
    // ✅ GET FIRST MEDIA (for thumbnail)
    public function getFirstMediaAttribute()
    {
        if (!empty($this->images)) {
            return [
                'type' => 'image',
                'url' => asset('storage/works/' . $this->images[0])
            ];
        } elseif (!empty($this->videos)) {
            return [
                'type' => 'video',
                'url' => asset('storage/works/' . $this->videos[0])
            ];
        }
        
        return null;
    }
}
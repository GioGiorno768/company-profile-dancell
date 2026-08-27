<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'badge_text',
        'header_title',
        'header_subtitle',
        'global_tags',
    ];

    protected $casts = [
        'global_tags' => 'array',
    ];
}

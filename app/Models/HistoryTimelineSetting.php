<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoryTimelineSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'header_badge',
        'header_title',
        'header_description',
        'expansions',
        'milestones',
    ];

    protected $casts = [
        'expansions' => 'array',
        'milestones' => 'array',
    ];
}

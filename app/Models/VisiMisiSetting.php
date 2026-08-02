<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisiMisiSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'header_badge',
        'header_title',
        'header_description',
        'visi_badge',
        'visi_badge_icon_svg',
        'visi_title',
        'visi_pillar_1_text',
        'visi_pillar_1_icon_svg',
        'visi_pillar_2_text',
        'visi_pillar_2_icon_svg',
        'visi_pillar_3_text',
        'visi_pillar_3_icon_svg',
        'misi_items',
    ];

    protected $casts = [
        'misi_items' => 'array',
    ];
}

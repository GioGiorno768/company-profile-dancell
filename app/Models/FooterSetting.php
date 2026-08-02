<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FooterSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_name',
        'brand_tag',
        'brand_subtitle',
        'brand_description',
        'branch_badge_text',
        'office_title',
        'office_address',
        'office_hours',
        'office_established',
        'value_box_title',
        'value_box_heading',
        'value_box_description',
        'copyright_text',
        'nav_links',
        'bottom_links',
    ];

    protected $casts = [
        'nav_links' => 'array',
        'bottom_links' => 'array',
    ];
}

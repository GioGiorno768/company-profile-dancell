<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerBrandSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'header_badge',
        'header_title',
        'header_description',
        'stat_1_val',
        'stat_1_label',
        'stat_2_val',
        'stat_2_label',
        'stat_3_val',
        'stat_3_label',
        'stat_4_val',
        'stat_4_label',
        'smartphone_brands',
        'accessory_brands',
        'footer_note',
        'cta_btn_text',
        'cta_btn_link',
    ];

    protected $casts = [
        'smartphone_brands' => 'array',
        'accessory_brands' => 'array',
    ];
}

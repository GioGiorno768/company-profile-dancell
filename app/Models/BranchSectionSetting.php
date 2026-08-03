<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BranchSectionSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'header_badge',
        'header_title',
        'header_description',
        'banner_title',
        'banner_description',
        'cta_btn_text',
        'cta_btn_link',
    ];
}

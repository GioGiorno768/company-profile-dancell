<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'site_title',
        'site_name',
        'meta_description',
        'meta_keywords',
        'author',
        'locale',
        'canonical_url',
        'og_title',
        'og_description',
        'og_image',
        'og_image_alt',
        'og_type',
        'twitter_card',
        'twitter_site',
        'twitter_creator',
        'robots',
        'google_site_verification',
        'bing_site_verification',
        'yandex_site_verification',
        'facebook_app_id',
        'facebook_page_url',
        'instagram_account_url',
        'tiktok_profile_url',
        'whatsapp_cs_url',
        'geo_region',
        'geo_placename',
        'geo_position',
        'structured_data_json',
    ];
}

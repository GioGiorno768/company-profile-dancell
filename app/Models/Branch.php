<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'city',
        'area',
        'year',
        'is_hq',
        'address',
        'phone',
        'whatsapp',
        'google_maps_url',
        'opening_hours',
        'image',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_hq'     => 'boolean',
        'is_active' => 'boolean',
        'order'     => 'integer',
    ];
}

<?php

namespace Database\Seeders;

use App\Models\HeroSetting;
use Illuminate\Database\Seeder;

class HeroSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HeroSetting::firstOrCreate(
            ['id' => 1],
            [
                'badge_text' => 'Pusat Ritel Gadget, Laptop & Aksesori — 56 Outlet Jawa Timur',
                'badge_icon_svg' => null,
                'title' => 'Pusat Ritel Gadget & Laptop, Terlengkap & Bergaransi Resmi',
                'description' => 'Dancell (Dan Group) adalah jaringan ritel gadget, smartphone, laptop, hingga aksesori terlengkap di Jawa Timur. Berdiri sejak 2008, kini siap melayani Anda di 56 outlet resmi dengan jaminan 100% original, garansi resmi, dan tukar tambah tepercaya.',
                'primary_btn_text' => 'Temukan Outlet Terdekat',
                'primary_btn_link' => '#branches',
                'primary_btn_icon_svg' => null,
                'secondary_btn_text' => 'Katalog Produk & Brand',
                'secondary_btn_link' => '#products',
                'secondary_btn_icon_svg' => null,
                'feature_1_text' => '100% Garansi Resmi',
                'feature_1_icon_svg' => null,
                'feature_2_text' => 'Gadget, Laptop & Aksesori',
                'feature_2_icon_svg' => null,
                'feature_3_text' => '56 Outlet Jawa Timur',
                'feature_3_icon_svg' => null,
            ]
        );
    }
}

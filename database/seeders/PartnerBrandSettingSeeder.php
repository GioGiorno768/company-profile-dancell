<?php

namespace Database\Seeders;

use App\Models\PartnerBrandSetting;
use Illuminate\Database\Seeder;

class PartnerBrandSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PartnerBrandSetting::updateOrCreate(
            ['id' => 1],
            [
                'header_badge' => 'Mitra Resmi Brand Dunia',
                'header_title' => 'Official Brand Partner & Distributor Ritel',
                'header_description' => 'Dancell bekerja sama langsung dengan produsen smartphone dan aksesori teknologi terkemuka dunia untuk menjamin keaslian 100% & garansi resmi di 56 cabang.',
                'stat_1_val' => '15+',
                'stat_1_label' => 'Brand Global Resmi',
                'stat_2_val' => '100%',
                'stat_2_label' => 'Produk Original',
                'stat_3_val' => '56',
                'stat_3_label' => 'Outlet Ritel Aktif',
                'stat_4_val' => 'Garansi',
                'stat_4_label' => 'Resmi Indonesia',
                'smartphone_brands' => [
                    ['name' => 'Apple', 'icon' => 'simple-icons:apple', 'tag' => 'Official Partner', 'desc' => 'iPhone, iPad & Mac ecosystem'],
                    ['name' => 'Samsung', 'icon' => 'simple-icons:samsung', 'tag' => 'Official SEIN', 'desc' => 'Galaxy S, Z Fold & A Series'],
                    ['name' => 'Xiaomi', 'icon' => 'simple-icons:xiaomi', 'tag' => 'Garansi Resmi TAM', 'desc' => 'Xiaomi, Redmi & POCO'],
                    ['name' => 'OPPO', 'icon' => 'simple-icons:oppo', 'tag' => 'Official Partner', 'desc' => 'Find, Reno & A Series'],
                    ['name' => 'Vivo', 'icon' => 'simple-icons:vivo', 'tag' => 'Official Partner', 'desc' => 'X Series & V Series'],
                    ['name' => 'Realme', 'icon' => 'simple-icons:realme', 'tag' => 'Official Partner', 'desc' => 'GT Series & Number Series'],
                    ['name' => 'ASUS', 'icon' => 'simple-icons:asus', 'tag' => 'ROG Partner', 'desc' => 'ROG Phone & Zenfone'],
                    ['name' => 'Google', 'icon' => 'simple-icons:google', 'tag' => 'Pixel Ecosystem', 'desc' => 'Google Pixel & Nest'],
                ],
                'accessory_brands' => [
                    ['name' => 'Sony', 'icon' => 'simple-icons:sony', 'tag' => 'Official Audio', 'desc' => 'WH-1000XM & WF Series'],
                    ['name' => 'JBL', 'icon' => 'simple-icons:jbl', 'tag' => 'Official Audio', 'desc' => 'Flip, Charge & Wave TWS'],
                    ['name' => 'Anker', 'icon' => 'simple-icons:anker', 'tag' => 'Official Accessories', 'desc' => 'GaN Prime Charger & Powerbank'],
                    ['name' => 'SanDisk', 'icon' => 'simple-icons:sandisk', 'tag' => 'Official Storage', 'desc' => 'Ultra MicroSD & Flash Drive'],
                    ['name' => 'Lenovo', 'icon' => 'simple-icons:lenovo', 'tag' => 'Official Partner', 'desc' => 'Tab & IdeaPad Series'],
                    ['name' => 'Motorola', 'icon' => 'simple-icons:motorola', 'tag' => 'Official Partner', 'desc' => 'Moto Razr & Edge'],
                    ['name' => 'Marshall', 'icon' => 'simple-icons:marshall', 'tag' => 'Official Audio', 'desc' => 'Emberton & Major Headphones'],
                    ['name' => 'Nokia', 'icon' => 'simple-icons:nokia', 'tag' => 'Official Partner', 'desc' => 'Nokia Tough & Smart Series'],
                ],
                'footer_note' => 'Seluruh produk brand di atas bergaransi resmi & tersedia di 56 outlet Dancell Jawa Timur.',
                'cta_btn_text' => 'Temukan Outlet Terdekat',
                'cta_btn_link' => '#branches',
            ]
        );
    }
}

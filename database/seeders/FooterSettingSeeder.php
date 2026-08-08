<?php

namespace Database\Seeders;

use App\Models\FooterSetting;
use Illuminate\Database\Seeder;

class FooterSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FooterSetting::updateOrCreate(
            ['id' => 1],
            [
                'brand_name' => 'DANCELL',
                'brand_tag' => 'Group',
                'brand_subtitle' => 'Dan Group Official Company Profile 2025/2026',
                'brand_description' => 'Dancell adalah perusahaan ritel terpercaya yang pertama kali berdiri pada tahun 2008 di Warujayeng, Nganjuk. Hingga kini memiliki 58 cabang aktif di seluruh wilayah Jawa Timur.',
                'branch_badge_text' => '58 Cabang Siap Melayani Pelanggan',
                'office_title' => 'Kantor Pusat',
                'office_address' => 'Warujayeng, Kec. Tanjunganom, Kab. Nganjuk, Jawa Timur',
                'office_hours' => 'Senin - Minggu (08:00 - 21:00 WIB)',
                'office_established' => 'Berdiri Sejak Tahun 2008',
                'value_box_title' => 'Nilai Utama',
                'value_box_heading' => 'Kesejahteraan Bersama',
                'value_box_description' => 'Mengedepankan kualitas pelayanan dan kebermanfaatan bagi masyarakat, karyawan, serta relasi bisnis.',
                'copyright_text' => '© 2008 - 2026 Dancell (Dan Group). All rights reserved.',
                'nav_links' => [
                    ['label' => 'Tentang Dancell', 'href' => '#about'],
                    ['label' => 'Visi & Misi', 'href' => '#visimisi'],
                    ['label' => 'Sejarah 58 Cabang', 'href' => '#history'],
                    ['label' => 'Produk & Aksesori', 'href' => '#products'],
                    ['label' => 'Lokasi Outlet Ritel', 'href' => '#branches'],
                ],
                'bottom_links' => [
                    ['label' => 'Syarat & Ketentuan', 'href' => '#'],
                    ['label' => 'Kebijakan Privasi', 'href' => '#'],
                    ['label' => 'Karir Dancell', 'href' => '#'],
                ],
            ]
        );
    }
}

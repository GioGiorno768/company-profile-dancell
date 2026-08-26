<?php

namespace Database\Seeders;

use App\Models\HistoryTimelineSetting;
use Illuminate\Database\Seeder;

class HistoryTimelineSettingSeeder extends Seeder
{
    /**
     * Run the database seeds with cohesive matched history & expansion milestones.
     */
    public function run(): void
    {
        $milestones = [
            [
                'id' => 'ms-2008',
                'year' => '2008',
                'title' => 'Kelahiran Toko Pertama di Warujayeng',
                'subtitle' => 'Awal Mula Perjalanan Ritel Gadget Terpercaya',
                'desc' => 'Dancell pertama kali didirikan di Warujayeng, Nganjuk. Dimulai dari toko ritel sederhana dengan satu visi utama: menyediakan ponsel original dengan harga jujur serta pelayanan yang ramah dan bersahaja kepada masyarakat.',
                'stat_badge' => 'Toko Pertama',
                'stat_label' => 'Warujayeng, Nganjuk',
                'highlight_tag' => '100% Produk Original',
                'image' => '/images/hero.webp',
                'current' => false,
            ],
            [
                'id' => 'ms-2015',
                'year' => '2012 - 2015',
                'title' => 'Pembukaan Dancell 2 & Penguatan Fondasi',
                'subtitle' => 'Ekspansi Tahap Awal & Standar Layanan Unggul',
                'desc' => 'Tingginya antusiasme dan kepercayaan pelanggan mendorong pembukaan cabang Dancell 2. Kapasitas tim diperkuat melalui standarisasi pelayanan terstruktur, penyediaan garansi resmi, dan komitmen purnajual prima.',
                'stat_badge' => 'Dancell 2',
                'stat_label' => 'Cabang Kedua Dibuka',
                'highlight_tag' => 'Standar Operasional Ritel',
                'image' => '/images/smartphone_hero.png',
                'current' => false,
            ],
            [
                'id' => 'ms-2018',
                'year' => '2018',
                'title' => 'Era Transformasi & Standarisasi Modern',
                'subtitle' => 'Penerapan Sistem Digital & Seragam Profesional',
                'desc' => 'Dancell berevolusi menerapkan tata kelola toko ritel modern dengan seragam profesional khas Dancell, standarisasi tata letak toko yang nyaman, serta integrasi teknologi stok untuk menyambut lonjakan tren smartphone di Jawa Timur.',
                'stat_badge' => 'Ritel Modern',
                'stat_label' => 'Sistem Manajemen Digital',
                'highlight_tag' => 'Standar Pelayanan Konsisten',
                'image' => '/images/hero.webp',
                'current' => false,
            ],
            [
                'id' => 'ms-2022',
                'year' => '2020 - 2022',
                'title' => 'Ekspansi Masif Kediri Raya & Mataraman',
                'subtitle' => 'Menembus 34 Outlet di Berbagai Wilayah Strategis',
                'desc' => 'Strategi ekspansi multi-cabang terstruktur menjangkau Kediri, Mojoroto, Srengat Blitar, hingga Magetan. Dancell resmi menjadi rujukan utama masyarakat dengan ketersediaan produk brand global terlengkap.',
                'stat_badge' => '34 Cabang',
                'stat_label' => 'Kediri, Blitar, Magetan',
                'highlight_tag' => 'Apple, Samsung, Xiaomi, Oppo, Vivo',
                'image' => '/images/smartphone_hero.png',
                'current' => false,
            ],
            [
                'id' => 'ms-2025',
                'year' => '2023 - 2025',
                'title' => 'Penetrasi Jaringan Menyeluruh Jawa Timur',
                'subtitle' => 'Jangkauan Menembus 53 Outlet Aktif',
                'desc' => 'Dancell memperluas penetrasi ke kawasan Uteran, Mojosari, Jombang, hingga Sidoarjo. Penguatan rantai pasok dan sinergi promosi digital menjadikan Dancell destinasi belanja gadget nomor satu di Jawa Timur.',
                'stat_badge' => '53 Cabang',
                'stat_label' => 'Jangkauan Luas Jawa Timur',
                'highlight_tag' => 'Ready Stock Semua Tipe',
                'image' => '/images/hero.webp',
                'current' => false,
            ],
            [
                'id' => 'ms-2026',
                'year' => '2026',
                'title' => '58 Outlet Aktif — Pemimpin Ritel Jatim',
                'subtitle' => 'Jaringan Outlet Gadget Terbesar di Jawa Timur',
                'desc' => 'Kondisi terkini dengan 58 outlet aktif yang tersebar di Nganjuk, Kediri, Blitar, Jombang, Mojokerto, Sidoarjo, dan sekitarnya. Terus melangkah maju memberikan pengalaman belanja gadget terbaik bergaransi resmi.',
                'stat_badge' => '58 Outlet Aktif',
                'stat_label' => 'Kondisi Terkini di Jawa Timur',
                'highlight_tag' => 'Garansi Resmi Indonesia',
                'image' => '/images/hero.webp',
                'current' => true,
            ],
        ];

        HistoryTimelineSetting::updateOrCreate(
            ['id' => 1],
            [
                'header_badge' => 'Perjalanan & Rekam Jejak',
                'header_title' => 'Sejarah Pertumbuhan Dancell',
                'header_description' => 'Dari toko pertama di Warujayeng pada tahun 2008, bertransformasi menjadi jaringan ritel 58 cabang terdepan di Jawa Timur.',
                'milestones' => $milestones,
                'expansions' => [],
            ]
        );
    }
}

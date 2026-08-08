<?php

namespace Database\Seeders;

use App\Models\HistoryTimelineSetting;
use Illuminate\Database\Seeder;

class HistoryTimelineSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HistoryTimelineSetting::updateOrCreate(
            ['id' => 1],
            [
                'header_badge' => 'Perjalanan & Rekam Jejak',
                'header_title' => 'Sejarah Pertumbuhan Dancell',
                'header_description' => 'Dari toko pertama di Warujayeng pada tahun 2008, bertransformasi menjadi jaringan ritel 58 cabang terdepan di Jawa Timur.',
                'expansions' => [
                    [
                        'id' => 'exp-2020',
                        'year' => '2020',
                        'count' => 14,
                        'added' => '14 Cabang',
                        'highlight' => 'Dancell 2020 – Mojoroto',
                        'desc' => 'Awal ekspansi multi-cabang terstruktur di area Kediri & Mojoroto.',
                        'current' => false,
                    ],
                    [
                        'id' => 'exp-2021',
                        'year' => '2021',
                        'count' => 25,
                        'added' => '+11 Cabang',
                        'highlight' => 'Dancell 2021 – Srengat',
                        'desc' => 'Pertumbuhan pesat merambah area Blitar & Srengat.',
                        'current' => false,
                    ],
                    [
                        'id' => 'exp-2022',
                        'year' => '2022',
                        'count' => 34,
                        'added' => '+9 Cabang',
                        'highlight' => 'Dancell 2022 – Magetan',
                        'desc' => 'Melebarkan jaringan ritel ke wilayah Barat Jawa Timur (Magetan).',
                        'current' => false,
                    ],
                    [
                        'id' => 'exp-2023',
                        'year' => '2023',
                        'count' => 41,
                        'added' => '+7 Cabang',
                        'highlight' => 'Dancell 2023 – Semen',
                        'desc' => 'Tersebar kokoh hampir di seluruh wilayah strategis Jawa Timur.',
                        'current' => false,
                    ],
                    [
                        'id' => 'exp-2024',
                        'year' => '2024',
                        'count' => 48,
                        'added' => '+7 Cabang',
                        'highlight' => 'Dancell 2024 – Uteran',
                        'desc' => 'Memperkuat jaringan outlet di kawasan Uteran dan sekitarnya.',
                        'current' => false,
                    ],
                    [
                        'id' => 'exp-2025',
                        'year' => '2025',
                        'count' => 53,
                        'added' => '+5 Cabang',
                        'highlight' => 'Dancell 2025 – Mojosari',
                        'desc' => 'Penambahan cabang berlanjut secara masif di Mojosari.',
                        'current' => false,
                    ],
                    [
                        'id' => 'exp-2026',
                        'year' => '2026',
                        'count' => 58,
                        'added' => '+5 Cabang',
                        'highlight' => '58 Cabang Terkini',
                        'desc' => 'Kondisi terkini 58 outlet aktif siap melayani pelanggan Jawa Timur.',
                        'current' => true,
                    ],
                ],
                'milestones' => [
                    [
                        'id' => 'ms-2008',
                        'year' => '2008',
                        'title' => 'Berdiri Pertama Kali',
                        'desc' => 'Dancell pertama kali berdiri di Warujayeng, Nganjuk.',
                        'icon_svg' => '',
                    ],
                    [
                        'id' => 'ms-2012',
                        'year' => '2012',
                        'title' => 'Awal Perjalanan Toko',
                        'desc' => 'Perjalanan awal toko dengan pembentukan tim kecil yang solid.',
                        'icon_svg' => '',
                    ],
                    [
                        'id' => 'ms-2013',
                        'year' => '2013',
                        'title' => 'Pengembangan Layanan',
                        'desc' => 'Pengembangan kapasitas tim dan standar pelayanan ritel.',
                        'icon_svg' => '',
                    ],
                    [
                        'id' => 'ms-2015',
                        'year' => '2015',
                        'title' => 'Pembukaan Dancell 2',
                        'desc' => 'Pembukaan outlet Dancell 2, tim operasional mulai membesar.',
                        'icon_svg' => '',
                    ],
                    [
                        'id' => 'ms-2017',
                        'year' => '2017',
                        'title' => 'Budaya Kerja Solid',
                        'desc' => 'Pematangan suasana kerja yang semakin terstruktur dan kompak.',
                        'icon_svg' => '',
                    ],
                    [
                        'id' => 'ms-2018',
                        'year' => '2018',
                        'title' => 'Pertumbuhan Pesat',
                        'desc' => 'Tim besar dengan seragam khas, menandai era pertumbuhan cepat.',
                        'icon_svg' => '',
                    ],
                ],
            ]
        );
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HistoryTimelineSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HistoryTimelineSettingController extends Controller
{
    /**
     * Show the History & Timeline settings form.
     */
    public function edit(): Response
    {
        $historyTimeline = HistoryTimelineSetting::firstOrCreate(['id' => 1], [
            'header_badge' => 'Perjalanan & Rekam Jejak',
            'header_title' => 'Sejarah Pertumbuhan Dancell',
            'header_description' => 'Dari toko pertama di Warujayeng pada tahun 2008, bertransformasi menjadi jaringan ritel 56 cabang terdepan di Jawa Timur.',
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
                    'count' => 56,
                    'added' => '+3 Cabang',
                    'highlight' => '56 Cabang Terkini',
                    'desc' => 'Kondisi terkini 56 outlet aktif siap melayani pelanggan Jawa Timur.',
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
        ]);

        return Inertia::render('Admin/Content/HistoryTimelineSetting', [
            'historyTimeline' => $historyTimeline,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the History & Timeline settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'header_badge' => 'nullable|string|max:255',
            'header_title' => 'nullable|string|max:255',
            'header_description' => 'nullable|string',
            'expansions' => 'nullable|array',
            'expansions.*.id' => 'required|string',
            'expansions.*.year' => 'nullable|string|max:50',
            'expansions.*.count' => 'nullable|numeric',
            'expansions.*.added' => 'nullable|string|max:100',
            'expansions.*.highlight' => 'nullable|string|max:255',
            'expansions.*.desc' => 'nullable|string',
            'expansions.*.current' => 'boolean',
            'milestones' => 'nullable|array',
            'milestones.*.id' => 'required|string',
            'milestones.*.year' => 'nullable|string|max:50',
            'milestones.*.title' => 'nullable|string|max:255',
            'milestones.*.desc' => 'nullable|string',
            'milestones.*.icon_svg' => 'nullable|string',
        ]);

        $historyTimeline = HistoryTimelineSetting::firstOrCreate(['id' => 1]);
        $historyTimeline->update($validated);

        // Invalidate Redis Cache
        Cache::forget('history_timeline_setting_content');

        return redirect()->back()->with('status', 'Konten Sejarah & Timeline berhasil diperbarui!');
    }
}

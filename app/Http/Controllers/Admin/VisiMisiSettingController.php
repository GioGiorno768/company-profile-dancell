<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VisiMisiSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class VisiMisiSettingController extends Controller
{
    /**
     * Show the Visi & Misi settings form.
     */
    public function edit(): Response
    {
        $visiMisi = VisiMisiSetting::firstOrCreate(['id' => 1], [
            'header_badge' => 'Komitmen & Landasan Perusahaan',
            'header_title' => 'Visi & Misi Dancell',
            'header_description' => 'Landasan utama yang menuntun langkah Dancell sejak 2008 dalam memberikan dampak positif bagi seluruh masyarakat.',
            'visi_badge' => 'Visi Perusahaan',
            'visi_title' => '"Mewujudkan perusahaan yang bermanfaat dan berdaya saing, mampu bertahan dan mengedepankan kualitas, serta kesejahteraan berkelanjutan untuk sesama."',
            'visi_pillar_1_text' => 'Kualitas Terbaik',
            'visi_pillar_2_text' => 'Daya Saing Tinggi',
            'visi_pillar_3_text' => 'Kesejahteraan Berkelanjutan',
            'misi_items' => [
                [
                    'id' => 'misi-1',
                    'title' => 'Manfaat Bagi Semua Pihak',
                    'desc' => 'Memberikan manfaat berkelanjutan bagi pelanggan, karyawan, investor, dan masyarakat secara konsisten.',
                    'tag' => 'Sosial & Ekonomi',
                    'icon_svg' => '',
                    'highlight' => false,
                ],
                [
                    'id' => 'misi-2',
                    'title' => 'Pemimpin Pasar Ritel',
                    'desc' => 'Mencapai kepuasan pelanggan/relasi maksimal, serta mengembangkan dan mempertahankan posisi sebagai pemimpin pasar di setiap kategori divisi usaha.',
                    'tag' => 'Kualitas & Kepuasan',
                    'icon_svg' => '',
                    'highlight' => false,
                ],
                [
                    'id' => 'misi-3',
                    'title' => 'Pemberdayaan Perempuan',
                    'desc' => 'Misi khusus memberdayakan perempuan agar bisa berdikari, mandiri, dan memiliki penghasilan sendiri yang layak.',
                    'tag' => 'Empowerment',
                    'icon_svg' => '',
                    'highlight' => true,
                ],
            ],
        ]);

        return Inertia::render('Admin/Content/VisiMisiSetting', [
            'visiMisi' => $visiMisi,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the Visi & Misi settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'header_badge' => 'nullable|string|max:255',
            'header_title' => 'nullable|string|max:255',
            'header_description' => 'nullable|string',
            'visi_badge' => 'nullable|string|max:255',
            'visi_badge_icon_svg' => 'nullable|string',
            'visi_title' => 'nullable|string',
            'visi_pillar_1_text' => 'nullable|string|max:255',
            'visi_pillar_1_icon_svg' => 'nullable|string',
            'visi_pillar_2_text' => 'nullable|string|max:255',
            'visi_pillar_2_icon_svg' => 'nullable|string',
            'visi_pillar_3_text' => 'nullable|string|max:255',
            'visi_pillar_3_icon_svg' => 'nullable|string',
            'misi_items' => 'nullable|array',
            'misi_items.*.id' => 'required|string',
            'misi_items.*.title' => 'nullable|string|max:255',
            'misi_items.*.desc' => 'nullable|string',
            'misi_items.*.tag' => 'nullable|string|max:255',
            'misi_items.*.icon_svg' => 'nullable|string',
            'misi_items.*.highlight' => 'boolean',
        ]);

        $visiMisi = VisiMisiSetting::firstOrCreate(['id' => 1]);
        $visiMisi->update($validated);

        // Invalidate Redis Cache
        Cache::forget('visi_misi_setting_content');

        return redirect()->back()->with('status', 'Konten Visi & Misi berhasil diperbarui!');
    }
}

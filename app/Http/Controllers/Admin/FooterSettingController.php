<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FooterSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class FooterSettingController extends Controller
{
    /**
     * Show the Footer settings form.
     */
    public function edit(): Response
    {
        $footer = FooterSetting::firstOrCreate(['id' => 1], [
            'brand_name' => 'DANCELL',
            'brand_tag' => 'Group',
            'brand_subtitle' => 'Dan Group Official Company Profile 2025/2026',
            'brand_description' => 'Dancell adalah perusahaan ritel terpercaya yang pertama kali berdiri pada tahun 2008 di Warujayeng, Nganjuk. Hingga kini memiliki 56 cabang aktif di seluruh wilayah Jawa Timur.',
            'branch_badge_text' => '56 Cabang Siap Melayani Pelanggan',
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
                ['label' => 'Sejarah 56 Cabang', 'href' => '#history'],
                ['label' => 'Produk & Aksesori', 'href' => '#products'],
                ['label' => 'Lokasi Outlet Ritel', 'href' => '#branches'],
            ],
            'bottom_links' => [
                ['label' => 'Syarat & Ketentuan', 'href' => '#'],
                ['label' => 'Kebijakan Privasi', 'href' => '#'],
                ['label' => 'Karir Dancell', 'href' => '#'],
            ],
        ]);

        return Inertia::render('Admin/Content/FooterSetting', [
            'footer' => $footer,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the Footer settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'brand_name' => 'nullable|string|max:255',
            'brand_tag' => 'nullable|string|max:100',
            'brand_subtitle' => 'nullable|string|max:255',
            'brand_description' => 'nullable|string',
            'branch_badge_text' => 'nullable|string|max:255',
            'office_title' => 'nullable|string|max:255',
            'office_address' => 'nullable|string',
            'office_hours' => 'nullable|string|max:255',
            'office_established' => 'nullable|string|max:255',
            'value_box_title' => 'nullable|string|max:255',
            'value_box_heading' => 'nullable|string|max:255',
            'value_box_description' => 'nullable|string',
            'copyright_text' => 'nullable|string|max:255',
            'nav_links' => 'nullable|array',
            'nav_links.*.label' => 'nullable|string|max:255',
            'nav_links.*.href' => 'nullable|string|max:255',
            'bottom_links' => 'nullable|array',
            'bottom_links.*.label' => 'nullable|string|max:255',
            'bottom_links.*.href' => 'nullable|string|max:255',
        ]);

        $footer = FooterSetting::firstOrCreate(['id' => 1]);
        $footer->update($validated);

        // Invalidate Redis Cache
        Cache::forget('footer_setting_content');

        return redirect()->back()->with('status', 'Konten Footer & Kontak berhasil diperbarui!');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Support\Facades\Cache;

class HeroSettingController extends Controller
{
    /**
     * Show the hero content setting form.
     */
    public function edit(): Response
    {
        $hero = HeroSetting::firstOrCreate(['id' => 1], [
            'badge_text' => 'Pusat Ritel Gadget, Laptop & Aksesori — 56 Outlet Jawa Timur',
            'title' => 'Pusat Ritel Gadget & Laptop, Terlengkap & Bergaransi Resmi',
            'description' => 'Dancell (Dan Group) adalah jaringan ritel gadget, smartphone, laptop, hingga aksesori terlengkap di Jawa Timur. Berdiri sejak 2008, kini siap melayani Anda di 56 outlet resmi dengan jaminan 100% original, garansi resmi, dan tukar tambah tepercaya.',
            'primary_btn_text' => 'Temukan Outlet Terdekat',
            'primary_btn_link' => '#branches',
            'secondary_btn_text' => 'Katalog Produk & Brand',
            'secondary_btn_link' => '#products',
            'feature_1_text' => '100% Garansi Resmi',
            'feature_2_text' => 'Gadget, Laptop & Aksesori',
            'feature_3_text' => '56 Outlet Jawa Timur',
        ]);

        return Inertia::render('Admin/Content/HeroSetting', [
            'hero' => $hero,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the hero content setting.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'badge_text' => 'nullable|string|max:255',
            'badge_icon_svg' => 'nullable|string',
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'primary_btn_text' => 'nullable|string|max:255',
            'primary_btn_link' => 'nullable|string|max:255',
            'primary_btn_icon_svg' => 'nullable|string',
            'secondary_btn_text' => 'nullable|string|max:255',
            'secondary_btn_link' => 'nullable|string|max:255',
            'secondary_btn_icon_svg' => 'nullable|string',
            'feature_1_text' => 'nullable|string|max:255',
            'feature_1_icon_svg' => 'nullable|string',
            'feature_2_text' => 'nullable|string|max:255',
            'feature_2_icon_svg' => 'nullable|string',
            'feature_3_text' => 'nullable|string|max:255',
            'feature_3_icon_svg' => 'nullable|string',
        ]);

        $hero = HeroSetting::firstOrCreate(['id' => 1]);
        $hero->update($validated);

        // Invalidate Redis Cache
        Cache::forget('hero_setting_content');

        return redirect()->back()->with('status', 'Konten Hero Section berhasil diperbarui!');
    }
}

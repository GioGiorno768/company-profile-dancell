<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PartnerBrandSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PartnerBrandSettingController extends Controller
{
    /**
     * Show the Partner & Brand settings form.
     */
    public function edit(): Response
    {
        $partnerBrand = PartnerBrandSetting::firstOrCreate(['id' => 1], [
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
        ]);

        return Inertia::render('Admin/Content/PartnerBrandSetting', [
            'partnerBrand' => $partnerBrand,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the Partner & Brand settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'header_badge' => 'nullable|string|max:255',
            'header_title' => 'nullable|string|max:255',
            'header_description' => 'nullable|string',
            'stat_1_val' => 'nullable|string|max:50',
            'stat_1_label' => 'nullable|string|max:100',
            'stat_2_val' => 'nullable|string|max:50',
            'stat_2_label' => 'nullable|string|max:100',
            'stat_3_val' => 'nullable|string|max:50',
            'stat_3_label' => 'nullable|string|max:100',
            'stat_4_val' => 'nullable|string|max:50',
            'stat_4_label' => 'nullable|string|max:100',
            'smartphone_brands' => 'nullable|array',
            'smartphone_brands.*.name' => 'nullable|string|max:255',
            'smartphone_brands.*.icon' => 'nullable|string',
            'smartphone_brands.*.tag' => 'nullable|string|max:100',
            'smartphone_brands.*.desc' => 'nullable|string',
            'accessory_brands' => 'nullable|array',
            'accessory_brands.*.name' => 'nullable|string|max:255',
            'accessory_brands.*.icon' => 'nullable|string',
            'accessory_brands.*.tag' => 'nullable|string|max:100',
            'accessory_brands.*.desc' => 'nullable|string',
            'footer_note' => 'nullable|string',
            'cta_btn_text' => 'nullable|string|max:255',
            'cta_btn_link' => 'nullable|string|max:255',
        ]);

        $partnerBrand = PartnerBrandSetting::firstOrCreate(['id' => 1]);
        $partnerBrand->update($validated);

        // Invalidate Redis Cache
        Cache::forget('partner_brand_setting_content');

        return redirect()->back()->with('status', 'Konten Mitra & Brand Partner berhasil diperbarui!');
    }
}

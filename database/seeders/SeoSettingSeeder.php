<?php

namespace Database\Seeders;

use App\Models\SeoSetting;
use Illuminate\Database\Seeder;

class SeoSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonLdSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'ElectronicsStore',
            'name' => 'Dancell Indonesia — Outlet Ritel Gadget & Smartphone',
            'alternateName' => 'Dancell Jawa Timur',
            'url' => 'https://dancell.id',
            'logo' => 'https://dancell.id/assets/images/logo-dancell.png',
            'image' => 'https://dancell.id/assets/images/og-dancell.jpg',
            'description' => 'Dancell adalah jaringan toko ritel gadget, hp, smartphone, dan aksesori terpercaya di Jawa Timur dengan 56 outlet aktif di Nganjuk, Kediri, Blitar, Magetan, Madiun, Mojokerto.',
            'telephone' => '+62358771234',
            'priceRange' => '$$',
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => 'Jl. Ahmad Yani No. 88, Warujayeng, Kec. Tanjunganom',
                'addressLocality' => 'Nganjuk',
                'addressRegion' => 'Jawa Timur',
                'postalCode' => '64483',
                'addressCountry' => 'ID',
            ],
            'geo' => [
                '@type' => 'GeoCoordinates',
                'latitude' => -7.604214,
                'longitude' => 112.029845,
            ],
            'openingHoursSpecification' => [
                [
                    '@type' => 'OpeningHoursSpecification',
                    'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    'opens' => '08:00',
                    'closes' => '21:00',
                ]
            ],
            'sameAs' => [
                'https://instagram.com/dancell_official',
                'https://facebook.com/dancell.official',
                'https://tiktok.com/@dancell_official',
            ],
        ];

        SeoSetting::updateOrCreate(
            ['id' => 1],
            [
                'site_title' => 'Dancell — Jaringan Outlet Ritel Gadget & Smartphone Terbesar di Jawa Timur',
                'meta_description' => 'Dancell adalah toko ritel gadget, HP, smartphone, & aksesori resmi terpercaya di Jawa Timur dengan 56 outlet aktif di Nganjuk, Kediri, Blitar, Magetan, Madiun, & Mojokerto. 100% Original & Bergaransi Resmi.',
                'meta_keywords' => 'Dancell, toko hp Nganjuk, toko gadget Kediri, toko hp Blitar, toko hp Magetan, toko hp Madiun, toko hp Mojokerto, reseller resmi Apple Samsung Xiaomi Jatim, aksesori hp garansi resmi',
                'author' => 'Dancell Indonesia',
                'canonical_url' => 'https://dancell.id',
                'og_title' => 'Dancell — 56 Outlet Ritel Gadget Terpercaya Jawa Timur',
                'og_description' => 'Temukan cabang toko HP Dancell terdekat di Nganjuk, Kediri, Blitar, Magetan, Madiun, & Mojokerto. Produk gadget original, klaim garansi mudah, & promo diskon spesial!',
                'og_image' => 'https://dancell.id/assets/images/og-dancell.jpg',
                'og_type' => 'website',
                'twitter_card' => 'summary_large_image',
                'twitter_site' => '@dancell_official',
                'robots' => 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
                'google_site_verification' => 'google-site-verification-dancell-2026-demo-token',
                'structured_data_json' => json_encode($jsonLdSchema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
            ]
        );
    }
}

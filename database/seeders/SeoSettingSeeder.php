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
            'url' => 'https://dancell-official.com',
            'logo' => 'https://dancell-official.com/images/hero.webp',
            'image' => 'https://dancell-official.com/images/hero.webp',
            'description' => 'Dancell adalah jaringan toko ritel gadget, HP, smartphone, dan aksesori terpercaya di Jawa Timur dengan 58 outlet aktif di Nganjuk, Kediri, Blitar, Jombang, Mojokerto, Sidoarjo, Lamongan, Ngawi, Madiun, Trenggalek, Tulungagung, dan Ponorogo.',
            'telephone' => '+6285230855400',
            'priceRange' => '$$',
            'currenciesAccepted' => 'IDR',
            'paymentAccepted' => 'Cash, Credit Card, Debit Card, Bank Transfer, QRIS',
            'numberOfEmployees' => [
                '@type' => 'QuantitativeValue',
                'minValue' => 200,
            ],
            'foundingDate' => '2008',
            'areaServed' => [
                '@type' => 'State',
                'name' => 'Jawa Timur',
                'addressCountry' => 'ID',
            ],
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => 'Jl. A. Yani No. 19, Warujayeng, Kec. Tanjunganom',
                'addressLocality' => 'Nganjuk',
                'addressRegion' => 'Jawa Timur',
                'postalCode' => '64482',
                'addressCountry' => 'ID',
            ],
            'geo' => [
                '@type' => 'GeoCoordinates',
                'latitude' => -7.604214,
                'longitude' => 112.029845,
            ],
            'hasMap' => 'https://maps.google.com/?cid=2638569193056379776',
            'openingHoursSpecification' => [
                [
                    '@type' => 'OpeningHoursSpecification',
                    'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    'opens' => '08:00',
                    'closes' => '21:00',
                ]
            ],
            'brand' => [
                ['@type' => 'Brand', 'name' => 'Apple'],
                ['@type' => 'Brand', 'name' => 'Samsung'],
                ['@type' => 'Brand', 'name' => 'Xiaomi'],
                ['@type' => 'Brand', 'name' => 'OPPO'],
                ['@type' => 'Brand', 'name' => 'Vivo'],
                ['@type' => 'Brand', 'name' => 'Realme'],
                ['@type' => 'Brand', 'name' => 'ASUS'],
                ['@type' => 'Brand', 'name' => 'Lenovo'],
                ['@type' => 'Brand', 'name' => 'Nokia'],
                ['@type' => 'Brand', 'name' => 'Motorola'],
            ],
            'sameAs' => [
                'https://www.instagram.com/dancell_official',
                'https://www.facebook.com/dancellofficiall/',
                'https://www.tiktok.com/@dancell_official',
            ],
            'aggregateRating' => [
                '@type' => 'AggregateRating',
                'ratingValue' => '4.8',
                'reviewCount' => '1200',
                'bestRating' => '5',
            ],
        ];

        SeoSetting::updateOrCreate(
            ['id' => 1],
            [
                'site_title' => 'Dancell — Jaringan Outlet Ritel Gadget & Smartphone Terbesar di Jawa Timur',
                'site_name' => 'Dancell Indonesia',
                'meta_description' => 'Dancell adalah toko ritel gadget, HP, smartphone, & aksesori resmi terpercaya di Jawa Timur dengan 58 outlet aktif di Nganjuk, Kediri, Blitar, Jombang, Mojokerto, Sidoarjo, Lamongan, Madiun, Trenggalek, Tulungagung, & Ponorogo. 100% Original & Bergaransi Resmi.',
                'meta_keywords' => 'Dancell, toko hp Nganjuk, toko gadget Kediri, toko hp Blitar, toko hp Jombang, toko hp Mojokerto, toko hp Sidoarjo, toko hp Lamongan, toko hp Madiun, toko hp Magetan, toko hp Trenggalek, toko hp Tulungagung, toko hp Ponorogo, toko hp Ngawi, reseller resmi Apple Samsung Xiaomi OPPO Vivo Realme Jatim, aksesori hp garansi resmi',
                'author' => 'Dancell Indonesia',
                'locale' => 'id_ID',
                'canonical_url' => 'https://dancell-official.com',
                'og_title' => 'Dancell — 58 Outlet Ritel Gadget & Smartphone Terpercaya Jawa Timur',
                'og_description' => 'Temukan cabang toko HP Dancell terdekat di Nganjuk, Kediri, Blitar, Jombang, Mojokerto, Sidoarjo, Lamongan, Madiun, & kota lainnya. Produk gadget original, garansi resmi, & promo spesial!',
                'og_image' => 'https://dancell-official.com/images/hero.webp',
                'og_image_alt' => 'Dancell Indonesia — Jaringan Outlet Ritel Gadget & Smartphone Terkemuka di Jawa Timur',
                'og_type' => 'website',
                'twitter_card' => 'summary_large_image',
                'twitter_site' => '@dancell_official',
                'twitter_creator' => '@dancell_official',
                'robots' => 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
                'google_site_verification' => '',
                'bing_site_verification' => '',
                'yandex_site_verification' => '',
                'facebook_app_id' => '',
                'facebook_page_url' => 'https://www.facebook.com/dancellofficiall/',
                'instagram_account_url' => 'https://instagram.com/dancell_official',
                'tiktok_profile_url' => 'https://tiktok.com/@dancell_official',
                'whatsapp_cs_url' => 'https://wa.me/6285348678999',
                'geo_region' => 'ID-JI',
                'geo_placename' => 'Nganjuk, Jawa Timur',
                'geo_position' => '-7.604214;112.029845',
                'structured_data_json' => json_encode($jsonLdSchema, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            ]
        );
    }
}

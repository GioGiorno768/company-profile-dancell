<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = [
            [
                'name' => 'Dancell Warujayeng (HQ)',
                'city' => 'Nganjuk',
                'area' => 'Pusat Nganjuk',
                'year' => '2008',
                'is_hq' => true,
                'address' => 'Jl. Ahmad Yani No. 88, Warujayeng, Kec. Tanjunganom, Kabupaten Nganjuk, Jawa Timur 64483 (Kantor Pusat)',
                'phone' => '0358-771234',
                'whatsapp' => '081234567800',
                'google_maps_url' => 'https://maps.google.com/?q=Warujayeng+Nganjuk',
                'opening_hours' => 'Buka Setiap Hari (08.00 - 21.00 WIB)',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'name' => 'Dancell Mojoroto',
                'city' => 'Kediri',
                'area' => 'Mojoroto',
                'year' => '2020',
                'is_hq' => false,
                'address' => 'Jl. Kawi No. 14, Mojoroto, Kec. Mojoroto, Kota Kediri, Jawa Timur 64112',
                'phone' => '0354-681122',
                'whatsapp' => '081234567801',
                'google_maps_url' => 'https://maps.google.com/?q=Mojoroto+Kediri',
                'opening_hours' => 'Buka Setiap Hari (08.00 - 21.00 WIB)',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'name' => 'Dancell Srengat',
                'city' => 'Blitar',
                'area' => 'Srengat',
                'year' => '2021',
                'is_hq' => false,
                'address' => 'Jl. Raya Srengat No. 45, Srengat, Kabupaten Blitar, Jawa Timur 66152',
                'phone' => '0342-805566',
                'whatsapp' => '081234567802',
                'google_maps_url' => 'https://maps.google.com/?q=Srengat+Blitar',
                'opening_hours' => 'Buka Setiap Hari (08.00 - 21.00 WIB)',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'name' => 'Dancell Magetan',
                'city' => 'Magetan',
                'area' => 'Pusat Magetan',
                'year' => '2022',
                'is_hq' => false,
                'address' => 'Jl. Yos Sudarso No. 12, Magetan, Kabupaten Magetan, Jawa Timur 63314',
                'phone' => '0351-891100',
                'whatsapp' => '081234567803',
                'google_maps_url' => 'https://maps.google.com/?q=Magetan+Center',
                'opening_hours' => 'Buka Setiap Hari (08.00 - 21.00 WIB)',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'name' => 'Dancell Semen',
                'city' => 'Kediri',
                'area' => 'Semen',
                'year' => '2023',
                'is_hq' => false,
                'address' => 'Jl. Raya Semen No. 89, Semen, Kabupaten Kediri, Jawa Timur 64161',
                'phone' => '0354-690011',
                'whatsapp' => '081234567804',
                'google_maps_url' => 'https://maps.google.com/?q=Semen+Kediri',
                'opening_hours' => 'Buka Setiap Hari (08.00 - 21.00 WIB)',
                'is_active' => true,
                'order' => 5,
            ],
            [
                'name' => 'Dancell Uteran',
                'city' => 'Madiun',
                'area' => 'Uteran',
                'year' => '2024',
                'is_hq' => false,
                'address' => 'Jl. Raya Uteran No. 77, Geger, Kabupaten Madiun, Jawa Timur 63152',
                'phone' => '0351-460022',
                'whatsapp' => '081234567805',
                'google_maps_url' => 'https://maps.google.com/?q=Uteran+Madiun',
                'opening_hours' => 'Buka Setiap Hari (08.00 - 21.00 WIB)',
                'is_active' => true,
                'order' => 6,
            ],
            [
                'name' => 'Dancell Mojosari',
                'city' => 'Mojokerto',
                'area' => 'Mojosari',
                'year' => '2025',
                'is_hq' => false,
                'address' => 'Jl. Pahlawan No. 34, Mojosari, Kabupaten Mojokerto, Jawa Timur 61382',
                'phone' => '0321-590033',
                'whatsapp' => '081234567806',
                'google_maps_url' => 'https://maps.google.com/?q=Mojosari+Mojokerto',
                'opening_hours' => 'Buka Setiap Hari (08.00 - 21.00 WIB)',
                'is_active' => true,
                'order' => 7,
            ],
            [
                'name' => 'Dancell Nganjuk Kota',
                'city' => 'Nganjuk',
                'area' => 'Alun-alun',
                'year' => '2026',
                'is_hq' => false,
                'address' => 'Jl. Diponegoro No. 25, Mangundikaran, Kota Nganjuk, Jawa Timur 64419 (Dekat Alun-alun)',
                'phone' => '0358-320044',
                'whatsapp' => '081234567807',
                'google_maps_url' => 'https://maps.google.com/?q=Nganjuk+Kota',
                'opening_hours' => 'Buka Setiap Hari (08.00 - 21.00 WIB)',
                'is_active' => true,
                'order' => 8,
            ],
            [
                'name' => 'Dancell Malang Town Square (Matos)',
                'city' => 'Malang',
                'area' => 'Klojen / Matos',
                'year' => '2018',
                'is_hq' => false,
                'address' => 'Jl. Veteran No. 2, Penanggungan, Kec. Klojen, Kota Malang, Jawa Timur 65145 (Lantai Ground)',
                'phone' => '0341-550123',
                'whatsapp' => '081234567808',
                'google_maps_url' => 'https://maps.google.com/?q=Matos+Malang',
                'opening_hours' => 'Buka Setiap Hari (10.00 - 21.30 WIB)',
                'is_active' => true,
                'order' => 9,
            ],
            [
                'name' => 'Dancell Surabaya WTC Mall',
                'city' => 'Surabaya',
                'area' => 'Genteng / WTC',
                'year' => '2019',
                'is_hq' => false,
                'address' => 'WTC Pemuda Surabaya Lt. 2 No. 245, Jl. Pemuda No. 27-31, Genteng, Surabaya 60271',
                'phone' => '031-5312345',
                'whatsapp' => '081234567809',
                'google_maps_url' => 'https://maps.google.com/?q=WTC+Surabaya',
                'opening_hours' => 'Buka Setiap Hari (10.00 - 21.00 WIB)',
                'is_active' => true,
                'order' => 10,
            ],
        ];

        foreach ($branches as $branch) {
            $slug = Str::slug($branch['name']);
            Branch::updateOrCreate(
                ['slug' => $slug],
                array_merge($branch, ['slug' => $slug])
            );
        }
    }
}

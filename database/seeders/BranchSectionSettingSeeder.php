<?php

namespace Database\Seeders;

use App\Models\BranchSectionSetting;
use Illuminate\Database\Seeder;

class BranchSectionSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BranchSectionSetting::firstOrCreate([], [
            'header_badge'       => 'Jaringan Outlet Ritel',
            'header_title'       => '58 Cabang Ritel Tersebar di Jawa Timur',
            'header_description' => 'Temukan cabang Dancell terdekat di kota Anda dengan pelayanan terbaik dan garansi produk terpercaya.',
            'banner_title'       => 'Total 58 Cabang & Terus Bertambah',
            'banner_description' => 'Dancell berkomitmen menghadirkan outlet terdekat yang mudah dijangkau di seluruh kabupaten/kota Jawa Timur.',
            'cta_btn_text'       => 'Hubungi Manajemen Dancell',
            'cta_btn_link'       => '#contact',
        ]);
    }
}

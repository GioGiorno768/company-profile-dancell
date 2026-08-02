<?php

namespace Database\Seeders;

use App\Models\VisiMisiSetting;
use Illuminate\Database\Seeder;

class VisiMisiSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VisiMisiSetting::updateOrCreate(
            ['id' => 1],
            [
                'header_badge' => 'Komitmen & Landasan Perusahaan',
                'header_title' => 'Visi & Misi Dancell',
                'header_description' => 'Landasan utama yang menuntun langkah Dancell sejak 2008 dalam memberikan dampak positif bagi seluruh masyarakat.',
                'visi_badge' => 'Visi Perusahaan',
                'visi_badge_icon_svg' => '',
                'visi_title' => '"Mewujudkan perusahaan yang bermanfaat dan berdaya saing, mampu bertahan dan mengedepankan kualitas, serta kesejahteraan berkelanjutan untuk sesama."',
                'visi_pillar_1_text' => 'Kualitas Terbaik',
                'visi_pillar_1_icon_svg' => '',
                'visi_pillar_2_text' => 'Daya Saing Tinggi',
                'visi_pillar_2_icon_svg' => '',
                'visi_pillar_3_text' => 'Kesejahteraan Berkelanjutan',
                'visi_pillar_3_icon_svg' => '',
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
            ]
        );
    }
}

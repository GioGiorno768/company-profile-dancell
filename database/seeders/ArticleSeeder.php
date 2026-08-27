<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\ArticleSetting;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed ArticleSetting
        ArticleSetting::updateOrCreate(
            ['id' => 1],
            [
                'badge_text' => 'Pusat Informasi & Edukasi Teknologi',
                'header_title' => 'Jelajahi Artikel & Wawasan Gadget',
                'header_subtitle' => 'Tips memilih smartphone, panduan garansi resmi, dan berita seputar jaringan toko Dancell.',
                'global_tags' => [
                    'Garansi Resmi',
                    'iPhone vs Android',
                    'Laptop Kuliah',
                    'Battery Health',
                    'Tukar Tambah',
                    'Promo Jatim',
                    'Kamera Flagship',
                    'Service Center',
                ],
            ]
        );

        // 2. Seed 8 Rich Articles
        $articles = [
            [
                'id' => 1,
                'title' => 'Panduan Cerdas Memilih Smartphone Garansi Resmi Indonesia di 2026',
                'slug' => 'tips-memilih-smartphone-garansi-resmi-indonesia',
                'subtitle' => 'Kenali ciri-ciri IMEI terdaftar di Kemenperin, perbedaan garansi distributor vs TAM, dan hak purna jual Anda.',
                'excerpt' => 'Membeli smartphone tanpa garansi resmi membawa risiko pemblokiran sinyal dan sulitnya klaim servis. Pelajari panduan lengkapnya dari tim ahli Dancell.',
                'image' => '/images/smartphone_hero.png',
                'category' => 'Tips & Trik',
                'category_slug' => 'tips-trik',
                'tags' => ['Garansi Resmi', 'Tips Belanja', 'IMEI', 'Purna Jual'],
                'author_name' => 'Dimas Prasetyo',
                'author_role' => 'Hardware & Laptop Reviewer',
                'reading_time' => '4 min read',
                'views' => 1250,
                'is_featured' => true,
                'is_published' => true,
                'published_at' => now()->subDays(2),
                'content' => '
                    <p>Membeli gadget baru di era serba digital memerlukan kehati-hatian ekstra. Pasalnya, peredaran perangkat tanpa izin edar resmi atau non-IMEI terdaftar masih kerap ditemui di pasaran.</p>
                    <h2>1. Periksa Validasi IMEI di Database Kemenperin / Bea Cukai</h2>
                    <p>Langkah paling pertama dan mendasar adalah memeriksa 15 digit nomor IMEI yang tertera di kotak kemasan atau dengan menekan dial <code>*#06#</code>. Pastikan nomor tersebut terdaftar valid pada sistem database nasional.</p>
                    <blockquote>"Semua unit gadget yang dijual di seluruh cabang Dancell Indonesia dijamin 100% bergaransi resmi prinsipal dengan IMEI terdaftar aktif seumur hidup."</blockquote>
                    <h2>2. Cek Stiker Distributor Resmi</h2>
                    <p>Di Indonesia, pastikan unit Anda didistribusikan oleh mitra resmi seperti Erajaya (TAM), Mitra Adiperkasa (MAP), atau langsung distributor resmi merek terkait.</p>
                    <h2>3. Jaminan Purna Jual & Service Center</h2>
                    <p>Keuntungan terbesar unit resmi adalah akses langsung ke Service Center resmi di seluruh Indonesia dengan jaminan suku cadang original.</p>
                ',
            ],
            [
                'id' => 2,
                'title' => 'Review Mendalam: 5 Laptop Terbaik untuk Mahasiswa & Profesional Muda 2026',
                'slug' => 'rekomendasi-laptop-terbaik-mahasiswa-2026',
                'subtitle' => 'Performa kencang, baterai tahan 12 jam, bobot ringan, dan harga terjangkau mulai 6 jutaan.',
                'excerpt' => 'Rekomendasi laptop terbaik dengan prosesor hemat daya terbaru, layar tajam IPS/OLED, dan durabilitas tinggi untuk kebutuhan kuliah maupun kerja remote.',
                'image' => '/images/hero.webp',
                'category' => 'Review Gadget',
                'category_slug' => 'review-gadget',
                'tags' => ['Laptop Kuliah', 'Review Laptop', 'Baterai Awet', 'Produktivitas'],
                'author_name' => 'Dimas Prasetyo',
                'author_role' => 'Hardware & Laptop Reviewer',
                'reading_time' => '5 min read',
                'views' => 2430,
                'is_featured' => true,
                'is_published' => true,
                'published_at' => now()->subDays(5),
                'content' => '
                    <p>Kebutuhan laptop komputasi modern kini menuntut keseimbangan antara performa pemrosesan, efisiensi baterai, dan portabilitas tinggi.</p>
                    <h2>Kriteria Laptop Ideal Mahasiswa</h2>
                    <ul>
                        <li><strong>RAM Minimal 16GB:</strong> Menghindari bottleneck saat membuka puluhan tab browser dan aplikasi office sekaligus.</li>
                        <li><strong>Storage SSD NVMe 512GB:</strong> Kecepatan booting dalam hitungan detik.</li>
                        <li><strong>Layar Nyaman di Mata:</strong> Resolusi FHD atau 2K dengan sertifikasi anti-flicker.</li>
                    </ul>
                ',
            ],
            [
                'id' => 3,
                'title' => 'Dancell Resmi Buka Cabang Baru di Jawa Timur: Banjir Promo & Diskon Spesial',
                'slug' => 'grand-opening-cabang-baru-dancell-jawa-timur',
                'subtitle' => 'Perluasan jaringan toko ritel gadget untuk menghadirkan pelayanan terbaik dan terdekat bagi warga Jatim.',
                'excerpt' => 'Dancell kembali memperluas jaringan retail resmi dengan membuka outlet terbaru. Dapatkan cashback hingga 1 juta, bonus aksesoris, dan cicilan 0%.',
                'image' => '/images/smartphone_hero.png',
                'category' => 'Berita Dancell',
                'category_slug' => 'berita-dancell',
                'tags' => ['Promo Jatim', 'Grand Opening', 'Cabang Dancell', 'Cashback'],
                'author_name' => 'Budi Santoso',
                'author_role' => 'Head of Corporate Communications',
                'reading_time' => '3 min read',
                'views' => 3890,
                'is_featured' => true,
                'is_published' => true,
                'published_at' => now()->subDays(7),
                'content' => '
                    <p>Sebagai wujud komitmen memberikan kemudahan akses belanja gadget original dan bergaransi resmi, Dancell Indonesia meresmikan cabang terbarunya di Jawa Timur.</p>
                    <h2>Promo Spesial Grand Opening</h2>
                    <p>Kunjungi outlet kami dan nikmati berbagai penawaran menarik seperti trade-in ekstra, diskon bundling aksesoris original, dan lucky dip berhadiah langsung smartphone.</p>
                ',
            ],
            [
                'id' => 4,
                'title' => '7 Tips Merawat Battery Health Smartphone agar Tetap Awet di Atas 90%',
                'slug' => 'cara-merawat-battery-health-smartphone-awet',
                'subtitle' => 'Hindari kebiasaan sepele yang membuat baterai smartphone cepat bocor dan drop performanya.',
                'excerpt' => 'Ketahui batas ideal persentase pengisian daya, pengaruh suhu panas saat gaming, dan cara memilih charger adaptor yang aman.',
                'image' => '/images/hero.webp',
                'category' => 'Tips & Trik',
                'category_slug' => 'tips-trik',
                'tags' => ['Battery Health', 'Tips Baterai', 'Fast Charging', 'Perawatan HP'],
                'author_name' => 'Rina Wijaya',
                'author_role' => 'Gadget Care Specialist',
                'reading_time' => '4 min read',
                'views' => 5120,
                'is_featured' => true,
                'is_published' => true,
                'published_at' => now()->subDays(10),
                'content' => '
                    <p>Kesehatan baterai (battery health) merupakan salah satu faktor krusial yang menentukan umur pemakaian serta nilai jual kembali smartphone Anda.</p>
                    <h2>Aturan Emas 20% - 80%</h2>
                    <p>Baterai Lithium-Ion modern bekerja paling optimal saat berada dalam rentang daya antara 20% hingga 80%. Hindari membiarkan baterai habis hingga 0% secara berulang.</p>
                    <h2>Gunakan Adaptor & Kabel Bersertifikasi Resmi</h2>
                    <p>Selalu gunakan charger original atau pihak ketiga yang telah memiliki sertifikasi MFi / USB-IF untuk menjaga kestabilan voltase.</p>
                ',
            ],
            [
                'id' => 5,
                'title' => 'Program Tukar Tambah (Trade-In) di Dancell: Gadget Lama Dihargai Maksimal!',
                'slug' => 'program-tukar-tambah-gadget-lama-dancell',
                'subtitle' => 'Upgrade smartphone lama Anda ke model terbaru tanpa ribet hanya dalam waktu 10 menit di seluruh toko Dancell.',
                'excerpt' => 'Punya smartphone lama nganggur? Tukarkan sekarang di Dancell dan dapatkan potongan harga langsung serta bonus perlindungan garansi tambahan.',
                'image' => '/images/hero.webp',
                'category' => 'Promo & Event',
                'category_slug' => 'promo-event',
                'tags' => ['Tukar Tambah', 'Trade In', 'Upgrade HP', 'Promo Dancell'],
                'author_name' => 'Budi Santoso',
                'author_role' => 'Head of Corporate Communications',
                'reading_time' => '3 min read',
                'views' => 1950,
                'is_featured' => false,
                'is_published' => true,
                'published_at' => now()->subDays(12),
                'content' => '
                    <p>Ingin mengganti smartphone lawas Anda dengan model terbaru namun malas menjualnya sendiri secara online? Program Trade-In resmi Dancell adalah solusinya.</p>
                ',
            ],
            [
                'id' => 6,
                'title' => 'Duel Kamera Flagship 2026: Mana yang Paling Juara untuk Foto Malam & Video Konten?',
                'slug' => 'komparasi-lengkap-flagship-terbaru-kamera-vs-performa',
                'subtitle' => 'Uji tuntas sensor kamera, kemampuan zoom optik, hingga stabilisasi video di kondisi minim cahaya.',
                'excerpt' => 'Bingung memilih smartphone flagship terbaik untuk konten kreator? Simak hasil pengujian kamera mendalam kami di berbagai kondisi pencahayaan.',
                'image' => '/images/smartphone_hero.png',
                'category' => 'Review Gadget',
                'category_slug' => 'review-gadget',
                'tags' => ['Kamera Flagship', 'Review Kamera', 'Low Light', 'Fotografi HP'],
                'author_name' => 'Dimas Prasetyo',
                'author_role' => 'Hardware & Laptop Reviewer',
                'reading_time' => '6 min read',
                'views' => 4820,
                'is_featured' => false,
                'is_published' => true,
                'published_at' => now()->subDays(15),
                'content' => '
                    <p>Tahun 2026 menghadirkan lompatan besar pada teknologi sensor kamera smartphone dari berbagai produsen ternama.</p>
                ',
            ],
            [
                'id' => 7,
                'title' => 'Cara Mudah Pindah Data dari Android ke iPhone Tanpa Hilang Chat WhatsApp & Galeri',
                'slug' => 'cara-aman-transfer-data-whatsapp-dan-foto-dari-android-ke-iphone',
                'subtitle' => 'Tutorial lengkap migrasi chat WA, kontak, foto, dan aplikasi tanpa ribet hanya dalam 15 menit.',
                'excerpt' => 'Baru beralih dari smartphone Android ke iPhone? Ikuti panduan praktis memindahkan seluruh data dan histori chat tanpa kendala.',
                'image' => '/images/hero.webp',
                'category' => 'Tips & Trik',
                'category_slug' => 'tips-trik',
                'tags' => ['iPhone vs Android', 'Pindah Data', 'WhatsApp Transfer', 'Tutorial'],
                'author_name' => 'Rina Wijaya',
                'author_role' => 'Gadget Care Specialist',
                'reading_time' => '4 min read',
                'views' => 3120,
                'is_featured' => false,
                'is_published' => true,
                'published_at' => now()->subDays(18),
                'content' => '
                    <p>Migrasi perangkat seringkali menjadi kekhawatiran terbesar konsumen saat memutuskan beralih sistem operasi.</p>
                ',
            ],
            [
                'id' => 8,
                'title' => 'Pilihan Smartwatch Terbaik 2026 untuk Olahraga, GPS Akurat, & Baterai Tahan 2 Minggu',
                'slug' => 'rekomendasi-smartwatch-tahan-air-dan-baterai-awet-sebulan',
                'subtitle' => 'Pantau detak jantung, tidur, dan aktivitas workout harian dengan akurasi sensor medis.',
                'excerpt' => 'Review jam tangan pintar untuk running, renang, dan lifestyle dengan ketahanan baterai super tangguh dan harga terjangkau.',
                'image' => '/images/smartphone_hero.png',
                'category' => 'Review Gadget',
                'category_slug' => 'review-gadget',
                'tags' => ['Smartwatch', 'Review Gadget', 'Olahraga', 'Kesehatan'],
                'author_name' => 'Dimas Prasetyo',
                'author_role' => 'Hardware & Laptop Reviewer',
                'reading_time' => '3 min read',
                'views' => 2640,
                'is_featured' => false,
                'is_published' => true,
                'published_at' => now()->subDays(20),
                'content' => '
                    <p>Smartwatch kini telah bertransformasi dari sekadar aksesori menjadi asisten kesehatan pribadi yang esensial.</p>
                ',
            ],
        ];

        foreach ($articles as $art) {
            Article::updateOrCreate(['id' => $art['id']], $art);
        }
    }
}

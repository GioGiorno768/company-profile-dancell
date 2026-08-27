import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    BookOpen, 
    ArrowRight, 
    Clock, 
    Eye, 
    Sparkles, 
    ChevronRight,
    Tag
} from 'lucide-react';

export default function ArticlesSection({ articles = [] }) {
    // Default display 3 latest highlight articles
    const displayArticles = Array.isArray(articles) && articles.length > 0
        ? articles.slice(0, 3)
        : [
            {
                id: 1,
                slug: 'panduan-memilih-hp-garansi-resmi-vs-distributor-2026',
                title: 'Panduan Memilih HP Garansi Resmi vs Distributor di 2026: Jangan Sampai Tertipu IMEI!',
                category: 'Tips & Trik',
                excerpt: 'Pelajari perbedaan garansi resmi SEIN, TAM, dan iBox dibandingkan garansi distributor agar sinyal aman dan garansi terjamin.',
                image: '/images/hero.webp',
                published_at: '26 Agustus 2026',
                reading_time: '4 min read',
            },
            {
                id: 2,
                slug: 'rekomendasi-laptop-terbaik-mahasiswa-pelajar-2026',
                title: 'Rekomendasi Laptop Terbaik untuk Mahasiswa & Pelajar 2026: Spek Kencang, Baterai Awet',
                category: 'Review Gadget',
                excerpt: 'Mencari laptop kuliah yang ringan, awet baterai, dan tahan banting untuk multitasking? Simak rangkuman rekomendasi terbaik.',
                image: '/images/smartphone_hero.png',
                published_at: '24 Agustus 2026',
                reading_time: '5 min read',
            },
            {
                id: 3,
                slug: 'tips-merawat-battery-health-iphone-android-awet-tahunan',
                title: '7 Tips Merawat Battery Health iPhone & Android Agar Tetap Prima Bertahun-tahun',
                category: 'Tips & Trik',
                excerpt: 'Kesehatan baterai drop drastis? Terapkan 7 kebiasaan charging sehat ini agar umur baterai smartphone tahan lama.',
                image: '/images/hero.webp',
                published_at: '21 Agustus 2026',
                reading_time: '3 min read',
            }
        ];

    return (
        <section id="articles" className="py-20 lg:py-28 bg-white font-['Raleway'] relative overflow-hidden border-t border-slate-100">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-50 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 relative z-10">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-100 text-[#800020] text-xs font-semibold tracking-wide">
                            <BookOpen className="w-3.5 h-3.5 text-[#800020]" />
                            <span>Edukasi & Berita Teknologi</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal text-slate-900 tracking-tight leading-snug">
                            Wawasan Gadget & Info Terkini Dancell
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-3xl">
                            Tips memilih smartphone, panduan garansi resmi, komparasi gadget terbaru, dan berita promo seputar Jawa Timur.
                        </p>
                    </div>

                    <Link
                        href="/artikel"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#800020] text-white text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-rose-950/20 shrink-0 self-start md:self-auto cursor-pointer group"
                    >
                        <span>Jelajahi Semua Artikel</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Article Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {displayArticles.map((article, idx) => (
                        <motion.article
                            key={article.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.15 }}
                            className="group flex flex-col bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-rose-200/80 transition-all duration-300"
                        >
                            {/* Card Thumbnail Image */}
                            <Link href={'/artikel/' + article.slug} className="relative aspect-[16/10] overflow-hidden bg-slate-900 block">
                                <img
                                    src={article.image || '/images/hero.webp'}
                                    alt={article.title}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold tracking-wide shadow-sm">
                                        {article.category || 'Tips & Trik'}
                                    </span>
                                </div>
                            </Link>

                            {/* Card Content */}
                            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2.5">
                                    {/* Date & Reading Time */}
                                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                        <span>{article.published_at || 'Terbaru'}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{article.reading_time || '4 min read'}</span>
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#800020] transition-colors leading-snug line-clamp-2">
                                        <Link href={'/artikel/' + article.slug}>
                                            {article.title}
                                        </Link>
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                </div>

                                {/* Read More Link */}
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <Link
                                        href={'/artikel/' + article.slug}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800020] group-hover:text-[#5c0017] transition-colors cursor-pointer"
                                    >
                                        <span>Baca Selengkapnya</span>
                                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

            </div>
        </section>
    );
}

import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ReactLenis } from 'lenis/react';
import Navbar from '@/Components/Landing/Navbar';
import ContactFooter from '@/Components/Landing/ContactFooter';
import { 
    Clock, 
    Eye, 
    Share2, 
    Check, 
    ChevronRight, 
    ArrowLeft, 
    BookOpen, 
    Sparkles, 
    MapPin,
    Flame,
    Tag,
    Newspaper,
    MessageCircle
} from 'lucide-react';

export default function ArticlesShow({ seo, footer, settings, article, relatedArticles = [], popularArticles = [], latestArticles = [] }) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : ('https://dancell-official.com/artikel/' + (article?.slug || ''));

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleWhatsAppShare = () => {
        const text = encodeURIComponent((article?.title || 'Artikel Dancell') + ' - Baca selengkapnya di Dancell: ' + shareUrl);
        window.open('https://api.whatsapp.com/send?text=' + text, '_blank');
    };

    if (!article) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
                <div className="space-y-4">
                    <h2 className="text-xl font-medium text-slate-800">Artikel tidak ditemukan</h2>
                    <Link href="/artikel" className="inline-flex px-4 py-2 rounded-xl bg-[#800020] text-white text-xs">
                        Kembali ke Beranda Artikel
                    </Link>
                </div>
            </div>
        );
    }

    const authorName = article.author?.name || article.author_name || 'Tim Editorial Dancell';
    const authorRole = article.author?.role || article.author_role || 'Teknologi & Hardware Reviewer';

    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
            <div className="min-h-screen bg-slate-50 font-['Raleway'] text-slate-900 selection:bg-[#800020] selection:text-white flex flex-col justify-between antialiased">
                <Head>
                    <title>{(article.title || 'Artikel') + ' | Dancell Indonesia'}</title>
                    <meta name="description" content={article.excerpt || article.subtitle || ''} />
                    <meta property="og:title" content={article.title} />
                    <meta property="og:description" content={article.excerpt} />
                    <meta property="og:image" content={article.image} />
                    <meta property="og:type" content="article" />
                </Head>

                {/* Solid Glass Navbar */}
                <Navbar isAlwaysSolid={true} />

                {/* Main Reading View (Spacious 1920px Widescreen Container) */}
                <main className="pt-28 sm:pt-32 pb-24 flex-1">
                    
                    {/* Breadcrumbs */}
                    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 mb-6">
                        <nav className="flex items-center gap-2 text-xs text-slate-500 font-light">
                            <Link href="/" className="hover:text-slate-900 transition-colors">Beranda</Link>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            <Link href="/artikel" className="hover:text-slate-900 transition-colors">Artikel</Link>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-800 font-normal truncate max-w-[200px] sm:max-w-xs">{article.category}</span>
                        </nav>
                    </div>

                    {/* Article Header (Full Width of Content Grid) */}
                    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 mb-8 sm:mb-10">
                        <div className="max-w-4xl space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href={'/artikel?kategori=' + (article.category_slug || 'semua')}
                                    className="px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#800020] text-xs font-normal tracking-wide hover:bg-rose-100 transition-colors"
                                >
                                    {article.category}
                                </Link>
                                <span className="text-xs text-slate-400 font-light">
                                    {article.published_at}
                                </span>
                                <span className="text-xs text-slate-300">•</span>
                                <span className="flex items-center gap-1 text-xs text-slate-500 font-light">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{article.reading_time || '4 min read'}</span>
                                </span>
                                <span className="text-xs text-slate-300">•</span>
                                <span className="flex items-center gap-1 text-xs text-slate-500 font-light">
                                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{article.views?.toLocaleString() || 0} pembaca</span>
                                </span>
                            </div>

                            {/* Title (Thin & Elegant Raleway) */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal text-slate-900 tracking-tight leading-snug">
                                {article.title}
                            </h1>

                            {/* Subtitle */}
                            {article.subtitle && (
                                <p className="text-slate-600 text-sm sm:text-base lg:text-lg font-light leading-relaxed">
                                    {article.subtitle}
                                </p>
                            )}
                        </div>

                        {/* Author & Share Bar */}
                        <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            
                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#800020] text-white font-normal flex items-center justify-center shadow-xs">
                                    {authorName.charAt(0)}
                                </div>
                                <div>
                                    <span className="text-xs font-normal text-slate-900 block">
                                        {authorName}
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-light block">
                                        {authorRole}
                                    </span>
                                </div>
                            </div>

                            {/* Share Buttons */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-light mr-1 flex items-center gap-1">
                                    <Share2 className="w-3.5 h-3.5" />
                                    <span>Bagikan:</span>
                                </span>

                                <button
                                    type="button"
                                    onClick={handleWhatsAppShare}
                                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-normal transition-colors cursor-pointer shadow-xs"
                                >
                                    WhatsApp
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCopyLink}
                                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-normal transition-colors cursor-pointer shadow-xs"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                            <span className="text-emerald-700">Tersalin!</span>
                                        </>
                                    ) : (
                                        <span>Salin Link</span>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* 2-Column Main Reading Grid + Sticky Editorial Sidebar */}
                    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            
                            {/* Left Column (8 Cols) - Article Body & Content */}
                            <article className="lg:col-span-8 space-y-10">
                                
                                {/* Featured Cover Banner */}
                                <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-sm">
                                    <img
                                        src={article.image || '/images/hero.webp'}
                                        alt={article.title}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>

                                {/* Article Body Content (Prose Styled with Thin Headings) */}
                                <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-xs space-y-8">
                                    <div 
                                        className="article-content tiptap-content"
                                        dangerouslySetInnerHTML={{ __html: article.content }}
                                    />

                                    {/* Bottom Author Bio Box */}
                                    <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
                                        <div className="space-y-1">
                                            <span className="text-xs font-normal text-slate-900 block">Ditulis oleh {authorName}</span>
                                            <p className="text-xs text-slate-600 font-light leading-relaxed">
                                                Tim editorial Dancell Indonesia yang berdedikasi menyajikan wawasan gadget terpercaya dan edukasi garansi resmi di Jawa Timur.
                                            </p>
                                        </div>

                                        <Link
                                            href="/#branches"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-normal transition-colors shrink-0 shadow-xs cursor-pointer"
                                        >
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>Kunjungi Outlet</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Related Articles Section */}
                                {relatedArticles.length > 0 && (
                                    <div className="space-y-6 pt-4">
                                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                                            <h3 className="text-lg sm:text-xl font-normal text-slate-900 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-[#800020]" />
                                                <span>Artikel Terkait Lainnya</span>
                                            </h3>
                                            <Link href="/artikel" className="text-xs font-normal text-[#800020] hover:underline flex items-center gap-1">
                                                <span>Lihat Semua</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                            {relatedArticles.map((rel) => (
                                                <Link
                                                    key={rel.id}
                                                    href={'/artikel/' + rel.slug}
                                                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-rose-200 transition-all p-4 flex flex-col justify-between space-y-3"
                                                >
                                                    <div className="space-y-2">
                                                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-100">
                                                            {rel.category}
                                                        </span>
                                                        <h4 className="text-xs sm:text-sm font-normal text-slate-900 group-hover:text-[#800020] transition-colors line-clamp-2 leading-snug">
                                                            {rel.title}
                                                        </h4>
                                                    </div>

                                                    <div className="text-[11px] text-slate-400 font-light flex items-center justify-between pt-2 border-t border-slate-100">
                                                        <span>{rel.published_at}</span>
                                                        <span>{rel.reading_time}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </article>

                            {/* Right Column (4 Cols) - Sticky Editorial Sidebar */}
                            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                                
                                {/* 1. CARD ARTIKEL TERBARU */}
                                {latestArticles.length > 0 && (
                                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                            <h4 className="text-sm font-normal text-slate-900 flex items-center gap-2">
                                                <Newspaper className="w-4 h-4 text-[#800020]" />
                                                <span>Artikel Terbaru</span>
                                            </h4>
                                            <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-100/80">
                                                Update Terkini
                                            </span>
                                        </div>

                                        {/* Scrollable Clean List */}
                                        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} className="max-h-[380px] sm:max-h-[400px] overflow-y-auto pr-2 sidebar-scroll overscroll-contain">
                                            <div className="divide-y divide-slate-100/90">
                                                {latestArticles.map((latest) => (
                                                    <Link
                                                        key={'latest-' + latest.id}
                                                        href={'/artikel/' + latest.slug}
                                                        className="group flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0 transition-all duration-200"
                                                    >
                                                        {/* Thumbnail */}
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 mt-0.5 border border-slate-100">
                                                            <img
                                                                src={latest.image || '/images/hero.webp'}
                                                                alt={latest.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>

                                                        <div className="space-y-1 min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-normal text-[#800020]">
                                                                    {latest.category}
                                                                </span>
                                                                <span className="text-[10px] text-slate-300">•</span>
                                                                <span className="text-[10px] text-slate-400 font-light">
                                                                    {latest.published_at}
                                                                </span>
                                                            </div>
                                                            <h5 className="text-xs sm:text-sm font-normal text-slate-800 group-hover:text-[#800020] transition-colors leading-snug line-clamp-2">
                                                                {latest.title}
                                                            </h5>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 3. CARD TOPIK POPULER (TAGS) */}
                                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                                    <h4 className="text-sm font-normal text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3.5">
                                        <Tag className="w-4 h-4 text-[#800020]" />
                                        <span>Topik Populer</span>
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(settings?.global_tags || ['Garansi Resmi', 'iPhone vs Android', 'Laptop Kuliah', 'Battery Health', 'Tukar Tambah', 'Promo Jatim', 'Kamera Flagship', 'Service Center']).map((tag, idx) => (
                                            <Link
                                                key={'tag-' + idx}
                                                href={'/artikel?q=' + encodeURIComponent(tag)}
                                                className="px-3 py-1.5 rounded-full bg-slate-100/70 hover:bg-rose-50 text-slate-600 hover:text-[#800020] text-xs font-light transition-colors border border-slate-200/60 cursor-pointer"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* 4. CARD KONSULTASI GADGET DANCELL */}
                                <div className="bg-gradient-to-br from-[#800020] to-[#4a0013] rounded-3xl p-6 text-white space-y-4 shadow-lg shadow-rose-950/20 relative overflow-hidden">
                                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                                    <div className="space-y-1.5 relative z-10">
                                        <span className="text-[11px] font-normal text-rose-200 tracking-wider uppercase">Layanan Pelanggan</span>
                                        <h4 className="text-base sm:text-lg font-normal text-white leading-snug">
                                            Butuh Rekomendasi Gadget yang Tepat?
                                        </h4>
                                        <p className="text-xs text-rose-100/80 font-light leading-relaxed">
                                            Konsultasikan kebutuhan gadget, tukar tambah, atau garansi resmi langsung dengan tim Dancell.
                                        </p>
                                    </div>
                                    <a
                                        href="https://api.whatsapp.com/send?phone=6281234567890&text=Halo%20Dancell,%20saya%20ingin%20konsultasi%20gadget"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white hover:bg-rose-50 text-[#800020] text-xs font-normal transition-all shadow-xs relative z-10 cursor-pointer"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>Chat WhatsApp Resmi</span>
                                    </a>
                                </div>

                            </aside>

                        </div>
                    </div>

                </main>

                {/* Footer Section */}
                <ContactFooter footer={footer} />

            </div>
        </ReactLenis>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Layers, 
    Award, 
    Save, 
    CheckCircle2, 
    Eye, 
    Plus, 
    Trash2, 
    Sparkles, 
    Upload, 
    ImageIcon, 
    X,
    ExternalLink
} from 'lucide-react';

export default function HistoryTimelineSetting({ historyTimeline, status }) {
    const { data, setData, post, processing } = useForm({
        header_badge: historyTimeline?.header_badge || 'Perjalanan & Rekam Jejak',
        header_title: historyTimeline?.header_title || 'Sejarah Pertumbuhan Dancell',
        header_description: historyTimeline?.header_description || 'Dari toko pertama di Warujayeng pada tahun 2008, bertransformasi menjadi jaringan ritel 58 cabang terdepan di Jawa Timur.',
        milestones: Array.isArray(historyTimeline?.milestones) && historyTimeline.milestones.length > 0
            ? historyTimeline.milestones
            : [
                {
                    id: 'ms-2008',
                    year: '2008',
                    title: 'Kelahiran Toko Pertama di Warujayeng',
                    subtitle: 'Awal Mula Perjalanan Ritel Gadget Terpercaya',
                    desc: 'Dancell pertama kali didirikan di Warujayeng, Nganjuk. Dimulai dari toko ritel sederhana dengan satu visi utama: menyediakan ponsel original dengan harga jujur serta pelayanan yang ramah dan bersahaja kepada masyarakat.',
                    stat_badge: 'Toko Pertama',
                    stat_label: 'Warujayeng, Nganjuk',
                    highlight_tag: '100% Produk Original',
                    image: '/images/hero.webp',
                    current: false,
                },
                {
                    id: 'ms-2015',
                    year: '2012 - 2015',
                    title: 'Pembukaan Dancell 2 & Penguatan Fondasi',
                    subtitle: 'Ekspansi Tahap Awal & Standar Layanan Unggul',
                    desc: 'Tingginya antusiasme dan kepercayaan pelanggan mendorong pembukaan cabang Dancell 2. Kapasitas tim diperkuat melalui standarisasi pelayanan terstruktur, penyediaan garansi resmi, dan komitmen purnajual prima.',
                    stat_badge: 'Dancell 2',
                    stat_label: 'Cabang Kedua Dibuka',
                    highlight_tag: 'Standar Operasional Ritel',
                    image: '/images/smartphone_hero.png',
                    current: false,
                },
                {
                    id: 'ms-2018',
                    year: '2018',
                    title: 'Era Transformasi & Standarisasi Modern',
                    subtitle: 'Penerapan Sistem Digital & Seragam Profesional',
                    desc: 'Dancell berevolusi menerapkan tata kelola toko ritel modern dengan seragam profesional khas Dancell, standarisasi tata letak toko yang nyaman, serta integrasi teknologi stok untuk menyambut lonjakan tren smartphone di Jawa Timur.',
                    stat_badge: 'Ritel Modern',
                    stat_label: 'Sistem Manajemen Digital',
                    highlight_tag: 'Standar Pelayanan Konsisten',
                    image: '/images/hero.webp',
                    current: false,
                },
                {
                    id: 'ms-2022',
                    year: '2020 - 2022',
                    title: 'Ekspansi Masif Kediri Raya & Mataraman',
                    subtitle: 'Menembus 34 Outlet di Berbagai Wilayah Strategis',
                    desc: 'Strategi ekspansi multi-cabang terstruktur menjangkau Kediri, Mojoroto, Srengat Blitar, hingga Magetan. Dancell resmi menjadi rujukan utama masyarakat dengan ketersediaan produk brand global terlengkap.',
                    stat_badge: '34 Cabang',
                    stat_label: 'Kediri, Blitar, Magetan',
                    highlight_tag: 'Apple, Samsung, Xiaomi, Oppo, Vivo',
                    image: '/images/smartphone_hero.png',
                    current: false,
                },
                {
                    id: 'ms-2025',
                    year: '2023 - 2025',
                    title: 'Penetrasi Jaringan Menyeluruh Jawa Timur',
                    subtitle: 'Jangkauan Menembus 53 Outlet Aktif',
                    desc: 'Dancell memperluas penetrasi ke kawasan Uteran, Mojosari, Jombang, hingga Sidoarjo. Penguatan rantai pasok dan sinergi promosi digital menjadikan Dancell destinasi belanja gadget nomor satu di Jawa Timur.',
                    stat_badge: '53 Cabang',
                    stat_label: 'Jangkauan Luas Jawa Timur',
                    highlight_tag: 'Ready Stock Semua Tipe',
                    image: '/images/hero.webp',
                    current: false,
                },
                {
                    id: 'ms-2026',
                    year: '2026',
                    title: '58 Outlet Aktif — Pemimpin Ritel Jatim',
                    subtitle: 'Jaringan Outlet Gadget Terbesar di Jawa Timur',
                    desc: 'Kondisi terkini dengan 58 outlet aktif yang tersebar di Nganjuk, Kediri, Blitar, Jombang, Mojokerto, Sidoarjo, dan sekitarnya. Terus melangkah maju memberikan pengalaman belanja gadget terbaik bergaransi resmi.',
                    stat_badge: '58 Outlet Aktif',
                    stat_label: 'Kondisi Terkini di Jawa Timur',
                    highlight_tag: 'Garansi Resmi Indonesia',
                    image: '/images/hero.webp',
                    current: true,
                },
            ],
        expansions: [],
    });

    const [previewIdx, setPreviewIdx] = useState(0);
    const cardRefs = useRef([]);

    // SCROLL SPY: Automatically sync sticky live preview card when scrolling form cards
    useEffect(() => {
        const handleScroll = () => {
            const viewportCenter = window.innerHeight * 0.42; // Focal focus line
            let bestIdx = 0;
            let minDistance = Infinity;

            cardRefs.current.forEach((el, idx) => {
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;
                const distance = Math.abs(elementCenter - viewportCenter);

                // If card is in viewport or closest to focal center
                if (rect.top <= viewportCenter + 150 && rect.bottom >= viewportCenter - 150) {
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestIdx = idx;
                    }
                }
            });

            if (minDistance !== Infinity) {
                setPreviewIdx(bestIdx);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [data.milestones.length]);

    const sectionTabs = [
        { id: 'hero', label: 'Hero Section', href: route('admin.content.hero'), active: true },
        { id: 'visi-misi', label: 'Visi & Misi', href: route('admin.content.visi-misi'), active: true },
        { id: 'history', label: 'Sejarah & Timeline', href: route('admin.content.history'), active: true },
        { id: 'mitra', label: 'Mitra & Brand', href: route('admin.content.mitra'), active: true },
        { id: 'footer', label: 'Footer & Kontak', href: route('admin.content.footer'), active: true },
        { id: 'tentang', label: 'Tentang Kami', active: false },
    ];

    const handleAddMilestone = () => {
        const newId = 'ms-' + Date.now();
        const newMs = {
            id: newId,
            year: 'Tahun Baru',
            title: 'Judul Momen Era Baru',
            subtitle: 'Keterangan Singkat Era',
            desc: 'Tuliskan cerita dan pencapaian pada era ini...',
            stat_badge: 'Pencapaian',
            stat_label: 'Keterangan Metrik',
            highlight_tag: '100% Produk Original',
            highlight_label: 'Garansi Resmi Indonesia',
            image: '/images/hero.webp',
            current: false,
        };
        setData('milestones', [...data.milestones, newMs]);
        setPreviewIdx(data.milestones.length);
    };

    const handleRemoveMilestone = (idxToRemove) => {
        setData('milestones', data.milestones.filter((_, idx) => idx !== idxToRemove));
        if (previewIdx >= data.milestones.length - 1) {
            setPreviewIdx(Math.max(0, data.milestones.length - 2));
        }
    };

    const handleUpdateMilestone = (index, field, value) => {
        const updated = [...data.milestones];
        updated[index][field] = value;
        setData('milestones', updated);
    };

    const handleImageUpload = (index, file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            handleUpdateMilestone(index, 'image', reader.result);
        };
        reader.readAsDataURL(file);
    };

    const scrollToEraCard = (index) => {
        setPreviewIdx(index);
        const targetEl = cardRefs.current[index];
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.content.history.update'));
    };

    const currentActivePreview = data.milestones[previewIdx] || data.milestones[0];

    return (
        <AdminLayout activeMenu="content-hero">
            <Head title="Kelola Content Web — Sejarah & Timeline" />

            <div className="font-['Raleway'] space-y-6">
                
                {/* Header Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-100 text-xs font-normal mb-1">
                            <Layers className="w-3.5 h-3.5 text-[#800020]" />
                            <span>Pengaturan Content Website</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight font-['Raleway']">
                            Kelola Tampilan Halaman Depan
                        </h1>
                        <p className="text-xs text-slate-500 font-normal">
                            Atur teks, tombol CTA, link navigasi, dan ikon SVG pada landing page Dancell.
                        </p>
                    </div>

                    <a
                        href="/#history"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-normal hover:bg-slate-800 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
                    >
                        <span>Pratinjau Landing Page</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* Navigation Tabs Bar */}
                <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 overflow-x-auto [scrollbar-width:none]">
                    {sectionTabs.map((tab) =>
                        tab.href ? (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all min-w-max cursor-pointer ${
                                    tab.id === 'history'
                                        ? 'bg-[#800020] text-white shadow-xs font-semibold'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                {tab.label}
                            </Link>
                        ) : (
                            <span
                                key={tab.id}
                                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 min-w-max flex items-center gap-1.5 cursor-not-allowed opacity-60"
                            >
                                <span>{tab.label}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">Segera</span>
                            </span>
                        )
                    )}
                </div>

                {status && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{status}</span>
                    </div>
                )}

                {/* Main Content Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: EDIT FORM (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* 1. Header Section Info */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <Award className="w-4 h-4 text-[#800020]" />
                                <span>Informasi Header Section</span>
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Badge Header
                                    </label>
                                    <input
                                        type="text"
                                        value={data.header_badge}
                                        onChange={(e) => setData('header_badge', e.target.value)}
                                        className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-colors"
                                        placeholder="Contoh: Perjalanan & Rekam Jejak"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Judul Utama Sejarah
                                    </label>
                                    <input
                                        type="text"
                                        value={data.header_title}
                                        onChange={(e) => setData('header_title', e.target.value)}
                                        className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-colors"
                                        placeholder="Contoh: Sejarah Pertumbuhan Dancell"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Deskripsi Subtitle Header
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.header_description}
                                        onChange={(e) => setData('header_description', e.target.value)}
                                        className="w-full text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-colors"
                                        placeholder="Deskripsi ringkas perjalanan..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Unified Era Milestones List */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#800020]" />
                                        <span>Daftar Era & Story Milestone ({data.milestones.length})</span>
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Scroll form ini, maka Live Preview di kanan otomatis menyelaraskan era yang aktif.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddMilestone}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#800020] text-xs font-bold transition-colors cursor-pointer border border-rose-200"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Era</span>
                                </button>
                            </div>

                            <div className="space-y-5">
                                {data.milestones.map((item, index) => (
                                    <div 
                                        key={item.id || index}
                                        ref={(el) => (cardRefs.current[index] = el)}
                                        onFocus={() => setPreviewIdx(index)}
                                        onClick={() => setPreviewIdx(index)}
                                        className={'p-5 rounded-2xl border transition-all duration-300 space-y-4 ' + (
                                            previewIdx === index
                                                ? 'bg-rose-50/50 border-[#800020] shadow-md ring-2 ring-[#800020]/20'
                                                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                                        )}
                                    >
                                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewIdx(index)}
                                                    className={'px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ' + (
                                                        previewIdx === index
                                                            ? 'bg-[#800020] text-white shadow-xs'
                                                            : 'bg-slate-200 text-slate-700 hover:bg-[#800020] hover:text-white'
                                                    )}
                                                    title="Klik untuk preview era ini"
                                                >
                                                    ERA {item.year || (index + 1)}
                                                </button>
                                                <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">
                                                    {item.title || 'Momen Baru'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.current || false}
                                                        onChange={(e) => handleUpdateMilestone(index, 'current', e.target.checked)}
                                                        className="rounded text-[#800020] focus:ring-[#800020]"
                                                    />
                                                    <span>Era Terkini</span>
                                                </label>

                                                {data.milestones.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMilestone(index)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                        title="Hapus Era"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                    Tahun / Rentang Era
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.year}
                                                    onChange={(e) => handleUpdateMilestone(index, 'year', e.target.value)}
                                                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                    placeholder="Contoh: 2008 atau 2020 - 2022"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                    Judul Utama Era
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleUpdateMilestone(index, 'title', e.target.value)}
                                                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                    placeholder="Judul momen bersejarah..."
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                    Sub-Judul / Keterangan Singkat
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.subtitle || ''}
                                                    onChange={(e) => handleUpdateMilestone(index, 'subtitle', e.target.value)}
                                                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                    placeholder="Contoh: Awal Mula Perjalanan Ritel Gadget Terpercaya"
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                    Paragraf Narasi Cerita
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={item.desc}
                                                    onChange={(e) => handleUpdateMilestone(index, 'desc', e.target.value)}
                                                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white leading-relaxed focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                    placeholder="Ceritakan detail perjalanan pada era ini..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                    Metrik Kiri (Nilai)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.stat_badge || ''}
                                                    onChange={(e) => handleUpdateMilestone(index, 'stat_badge', e.target.value)}
                                                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                    placeholder="Contoh: Toko Pertama / 58 Cabang"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                    Metrik Kiri (Label Wilayah)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.stat_label || ''}
                                                    onChange={(e) => handleUpdateMilestone(index, 'stat_label', e.target.value)}
                                                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                    placeholder="Contoh: Warujayeng / Jawa Timur"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                    Metrik Kanan (Highlight / Nilai)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.highlight_tag || ''}
                                                    onChange={(e) => handleUpdateMilestone(index, 'highlight_tag', e.target.value)}
                                                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                    placeholder="Contoh: Apple, Samsung, Xiaomi / 100% Resmi"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                                    Metrik Kanan (Keterangan / Deskripsi Bawah)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.highlight_label || ''}
                                                    onChange={(e) => handleUpdateMilestone(index, 'highlight_label', e.target.value)}
                                                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                    placeholder="Contoh: Garansi Resmi Indonesia / Mitra Terpercaya"
                                                />
                                            </div>

                                            {/* DYNAMIC IMAGE UPLOADER PER ERA */}
                                            <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-1.5">
                                                    <ImageIcon className="w-3.5 h-3.5 text-[#800020]" />
                                                    <span>Gambar Dokumentasi Era Ini</span>
                                                </label>

                                                <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                                                    {item.image ? (
                                                        <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shrink-0 shadow-xs">
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.title} 
                                                                className="w-full h-full object-cover object-center" 
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUpdateMilestone(index, 'image', '')}
                                                                className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 cursor-pointer shadow-xs"
                                                                title="Hapus Gambar"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="w-20 h-14 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                                            <ImageIcon className="w-6 h-6" />
                                                        </div>
                                                    )}

                                                    <div className="space-y-1">
                                                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-[#800020] text-slate-700 hover:text-[#800020] bg-white text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                                                            <Upload className="w-3.5 h-3.5" />
                                                            <span>{item.image ? 'Ganti Foto Era Ini' : 'Upload Foto Era Ini'}</span>
                                                            <input 
                                                                type="file" 
                                                                accept="image/*" 
                                                                className="hidden" 
                                                                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                                            />
                                                        </label>
                                                        <p className="text-[10px] text-slate-400 font-light block">
                                                            Format: JPG, PNG, WebP (Tersimpan otomatis ke database)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}

                                {/* Add New Milestone Era Button */}
                                <button
                                    type="button"
                                    onClick={handleAddMilestone}
                                    className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#800020] text-slate-500 hover:text-[#800020] bg-white hover:bg-rose-50/30 transition-all font-medium text-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Tambah Era Sejarah Baru</span>
                                </button>
                            </div>
                        </div>

                        {/* Save Sticky Action Bar for Story Section */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center justify-between">
                            <div className="text-xs text-slate-500">
                                Total Era Tersimpan: <strong className="text-slate-800">{data.milestones.length} Era</strong>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all disabled:opacity-50 cursor-pointer"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>{processing ? 'Menyimpan Perubahan...' : 'Simpan Semua Era'}</span>
                            </button>
                        </div>

                    </div>

                    {/* ======================================================== */}
                    {/* RIGHT COLUMN: STICKY INTERACTIVE REALTIME PREVIEW (40%)  */}
                    {/* ======================================================== */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-6 bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6 overflow-hidden relative">
                            
                            {/* SEAMLESS BACKGROUND IMAGE WITH DEEP DARK GRADIENT */}
                            {currentActivePreview?.image && (
                                <div 
                                    key={'bg-img-' + (currentActivePreview?.id || previewIdx)}
                                    className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ease-out"
                                >
                                    <img 
                                        src={currentActivePreview.image} 
                                        alt={currentActivePreview.title} 
                                        className="w-full h-full object-cover object-center filter brightness-90 contrast-105" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/92 via-slate-950/85 to-slate-950/75 z-10" />
                                </div>
                            )}

                            {/* Ambient Lighting in Preview */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#800020]/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

                            {/* Top Indicator */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-20">
                                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-300 font-bold flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Pratinjau Realtime</span>
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">
                                    0{previewIdx + 1} / 0{data.milestones.length}
                                </span>
                            </div>

                            {/* Preview Card Content (Keyed for smooth fade transition on change) */}
                            <div 
                                key={'content-' + (currentActivePreview?.id || previewIdx)}
                                className="space-y-4 relative z-20 min-h-[300px] animate-fadeIn"
                            >
                                
                                {/* Badge & Era Pill */}
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-rose-200 text-[10px] font-medium backdrop-blur-xs">
                                        {data.header_badge}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-[#800020]/40 border border-rose-400/30 text-rose-200 text-[10px] font-mono font-bold backdrop-blur-xs">
                                        ERA {currentActivePreview?.year}
                                    </span>
                                </div>

                                {/* Title & Subtitle */}
                                <div className="space-y-1">
                                    <h3 className="text-xl font-normal text-white tracking-tight leading-snug">
                                        {currentActivePreview?.title}
                                    </h3>
                                    <p className="text-xs font-light text-rose-200/80">
                                        {currentActivePreview?.subtitle}
                                    </p>
                                </div>

                                {/* Narrative Description */}
                                <p className="text-xs font-light text-slate-300/90 leading-relaxed">
                                    {currentActivePreview?.desc}
                                </p>

                                {/* 2-Column Minimalist Metrics */}
                                <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0" />
                                        <div>
                                            <span className="font-normal text-white block text-sm font-['Raleway']">
                                                {currentActivePreview?.stat_badge || 'Toko Utama'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-light block">
                                                {currentActivePreview?.stat_label || 'Wilayah'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 border-l border-white/10 pl-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                                        <div>
                                            <span className="font-normal text-white block text-sm font-['Raleway']">
                                                {currentActivePreview?.highlight_tag || '100% Resmi'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-light block">
                                                {currentActivePreview?.highlight_label || 'Garansi Resmi Indonesia'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Preview Dot Slider Controls with Click-to-Scroll */}
                            <div className="flex items-center justify-between border-t border-white/10 pt-4 relative z-20">
                                <span className="text-[11px] text-slate-400 font-light">
                                    Beralih era (Klik / Scroll Form):
                                </span>

                                <div className="flex items-center gap-1.5 bg-slate-900/60 border border-white/10 rounded-full px-3 py-2 backdrop-blur-md">
                                    {data.milestones.map((_, idx) => (
                                        <button
                                            key={'dot-prev-' + idx}
                                            type="button"
                                            onClick={() => scrollToEraCard(idx)}
                                            className={'rounded-full transition-all cursor-pointer ' + (
                                                previewIdx === idx
                                                    ? 'w-6 h-1.5 bg-gradient-to-r from-rose-400 to-amber-300 shadow-xs shadow-rose-500/40'
                                                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/70'
                                            )}
                                            title={'Lihat era ke-' + (idx + 1)}
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}

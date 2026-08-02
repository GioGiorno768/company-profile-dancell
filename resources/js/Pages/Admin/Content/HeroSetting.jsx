import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Layers, 
    Sparkles, 
    Save, 
    CheckCircle2, 
    Eye, 
    ExternalLink, 
    Store, 
    Info
} from 'lucide-react';

export default function HeroSetting({ hero, status }) {
    const [activeTab, setActiveTab] = useState('hero');

    const { data, setData, post, processing } = useForm({
        badge_text: hero?.badge_text || 'Pusat Ritel Gadget, Laptop & Aksesori — 56 Outlet Jawa Timur',
        badge_icon_svg: hero?.badge_icon_svg || '',
        title: hero?.title || 'Pusat Ritel Gadget & Laptop, Terlengkap & Bergaransi Resmi',
        description: hero?.description || 'Dancell (Dan Group) adalah jaringan ritel gadget, smartphone, laptop, hingga aksesori terlengkap di Jawa Timur. Berdiri sejak 2008, kini siap melayani Anda di 56 outlet resmi dengan jaminan 100% original, garansi resmi, dan tukar tambah tepercaya.',
        primary_btn_text: hero?.primary_btn_text || 'Temukan Outlet Terdekat',
        primary_btn_link: hero?.primary_btn_link || '#branches',
        primary_btn_icon_svg: hero?.primary_btn_icon_svg || '',
        secondary_btn_text: hero?.secondary_btn_text || 'Katalog Produk & Brand',
        secondary_btn_link: hero?.secondary_btn_link || '#products',
        secondary_btn_icon_svg: hero?.secondary_btn_icon_svg || '',
        feature_1_text: hero?.feature_1_text || '100% Garansi Resmi',
        feature_1_icon_svg: hero?.feature_1_icon_svg || '',
        feature_2_text: hero?.feature_2_text || 'Gadget, Laptop & Aksesori',
        feature_2_icon_svg: hero?.feature_2_icon_svg || '',
        feature_3_text: hero?.feature_3_text || '56 Outlet Jawa Timur',
        feature_3_icon_svg: hero?.feature_3_icon_svg || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.content.hero.update'));
    };

    const sectionTabs = [
        { id: 'hero', label: 'Hero Section', href: route('admin.content.hero'), active: true },
        { id: 'visi-misi', label: 'Visi & Misi', href: route('admin.content.visi-misi'), active: true },
        { id: 'history', label: 'Sejarah & Timeline', href: route('admin.content.history'), active: true },
        { id: 'mitra', label: 'Mitra & Brand', href: route('admin.content.mitra'), active: true },
        { id: 'footer', label: 'Footer & Kontak', href: route('admin.content.footer'), active: true },
        { id: 'tentang', label: 'Tentang Kami', active: false },
    ];

    return (
        <AdminLayout activeMenu="content-hero">
            <Head title="Kelola Content Web — Hero Section" />

            <div className="font-['Raleway']">
                
                {/* Header Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
                    >
                        <span>Pratinjau Landing Page</span>
                        <ExternalLink className="w-3.5 h-3.5 text-rose-300" />
                    </a>
                </div>

                {/* Sub-Header Top Menu Bar (Fixed Sticky Bar Flush at Top of Main Viewport) */}
                <div className="sticky top-[56px] z-30 bg-slate-50/95 backdrop-blur-md py-3 -mx-6 sm:-mx-8 px-6 sm:px-8 border-b border-slate-200/80 mb-6 shadow-2xs">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-2xs overflow-x-auto">
                        <div className="flex items-center gap-1 min-w-max">
                            {sectionTabs.map((tab) => (
                                tab.href ? (
                                    <Link
                                        key={tab.id}
                                        href={tab.href}
                                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                                            tab.id === 'hero'
                                                ? 'bg-[#800020] text-white shadow-xs font-semibold'
                                                : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                    </Link>
                                ) : (
                                    <button
                                        key={tab.id}
                                        disabled
                                        className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 bg-slate-50 cursor-not-allowed opacity-60 flex items-center gap-2"
                                    >
                                        <span>{tab.label}</span>
                                        <span className="px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-600 text-[9px] font-mono">
                                            Segera
                                        </span>
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Notification */}
                {status && (
                    <div className="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{status}</span>
                    </div>
                )}

                {/* Split Grid: Form Controls (Left) & Live Preview (Right) */}
                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Form Controls (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Section 1: Badge Top Bar */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway'] flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#800020]" />
                                    <span>Top Badge (Pita Informasi Atas)</span>
                                </h3>
                                <p className="text-xs text-slate-500">Teks kecil melayang di bagian paling atas Hero Section.</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Teks Badge Top Bar
                                    </label>
                                    <input
                                        type="text"
                                        value={data.badge_text}
                                        onChange={(e) => setData('badge_text', e.target.value)}
                                        placeholder="Pusat Ritel Gadget, Laptop & Aksesori — 56 Outlet Jawa Timur"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center justify-between">
                                        <span>Kode SVG Ikon Badge (Opsional)</span>
                                        <span className="text-[10px] text-slate-400 font-mono">Format &lt;svg...&gt;</span>
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.badge_icon_svg}
                                        onChange={(e) => setData('badge_icon_svg', e.target.value)}
                                        placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...></svg>'
                                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-[11px] font-mono text-slate-800 placeholder-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Main Heading & Copy */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway']">
                                    Judul Utama & Deskripsi Singkat
                                </h3>
                                <p className="text-xs text-slate-500">Pesan utama penawaran ritel toko Dancell.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Judul Utama (Title Heading)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Pusat Ritel Gadget & Laptop, Terlengkap & Bergaransi Resmi"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs font-semibold text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Paragraf Deskripsi (Subtitle)
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Dancell (Dan Group) adalah jaringan ritel gadget..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs text-slate-900 leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Button CTA 1 & 2 Controls */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway']">
                                    Tombol Aksi (CTA 1 & CTA 2)
                                </h3>
                                <p className="text-xs text-slate-500">Atur teks, link tujuan, dan ikon SVG dari kedua tombol utama.</p>
                            </div>

                            {/* CTA 1 Primary Button */}
                            <div className="space-y-3 p-4 rounded-2xl bg-rose-50/40 border border-rose-100">
                                <span className="text-xs font-bold text-[#800020]">Tombol CTA Utama (Primary)</span>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-medium text-slate-700 mb-1">Teks Tombol</label>
                                        <input
                                            type="text"
                                            value={data.primary_btn_text}
                                            onChange={(e) => setData('primary_btn_text', e.target.value)}
                                            placeholder="Temukan Outlet Terdekat"
                                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-medium text-slate-700 mb-1">Link URL (# / URL)</label>
                                        <input
                                            type="text"
                                            value={data.primary_btn_link}
                                            onChange={(e) => setData('primary_btn_link', e.target.value)}
                                            placeholder="#branches"
                                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-mono"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Kode SVG Ikon CTA 1 (Opsional)</label>
                                    <textarea
                                        rows={2}
                                        value={data.primary_btn_icon_svg}
                                        onChange={(e) => setData('primary_btn_icon_svg', e.target.value)}
                                        placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...></svg>'
                                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-800 placeholder-slate-400"
                                    />
                                </div>
                            </div>

                            {/* CTA 2 Secondary Button */}
                            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                <span className="text-xs font-bold text-slate-800">Tombol CTA Sekunder (Secondary)</span>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-medium text-slate-700 mb-1">Teks Tombol</label>
                                        <input
                                            type="text"
                                            value={data.secondary_btn_text}
                                            onChange={(e) => setData('secondary_btn_text', e.target.value)}
                                            placeholder="Katalog Produk & Brand"
                                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-medium text-slate-700 mb-1">Link URL (# / URL)</label>
                                        <input
                                            type="text"
                                            value={data.secondary_btn_link}
                                            onChange={(e) => setData('secondary_btn_link', e.target.value)}
                                            placeholder="#products"
                                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-mono"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Kode SVG Ikon CTA 2 (Opsional)</label>
                                    <textarea
                                        rows={2}
                                        value={data.secondary_btn_icon_svg}
                                        onChange={(e) => setData('secondary_btn_icon_svg', e.target.value)}
                                        placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...></svg>'
                                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-800 placeholder-slate-400"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Section 4: 3 Feature Highlights */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway']">
                                    3 Poin Keunggulan (Bottom Highlights)
                                </h3>
                                <p className="text-xs text-slate-500">Teks & ikon di bagian paling bawah Hero Section.</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Keunggulan 1</label>
                                    <input
                                        type="text"
                                        value={data.feature_1_text}
                                        onChange={(e) => setData('feature_1_text', e.target.value)}
                                        placeholder="100% Garansi Resmi"
                                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Keunggulan 2</label>
                                    <input
                                        type="text"
                                        value={data.feature_2_text}
                                        onChange={(e) => setData('feature_2_text', e.target.value)}
                                        placeholder="Gadget, Laptop & Aksesori"
                                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Keunggulan 3</label>
                                    <input
                                        type="text"
                                        value={data.feature_3_text}
                                        onChange={(e) => setData('feature_3_text', e.target.value)}
                                        placeholder="56 Outlet Jawa Timur"
                                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#800020] hover:bg-[#5c0017] text-white font-medium text-xs shadow-lg shadow-rose-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Menyimpan Perubahan...' : 'Simpan Konten Hero Section'}</span>
                            </button>
                        </div>

                    </div>

                    {/* Right Column: Realtime Live Preview Card (Sticky Desktop Floating) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-[130px] space-y-4">
                        
                        <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                                <span className="flex items-center gap-1.5 font-medium text-rose-300">
                                    <Eye className="w-4 h-4" />
                                    <span>Pratinjau Hero Realtime</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30 font-mono">
                                    Live Draft
                                </span>
                            </div>

                            {/* Simulated Hero Section Box */}
                            <div className="rounded-2xl bg-gradient-to-br from-[#4a0012] via-[#800020] to-[#5c0017] p-5 text-white space-y-4 relative overflow-hidden border border-white/10 shadow-inner">
                                
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] text-rose-100 font-normal">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    <span>{data.badge_text || 'Top Badge Bar...'}</span>
                                </div>

                                {/* Title */}
                                <h4 className="text-lg font-semibold font-['Raleway'] leading-tight text-white">
                                    {data.title || 'Judul Utama Hero...'}
                                </h4>

                                {/* Description */}
                                <p className="text-[11px] text-rose-100/90 font-normal leading-relaxed line-clamp-3">
                                    {data.description || 'Deskripsi Hero Section...'}
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <div className="px-3 py-1.5 rounded-lg bg-white text-[#800020] font-semibold text-[10px] flex items-center gap-1 shadow-xs">
                                        <span>{data.primary_btn_text || 'Tombol 1'}</span>
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white font-medium text-[10px] flex items-center gap-1">
                                        <span>{data.secondary_btn_text || 'Tombol 2'}</span>
                                    </div>
                                </div>

                                {/* Bottom Features */}
                                <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2 text-[9px] text-rose-200">
                                    <span>✓ {data.feature_1_text}</span>
                                    <span>✓ {data.feature_2_text}</span>
                                    <span>✓ {data.feature_3_text}</span>
                                </div>

                            </div>
                        </div>

                        {/* Informational Hint */}
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                            <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                                <Info className="w-4 h-4 text-amber-700" />
                                <span>Petunjuk Format SVG:</span>
                            </div>
                            <p className="text-[11px] text-amber-800/90 leading-relaxed font-normal">
                                Kode SVG dapat di-copy paste langsung dari Figma / Lucide / Iconify. Jika kolom SVG dikosongkan, sistem akan otomatis memakai ikon default yang serasi.
                            </p>
                        </div>

                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}

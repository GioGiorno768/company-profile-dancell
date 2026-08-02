import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Layers, 
    Target, 
    Save, 
    CheckCircle2, 
    Eye, 
    ExternalLink, 
    Plus, 
    Trash2, 
    Sparkles, 
    ShieldCheck, 
    Users, 
    HeartHandshake, 
    Award,
    Info
} from 'lucide-react';
import DynamicIcon from '@/Components/Common/DynamicIcon';

export default function VisiMisiSetting({ visiMisi, status }) {
    const { data, setData, post, processing } = useForm({
        header_badge: visiMisi?.header_badge || 'Komitmen & Landasan Perusahaan',
        header_title: visiMisi?.header_title || 'Visi & Misi Dancell',
        header_description: visiMisi?.header_description || 'Landasan utama yang menuntun langkah Dancell sejak 2008 dalam memberikan dampak positif bagi seluruh masyarakat.',
        visi_badge: visiMisi?.visi_badge || 'Visi Perusahaan',
        visi_badge_icon_svg: visiMisi?.visi_badge_icon_svg || '',
        visi_title: visiMisi?.visi_title || '"Mewujudkan perusahaan yang bermanfaat dan berdaya saing, mampu bertahan dan mengedepankan kualitas, serta kesejahteraan berkelanjutan untuk sesama."',
        visi_pillar_1_text: visiMisi?.visi_pillar_1_text || 'Kualitas Terbaik',
        visi_pillar_1_icon_svg: visiMisi?.visi_pillar_1_icon_svg || '',
        visi_pillar_2_text: visiMisi?.visi_pillar_2_text || 'Daya Saing Tinggi',
        visi_pillar_2_icon_svg: visiMisi?.visi_pillar_2_icon_svg || '',
        visi_pillar_3_text: visiMisi?.visi_pillar_3_text || 'Kesejahteraan Berkelanjutan',
        visi_pillar_3_icon_svg: visiMisi?.visi_pillar_3_icon_svg || '',
        misi_items: visiMisi?.misi_items || [
            {
                id: 'misi-1',
                title: 'Manfaat Bagi Semua Pihak',
                desc: 'Memberikan manfaat berkelanjutan bagi pelanggan, karyawan, investor, dan masyarakat secara konsisten.',
                tag: 'Sosial & Ekonomi',
                icon_svg: '',
                highlight: false,
            },
            {
                id: 'misi-2',
                title: 'Pemimpin Pasar Ritel',
                desc: 'Mencapai kepuasan pelanggan/relasi maksimal, serta mengembangkan dan mempertahankan posisi sebagai pemimpin pasar di setiap kategori divisi usaha.',
                tag: 'Kualitas & Kepuasan',
                icon_svg: '',
                highlight: false,
            },
            {
                id: 'misi-3',
                title: 'Pemberdayaan Perempuan',
                desc: 'Misi khusus memberdayakan perempuan agar bisa berdikari, mandiri, dan memiliki penghasilan sendiri yang layak.',
                tag: 'Empowerment',
                icon_svg: '',
                highlight: true,
            },
        ],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.content.visi-misi.update'));
    };

    // Misi Card CRUD operations
    const handleAddMisi = () => {
        const newMisi = {
            id: `misi-${Date.now()}`,
            title: 'Misi Baru Dancell',
            desc: 'Deskripsi lengkap mengenai poin misi baru yang ingin dicapai oleh perusahaan.',
            tag: 'Strategi & Pertumbuhan',
            icon_svg: '',
            highlight: false,
        };
        setData('misi_items', [...data.misi_items, newMisi]);
    };

    const handleRemoveMisi = (indexToRemove) => {
        const updated = data.misi_items.filter((_, idx) => idx !== indexToRemove);
        setData('misi_items', updated);
    };

    const handleUpdateMisiField = (index, field, value) => {
        const updated = [...data.misi_items];
        updated[index] = { ...updated[index], [field]: value };
        setData('misi_items', updated);
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
            <Head title="Kelola Content Web — Visi & Misi" />

            <div className="font-['Raleway']">
                
                {/* Header Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-100 text-xs font-normal mb-1">
                            <Layers className="w-3.5 h-3.5 text-[#800020]" />
                            <span>Pengaturan Content Website</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight font-['Raleway']">
                            Kelola Visi & Misi Perusahaan
                        </h1>
                        <p className="text-xs text-slate-500 font-normal">
                            Atur teks visi utama, 3 pilar landasan, serta tambah/edit/hapus kartu poin misi secara dinamis.
                        </p>
                    </div>

                    <a
                        href="/#visimisi"
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
                                            tab.id === 'visi-misi'
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
                        
                        {/* Section 1: Header Titles */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway'] flex items-center gap-2">
                                    <Target className="w-4 h-4 text-[#800020]" />
                                    <span>Header Section (Judul Atas Visi Misi)</span>
                                </h3>
                                <p className="text-xs text-slate-500">Teks pembuka untuk section Visi & Misi Perusahaan.</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Badge Label Atas
                                    </label>
                                    <input
                                        type="text"
                                        value={data.header_badge}
                                        onChange={(e) => setData('header_badge', e.target.value)}
                                        placeholder="Komitmen & Landasan Perusahaan"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Judul Utama Section
                                    </label>
                                    <input
                                        type="text"
                                        value={data.header_title}
                                        onChange={(e) => setData('header_title', e.target.value)}
                                        placeholder="Visi & Misi Dancell"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs font-semibold text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Deskripsi Singkat Section
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.header_description}
                                        onChange={(e) => setData('header_description', e.target.value)}
                                        placeholder="Landasan utama yang menuntun langkah Dancell..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs text-slate-900 leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Visi Spotlight Card & Pillars */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway']">
                                    Visi Perusahaan & 3 Pilar Utama
                                </h3>
                                <p className="text-xs text-slate-500">Pernyataan visi utama dan 3 pilar sorotan di dalam spotlight card.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Label Badge Visi
                                        </label>
                                        <input
                                            type="text"
                                            value={data.visi_badge}
                                            onChange={(e) => setData('visi_badge', e.target.value)}
                                            placeholder="Visi Perusahaan"
                                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Kode SVG Ikon Badge (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.visi_badge_icon_svg}
                                            onChange={(e) => setData('visi_badge_icon_svg', e.target.value)}
                                            placeholder='<svg ...></svg>'
                                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-800"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Pernyataan Visi Utama (Visi Quote)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.visi_title}
                                        onChange={(e) => setData('visi_title', e.target.value)}
                                        placeholder='"Mewujudkan perusahaan yang bermanfaat...'
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs font-semibold text-slate-900"
                                    />
                                </div>

                                {/* 3 Visi Pillars */}
                                <div className="space-y-3 pt-2">
                                    <span className="text-xs font-bold text-slate-800 block">3 Pilar Landasan Visi:</span>
                                    
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={data.visi_pillar_1_text}
                                                onChange={(e) => setData('visi_pillar_1_text', e.target.value)}
                                                placeholder="Pilar 1: Kualitas Terbaik"
                                                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                                            />
                                            <input
                                                type="text"
                                                value={data.visi_pillar_1_icon_svg}
                                                onChange={(e) => setData('visi_pillar_1_icon_svg', e.target.value)}
                                                placeholder="SVG Ikon Pilar 1 (Opsional)"
                                                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={data.visi_pillar_2_text}
                                                onChange={(e) => setData('visi_pillar_2_text', e.target.value)}
                                                placeholder="Pilar 2: Daya Saing Tinggi"
                                                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                                            />
                                            <input
                                                type="text"
                                                value={data.visi_pillar_2_icon_svg}
                                                onChange={(e) => setData('visi_pillar_2_icon_svg', e.target.value)}
                                                placeholder="SVG Ikon Pilar 2 (Opsional)"
                                                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={data.visi_pillar_3_text}
                                                onChange={(e) => setData('visi_pillar_3_text', e.target.value)}
                                                placeholder="Pilar 3: Kesejahteraan Berkelanjutan"
                                                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                                            />
                                            <input
                                                type="text"
                                                value={data.visi_pillar_3_icon_svg}
                                                onChange={(e) => setData('visi_pillar_3_icon_svg', e.target.value)}
                                                placeholder="SVG Ikon Pilar 3 (Opsional)"
                                                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Section 3: Dynamic Misi Cards List (CRUD) */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 font-['Raleway']">
                                        Kartu Poin Misi Perusahaan (Dinamis)
                                    </h3>
                                    <p className="text-xs text-slate-500">Tambah, edit, atau hapus kartu poin misi perusahaan secara langsung.</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddMisi}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#800020] text-white text-xs font-semibold hover:bg-[#5c0017] transition-colors shadow-2xs cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Misi</span>
                                </button>
                            </div>

                            {/* Misi Items Accordion / List */}
                            <div className="space-y-4">
                                {data.misi_items.map((misi, index) => (
                                    <div
                                        key={misi.id || index}
                                        className={`p-5 rounded-2xl border transition-all duration-200 space-y-3 ${
                                            misi.highlight 
                                                ? 'bg-rose-50/50 border-rose-200 shadow-2xs' 
                                                : 'bg-slate-50/70 border-slate-200/80'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <span className="text-xs font-bold text-slate-900">
                                                    {misi.title || `Kartu Misi #${index + 1}`}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {/* Highlight Toggle */}
                                                <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!misi.highlight}
                                                        onChange={(e) => handleUpdateMisiField(index, 'highlight', e.target.checked)}
                                                        className="rounded border-slate-300 text-[#800020] focus:ring-[#800020] w-3.5 h-3.5"
                                                    />
                                                    <span>Highlight Card</span>
                                                </label>

                                                {/* Delete Button */}
                                                {data.misi_items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMisi(index)}
                                                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100/50 transition-colors"
                                                        title="Hapus Misi"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-medium text-slate-700 mb-1">Judul Misi</label>
                                                <input
                                                    type="text"
                                                    value={misi.title}
                                                    onChange={(e) => handleUpdateMisiField(index, 'title', e.target.value)}
                                                    placeholder="Judul Misi..."
                                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-semibold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-medium text-slate-700 mb-1">Tag Kategori (Badge Top)</label>
                                                <input
                                                    type="text"
                                                    value={misi.tag}
                                                    onChange={(e) => handleUpdateMisiField(index, 'tag', e.target.value)}
                                                    placeholder="Tag Misi (misal: Empowerment)"
                                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-medium text-slate-700 mb-1">Penjelasan Deskripsi Misi</label>
                                            <textarea
                                                rows={2}
                                                value={misi.desc}
                                                onChange={(e) => handleUpdateMisiField(index, 'desc', e.target.value)}
                                                placeholder="Deskripsi misi..."
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 leading-relaxed"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center justify-between">
                                                <span>Kode SVG Ikon (Opsional)</span>
                                                <span className="text-[10px] text-slate-400 font-mono">Format &lt;svg...&gt;</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={misi.icon_svg}
                                                onChange={(e) => handleUpdateMisiField(index, 'icon_svg', e.target.value)}
                                                placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...></svg>'
                                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-800"
                                            />
                                        </div>
                                    </div>
                                ))}
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
                                <span>{processing ? 'Menyimpan Perubahan...' : 'Simpan Konten Visi & Misi'}</span>
                            </button>
                        </div>

                    </div>

                    {/* Right Column: Realtime Live Preview Card (Sticky Desktop Floating) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-[130px] space-y-4">
                        
                        <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                                <span className="flex items-center gap-1.5 font-medium text-rose-300">
                                    <Eye className="w-4 h-4" />
                                    <span>Pratinjau Visi & Misi Realtime</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30 font-mono">
                                    Live Draft
                                </span>
                            </div>

                            {/* Simulated Visi & Misi Section Box */}
                            <div className="rounded-2xl bg-white text-slate-900 p-4 space-y-4 border border-slate-200 shadow-inner max-h-[75vh] overflow-y-auto">
                                
                                {/* Header Preview */}
                                <div className="text-center space-y-1">
                                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#800020] text-[9px] font-semibold border border-rose-100 inline-block">
                                        {data.header_badge || 'Badge Header...'}
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                        {data.header_title || 'Judul Visi & Misi...'}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 line-clamp-2">
                                        {data.header_description || 'Deskripsi Visi Misi...'}
                                    </p>
                                </div>

                                {/* Spotlight Visi Card Preview */}
                                <div className="rounded-xl bg-slate-900 text-white p-4 space-y-2 relative overflow-hidden border border-slate-800 text-center">
                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-200 text-[9px]">
                                        <DynamicIcon svgString={data.visi_badge_icon_svg} fallback={Target} className="w-3 h-3 text-rose-300" />
                                        <span>{data.visi_badge || 'Visi Perusahaan'}</span>
                                    </div>
                                    <p className="text-[11px] font-normal text-rose-50 italic leading-snug">
                                        {data.visi_title || 'Quote Visi Utama...'}
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center gap-2 text-[9px] text-rose-200/80 pt-1">
                                        <span className="flex items-center gap-1">
                                            <DynamicIcon svgString={data.visi_pillar_1_icon_svg} fallback={ShieldCheck} className="w-3 h-3 text-rose-400" />
                                            {data.visi_pillar_1_text}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DynamicIcon svgString={data.visi_pillar_2_icon_svg} fallback={Sparkles} className="w-3 h-3 text-rose-400" />
                                            {data.visi_pillar_2_text}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DynamicIcon svgString={data.visi_pillar_3_icon_svg} fallback={Users} className="w-3 h-3 text-rose-400" />
                                            {data.visi_pillar_3_text}
                                        </span>
                                    </div>
                                </div>

                                {/* Misi Cards Grid Preview */}
                                <div className="space-y-2 pt-1">
                                    <span className="text-[10px] font-bold text-slate-700 block">Daftar Misi ({data.misi_items.length} Card):</span>
                                    
                                    <div className="grid grid-cols-1 gap-2">
                                        {data.misi_items.map((misi, idx) => (
                                            <div
                                                key={misi.id || idx}
                                                className={`p-3 rounded-xl border text-left space-y-1.5 ${
                                                    misi.highlight 
                                                        ? 'bg-rose-50/60 border-rose-200' 
                                                        : 'bg-white border-slate-200'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#800020] flex items-center justify-center shrink-0">
                                                        <DynamicIcon svgString={misi.icon_svg} fallback={idx === 0 ? HeartHandshake : idx === 1 ? Award : Users} className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                        {misi.tag || 'Tag'}
                                                    </span>
                                                </div>

                                                <h5 className="text-xs font-bold text-slate-900 leading-tight">
                                                    {misi.title || 'Judul Misi...'}
                                                </h5>
                                                <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">
                                                    {misi.desc || 'Deskripsi misi...'}
                                                </p>
                                                {misi.highlight && (
                                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#800020] pt-0.5">
                                                        <Sparkles className="w-2.5 h-2.5" /> Card Highlighted
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Informational Hint */}
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                            <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                                <Info className="w-4 h-4 text-amber-700" />
                                <span>Manajemen Misi Dinamis:</span>
                            </div>
                            <p className="text-[11px] text-amber-800/90 leading-relaxed font-normal">
                                Lu bisa menambah, mengedit, atau menghapus card misi kapan saja. Gunakan opsi <strong>"Highlight Card"</strong> untuk memberikan gaya penekanan khusus pada poin misi tertentu.
                            </p>
                        </div>

                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}

import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Layers, 
    Award, 
    Save, 
    CheckCircle2, 
    Eye, 
    ExternalLink, 
    Plus, 
    Trash2, 
    Smartphone, 
    Headphones, 
    ShieldCheck, 
    Info
} from 'lucide-react';
import { Icon } from '@iconify/react';

export default function PartnerBrandSetting({ partnerBrand, status }) {
    const [brandTab, setBrandTab] = useState('smartphone'); // 'smartphone' | 'accessory'

    const { data, setData, post, processing } = useForm({
        header_badge: partnerBrand?.header_badge || 'Mitra Resmi Brand Dunia',
        header_title: partnerBrand?.header_title || 'Official Brand Partner & Distributor Ritel',
        header_description: partnerBrand?.header_description || 'Dancell bekerja sama langsung dengan produsen smartphone dan aksesori teknologi terkemuka dunia untuk menjamin keaslian 100% & garansi resmi di 56 cabang.',
        stat_1_val: partnerBrand?.stat_1_val || '15+',
        stat_1_label: partnerBrand?.stat_1_label || 'Brand Global Resmi',
        stat_2_val: partnerBrand?.stat_2_val || '100%',
        stat_2_label: partnerBrand?.stat_2_label || 'Produk Original',
        stat_3_val: partnerBrand?.stat_3_val || '56',
        stat_3_label: partnerBrand?.stat_3_label || 'Outlet Ritel Aktif',
        stat_4_val: partnerBrand?.stat_4_val || 'Garansi',
        stat_4_label: partnerBrand?.stat_4_label || 'Resmi Indonesia',
        smartphone_brands: partnerBrand?.smartphone_brands || [
            { name: 'Apple', icon: 'simple-icons:apple', tag: 'Official Partner', desc: 'iPhone, iPad & Mac ecosystem' },
            { name: 'Samsung', icon: 'simple-icons:samsung', tag: 'Official SEIN', desc: 'Galaxy S, Z Fold & A Series' },
            { name: 'Xiaomi', icon: 'simple-icons:xiaomi', tag: 'Garansi Resmi TAM', desc: 'Xiaomi, Redmi & POCO' },
            { name: 'OPPO', icon: 'simple-icons:oppo', tag: 'Official Partner', desc: 'Find, Reno & A Series' },
            { name: 'Vivo', icon: 'simple-icons:vivo', tag: 'Official Partner', desc: 'X Series & V Series' },
            { name: 'Realme', icon: 'simple-icons:realme', tag: 'Official Partner', desc: 'GT Series & Number Series' },
            { name: 'ASUS', icon: 'simple-icons:asus', tag: 'ROG Partner', desc: 'ROG Phone & Zenfone' },
            { name: 'Google', icon: 'simple-icons:google', tag: 'Pixel Ecosystem', desc: 'Google Pixel & Nest' },
        ],
        accessory_brands: partnerBrand?.accessory_brands || [
            { name: 'Sony', icon: 'simple-icons:sony', tag: 'Official Audio', desc: 'WH-1000XM & WF Series' },
            { name: 'JBL', icon: 'simple-icons:jbl', tag: 'Official Audio', desc: 'Flip, Charge & Wave TWS' },
            { name: 'Anker', icon: 'simple-icons:anker', tag: 'Official Accessories', desc: 'GaN Prime Charger & Powerbank' },
            { name: 'SanDisk', icon: 'simple-icons:sandisk', tag: 'Official Storage', desc: 'Ultra MicroSD & Flash Drive' },
            { name: 'Lenovo', icon: 'simple-icons:lenovo', tag: 'Official Partner', desc: 'Tab & IdeaPad Series' },
            { name: 'Motorola', icon: 'simple-icons:motorola', tag: 'Official Partner', desc: 'Moto Razr & Edge' },
            { name: 'Marshall', icon: 'simple-icons:marshall', tag: 'Official Audio', desc: 'Emberton & Major Headphones' },
            { name: 'Nokia', icon: 'simple-icons:nokia', tag: 'Official Partner', desc: 'Nokia Tough & Smart Series' },
        ],
        footer_note: partnerBrand?.footer_note || 'Seluruh produk brand di atas bergaransi resmi & tersedia di 56 outlet Dancell Jawa Timur.',
        cta_btn_text: partnerBrand?.cta_btn_text || 'Temukan Outlet Terdekat',
        cta_btn_link: partnerBrand?.cta_btn_link || '#branches',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.content.mitra.update'));
    };

    // Smartphone Brand CRUD
    const handleAddSmartphoneBrand = () => {
        const newBrand = {
            name: 'Brand Baru',
            icon: 'simple-icons:intel',
            tag: 'Official Partner',
            desc: 'Deskripsi ekosistem produk brand.',
        };
        setData('smartphone_brands', [...data.smartphone_brands, newBrand]);
    };

    const handleRemoveSmartphoneBrand = (indexToRemove) => {
        setData('smartphone_brands', data.smartphone_brands.filter((_, idx) => idx !== indexToRemove));
    };

    const handleUpdateSmartphoneBrand = (index, field, value) => {
        const updated = [...data.smartphone_brands];
        updated[index] = { ...updated[index], [field]: value };
        setData('smartphone_brands', updated);
    };

    // Accessory Brand CRUD
    const handleAddAccessoryBrand = () => {
        const newBrand = {
            name: 'Brand Aksesori Baru',
            icon: 'simple-icons:bose',
            tag: 'Official Audio',
            desc: 'Deskripsi seri produk aksesori.',
        };
        setData('accessory_brands', [...data.accessory_brands, newBrand]);
    };

    const handleRemoveAccessoryBrand = (indexToRemove) => {
        setData('accessory_brands', data.accessory_brands.filter((_, idx) => idx !== indexToRemove));
    };

    const handleUpdateAccessoryBrand = (index, field, value) => {
        const updated = [...data.accessory_brands];
        updated[index] = { ...updated[index], [field]: value };
        setData('accessory_brands', updated);
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
            <Head title="Kelola Content Web — Mitra & Brand Partner" />

            <div className="font-['Raleway']">
                
                {/* Header Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-100 text-xs font-normal mb-1">
                            <Layers className="w-3.5 h-3.5 text-[#800020]" />
                            <span>Pengaturan Content Website</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight font-['Raleway']">
                            Kelola Mitra & Brand Partner Dunia
                        </h1>
                        <p className="text-xs text-slate-500 font-normal">
                            Atur judul section, 4 poin statistik, serta daftar logo brand mitra yang tampil pada animasi marquee.
                        </p>
                    </div>

                    <a
                        href="/#products"
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
                                            tab.id === 'mitra'
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
                                    <Award className="w-4 h-4 text-[#800020]" />
                                    <span>Header Section (Judul Atas Mitra & Brand)</span>
                                </h3>
                                <p className="text-xs text-slate-500">Teks pembuka untuk section Mitra Resmi Brand Dunia.</p>
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
                                        placeholder="Mitra Resmi Brand Dunia"
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
                                        placeholder="Official Brand Partner & Distributor Ritel"
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
                                        placeholder="Dancell bekerja sama langsung dengan produsen smartphone..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs text-slate-900 leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: 4 Key Stats Bar */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway']">
                                    4 Counter Box Highlight (Statistik Ringkas)
                                </h3>
                                <p className="text-xs text-slate-500">Angka dan deskripsi statistik yang tampil di bawah header.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <span className="text-[11px] font-bold text-slate-700 block">Statistik 1</span>
                                    <input
                                        type="text"
                                        value={data.stat_1_val}
                                        onChange={(e) => setData('stat_1_val', e.target.value)}
                                        placeholder="15+"
                                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#800020]"
                                    />
                                    <input
                                        type="text"
                                        value={data.stat_1_label}
                                        onChange={(e) => setData('stat_1_label', e.target.value)}
                                        placeholder="Brand Global Resmi"
                                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                                    />
                                </div>

                                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <span className="text-[11px] font-bold text-slate-700 block">Statistik 2</span>
                                    <input
                                        type="text"
                                        value={data.stat_2_val}
                                        onChange={(e) => setData('stat_2_val', e.target.value)}
                                        placeholder="100%"
                                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#800020]"
                                    />
                                    <input
                                        type="text"
                                        value={data.stat_2_label}
                                        onChange={(e) => setData('stat_2_label', e.target.value)}
                                        placeholder="Produk Original"
                                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                                    />
                                </div>

                                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <span className="text-[11px] font-bold text-slate-700 block">Statistik 3</span>
                                    <input
                                        type="text"
                                        value={data.stat_3_val}
                                        onChange={(e) => setData('stat_3_val', e.target.value)}
                                        placeholder="56"
                                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#800020]"
                                    />
                                    <input
                                        type="text"
                                        value={data.stat_3_label}
                                        onChange={(e) => setData('stat_3_label', e.target.value)}
                                        placeholder="Outlet Ritel Aktif"
                                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                                    />
                                </div>

                                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <span className="text-[11px] font-bold text-slate-700 block">Statistik 4</span>
                                    <input
                                        type="text"
                                        value={data.stat_4_val}
                                        onChange={(e) => setData('stat_4_val', e.target.value)}
                                        placeholder="Garansi"
                                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#800020]"
                                    />
                                    <input
                                        type="text"
                                        value={data.stat_4_label}
                                        onChange={(e) => setData('stat_4_label', e.target.value)}
                                        placeholder="Resmi Indonesia"
                                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Dual Sub-Tab Switcher for Brands */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
                            
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60">
                                    <button
                                        type="button"
                                        onClick={() => setBrandTab('smartphone')}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                                            brandTab === 'smartphone'
                                                ? 'bg-[#800020] text-white shadow-2xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Smartphone className="w-3.5 h-3.5" />
                                        <span>Baris 1: Smartphone ({data.smartphone_brands.length})</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setBrandTab('accessory')}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                                            brandTab === 'accessory'
                                                ? 'bg-[#800020] text-white shadow-2xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Headphones className="w-3.5 h-3.5" />
                                        <span>Baris 2: Audio & Aksesori ({data.accessory_brands.length})</span>
                                    </button>
                                </div>

                                {brandTab === 'smartphone' ? (
                                    <button
                                        type="button"
                                        onClick={handleAddSmartphoneBrand}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#800020] text-white text-xs font-semibold hover:bg-[#5c0017] transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Tambah Brand Baris 1</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleAddAccessoryBrand}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#800020] text-white text-xs font-semibold hover:bg-[#5c0017] transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Tambah Brand Baris 2</span>
                                    </button>
                                )}
                            </div>

                            {/* BARIS 1: SMARTPHONE BRANDS */}
                            {brandTab === 'smartphone' && (
                                <div className="space-y-4">
                                    {data.smartphone_brands.map((b, index) => (
                                        <div
                                            key={`sm-${index}`}
                                            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 transition-all duration-200 space-y-3"
                                        >
                                            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 overflow-hidden p-1">
                                                        {b.image && b.image.trim() !== '' ? (
                                                            <img src={b.image} alt={b.name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <Icon icon={b.icon || 'simple-icons:apple'} className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {b.name || `Brand #${index + 1}`}
                                                    </span>
                                                </div>

                                                {/* Delete Button */}
                                                {data.smartphone_brands.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSmartphoneBrand(index)}
                                                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100/50 transition-colors"
                                                        title="Hapus Brand"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Nama Brand</label>
                                                    <input
                                                        type="text"
                                                        value={b.name}
                                                        onChange={(e) => handleUpdateSmartphoneBrand(index, 'name', e.target.value)}
                                                        placeholder="Apple"
                                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">URL / Path Logo Gambar (Opsional)</label>
                                                    <input
                                                        type="text"
                                                        value={b.image || ''}
                                                        onChange={(e) => handleUpdateSmartphoneBrand(index, 'image', e.target.value)}
                                                        placeholder="/images/brands/apple.png atau URL"
                                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-800"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Kode Iconify (Fallback)</label>
                                                    <input
                                                        type="text"
                                                        value={b.icon}
                                                        onChange={(e) => handleUpdateSmartphoneBrand(index, 'icon', e.target.value)}
                                                        placeholder="simple-icons:apple"
                                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-800"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Badge Tag</label>
                                                    <input
                                                        type="text"
                                                        value={b.tag}
                                                        onChange={(e) => handleUpdateSmartphoneBrand(index, 'tag', e.target.value)}
                                                        placeholder="Official Partner"
                                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-medium text-slate-700 mb-1">Deskripsi Ringkas Ekosistem</label>
                                                <input
                                                    type="text"
                                                    value={b.desc}
                                                    onChange={(e) => handleUpdateSmartphoneBrand(index, 'desc', e.target.value)}
                                                    placeholder="iPhone, iPad & Mac ecosystem"
                                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* BARIS 2: ACCESSORY BRANDS */}
                            {brandTab === 'accessory' && (
                                <div className="space-y-4">
                                    {data.accessory_brands.map((b, index) => (
                                        <div
                                            key={`ac-${index}`}
                                            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 transition-all duration-200 space-y-3"
                                        >
                                            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 overflow-hidden p-1">
                                                        {b.image && b.image.trim() !== '' ? (
                                                            <img src={b.image} alt={b.name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <Icon icon={b.icon || 'simple-icons:sony'} className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {b.name || `Brand #${index + 1}`}
                                                    </span>
                                                </div>

                                                {/* Delete Button */}
                                                {data.accessory_brands.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAccessoryBrand(index)}
                                                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100/50 transition-colors"
                                                        title="Hapus Brand"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Nama Brand</label>
                                                    <input
                                                        type="text"
                                                        value={b.name}
                                                        onChange={(e) => handleUpdateAccessoryBrand(index, 'name', e.target.value)}
                                                        placeholder="Sony"
                                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">URL / Path Logo Gambar (Opsional)</label>
                                                    <input
                                                        type="text"
                                                        value={b.image || ''}
                                                        onChange={(e) => handleUpdateAccessoryBrand(index, 'image', e.target.value)}
                                                        placeholder="/images/brands/sony.png atau URL"
                                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-800"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Kode Iconify (Fallback)</label>
                                                    <input
                                                        type="text"
                                                        value={b.icon}
                                                        onChange={(e) => handleUpdateAccessoryBrand(index, 'icon', e.target.value)}
                                                        placeholder="simple-icons:sony"
                                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-800"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Badge Tag</label>
                                                    <input
                                                        type="text"
                                                        value={b.tag}
                                                        onChange={(e) => handleUpdateAccessoryBrand(index, 'tag', e.target.value)}
                                                        placeholder="Official Audio"
                                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-medium text-slate-700 mb-1">Deskripsi Ringkas Ekosistem</label>
                                                <input
                                                    type="text"
                                                    value={b.desc}
                                                    onChange={(e) => handleUpdateAccessoryBrand(index, 'desc', e.target.value)}
                                                    placeholder="WH-1000XM & WF Series"
                                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* Section 4: Footer Bar Controls */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway'] flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-[#800020]" />
                                    <span>Footer Bar Card & Tombol CTA</span>
                                </h3>
                                <p className="text-xs text-slate-500">Teks jaminan garansi dan tombol aksi di bagian bawah marquee.</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Teks Catatan Jaminan Garansi
                                    </label>
                                    <input
                                        type="text"
                                        value={data.footer_note}
                                        onChange={(e) => setData('footer_note', e.target.value)}
                                        placeholder="Seluruh produk brand di atas bergaransi resmi..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs text-slate-900"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Teks Tombol CTA
                                        </label>
                                        <input
                                            type="text"
                                            value={data.cta_btn_text}
                                            onChange={(e) => setData('cta_btn_text', e.target.value)}
                                            placeholder="Temukan Outlet Terdekat"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs font-semibold text-slate-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">
                                            Link Target URL CTA (# / URL)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.cta_btn_link}
                                            onChange={(e) => setData('cta_btn_link', e.target.value)}
                                            placeholder="#branches"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs font-mono text-slate-900"
                                        />
                                    </div>
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
                                <span>{processing ? 'Menyimpan Perubahan...' : 'Simpan Konten Mitra & Brand'}</span>
                            </button>
                        </div>

                    </div>

                    {/* Right Column: Realtime Live Preview Card (Sticky Desktop Floating) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-[130px] space-y-4">
                        
                        <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                                <span className="flex items-center gap-1.5 font-medium text-rose-300">
                                    <Eye className="w-4 h-4" />
                                    <span>Pratinjau Mitra & Brand Realtime</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30 font-mono">
                                    Live Draft
                                </span>
                            </div>

                            {/* Simulated Dark Marquee Box */}
                            <div className="rounded-2xl bg-white text-slate-900 p-4 space-y-4 border border-slate-200 shadow-inner max-h-[75vh] overflow-y-auto">
                                
                                {/* Header Preview */}
                                <div className="text-center space-y-1">
                                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#800020] text-[9px] font-semibold border border-rose-100 inline-block">
                                        {data.header_badge || 'Badge Header...'}
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                        {data.header_title || 'Judul Brand Partner...'}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 line-clamp-2">
                                        {data.header_description || 'Deskripsi Brand Partner...'}
                                    </p>
                                </div>

                                {/* Stats Preview Grid */}
                                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="font-bold text-[#800020]">{data.stat_1_val}</div>
                                        <div className="text-[9px] text-slate-500">{data.stat_1_label}</div>
                                    </div>
                                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="font-bold text-[#800020]">{data.stat_2_val}</div>
                                        <div className="text-[9px] text-slate-500">{data.stat_2_label}</div>
                                    </div>
                                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="font-bold text-[#800020]">{data.stat_3_val}</div>
                                        <div className="text-[9px] text-slate-500">{data.stat_3_label}</div>
                                    </div>
                                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="font-bold text-[#800020]">{data.stat_4_val}</div>
                                        <div className="text-[9px] text-slate-500">{data.stat_4_label}</div>
                                    </div>
                                </div>

                                {/* Dark Marquee Simulation Box */}
                                <div className="rounded-xl bg-slate-900 text-white p-3 space-y-3 border border-slate-800">
                                    
                                    {/* Baris 1 List */}
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-bold text-rose-300 uppercase block">Baris 1 ({data.smartphone_brands.length} Brand):</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {data.smartphone_brands.map((b, idx) => (
                                                <span key={`sm-p-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-[9px] font-medium text-white border border-white/10">
                                                    <Icon icon={b.icon || 'simple-icons:apple'} className="w-3 h-3 text-rose-300" />
                                                    {b.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Baris 2 List */}
                                    <div className="space-y-1 pt-2 border-t border-slate-800">
                                        <span className="text-[9px] font-bold text-amber-300 uppercase block">Baris 2 ({data.accessory_brands.length} Brand):</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {data.accessory_brands.map((b, idx) => (
                                                <span key={`ac-p-${idx}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-[9px] font-medium text-white border border-white/10">
                                                    <Icon icon={b.icon || 'simple-icons:sony'} className="w-3 h-3 text-amber-300" />
                                                    {b.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Note */}
                                    <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-300 space-y-1">
                                        <p className="line-clamp-2">✓ {data.footer_note}</p>
                                        <div className="px-2 py-1 rounded bg-white text-[#800020] font-bold text-[9px] inline-block">
                                            {data.cta_btn_text}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                        {/* Informational Hint */}
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                            <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                                <Info className="w-4 h-4 text-amber-700" />
                                <span>Petunjuk Format Ikon Iconify:</span>
                            </div>
                            <p className="text-[11px] text-amber-800/90 leading-relaxed font-normal">
                                Kode ikon dapat diisi dengan nama iconify seperti <code>simple-icons:apple</code>, <code>simple-icons:samsung</code>, <code>simple-icons:sony</code>, dll. Dancell menggunakan library Iconify untuk logo brand berkualitas tinggi.
                            </p>
                        </div>

                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}

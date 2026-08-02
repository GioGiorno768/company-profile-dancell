import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Layers, 
    Store, 
    MapPin, 
    Clock, 
    ShieldCheck, 
    Heart, 
    Save, 
    CheckCircle2, 
    Eye, 
    ExternalLink, 
    Plus, 
    Trash2, 
    Info
} from 'lucide-react';

export default function FooterSetting({ footer, status }) {
    const { data, setData, post, processing } = useForm({
        brand_name: footer?.brand_name || 'DANCELL',
        brand_tag: footer?.brand_tag || 'Group',
        brand_subtitle: footer?.brand_subtitle || 'Dan Group Official Company Profile 2025/2026',
        brand_description: footer?.brand_description || 'Dancell adalah perusahaan ritel terpercaya yang pertama kali berdiri pada tahun 2008 di Warujayeng, Nganjuk. Hingga kini memiliki 56 cabang aktif di seluruh wilayah Jawa Timur.',
        branch_badge_text: footer?.branch_badge_text || '56 Cabang Siap Melayani Pelanggan',
        office_title: footer?.office_title || 'Kantor Pusat',
        office_address: footer?.office_address || 'Warujayeng, Kec. Tanjunganom, Kab. Nganjuk, Jawa Timur',
        office_hours: footer?.office_hours || 'Senin - Minggu (08:00 - 21:00 WIB)',
        office_established: footer?.office_established || 'Berdiri Sejak Tahun 2008',
        value_box_title: footer?.value_box_title || 'Nilai Utama',
        value_box_heading: footer?.value_box_heading || 'Kesejahteraan Bersama',
        value_box_description: footer?.value_box_description || 'Mengedepankan kualitas pelayanan dan kebermanfaatan bagi masyarakat, karyawan, serta relasi bisnis.',
        copyright_text: footer?.copyright_text || '© 2008 - 2026 Dancell (Dan Group). All rights reserved.',
        nav_links: footer?.nav_links || [
            { label: 'Tentang Dancell', href: '#about' },
            { label: 'Visi & Misi', href: '#visimisi' },
            { label: 'Sejarah 56 Cabang', href: '#history' },
            { label: 'Produk & Aksesori', href: '#products' },
            { label: 'Lokasi Outlet Ritel', href: '#branches' },
        ],
        bottom_links: footer?.bottom_links || [
            { label: 'Syarat & Ketentuan', href: '#' },
            { label: 'Kebijakan Privasi', href: '#' },
            { label: 'Karir Dancell', href: '#' },
        ],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.content.footer.update'));
    };

    // Nav Links CRUD
    const handleAddNavLink = () => {
        setData('nav_links', [...data.nav_links, { label: 'Link Baru', href: '#' }]);
    };

    const handleRemoveNavLink = (indexToRemove) => {
        setData('nav_links', data.nav_links.filter((_, idx) => idx !== indexToRemove));
    };

    const handleUpdateNavLink = (index, field, value) => {
        const updated = [...data.nav_links];
        updated[index] = { ...updated[index], [field]: value };
        setData('nav_links', updated);
    };

    // Bottom Links CRUD
    const handleAddBottomLink = () => {
        setData('bottom_links', [...data.bottom_links, { label: 'Link Legal Baru', href: '#' }]);
    };

    const handleRemoveBottomLink = (indexToRemove) => {
        setData('bottom_links', data.bottom_links.filter((_, idx) => idx !== indexToRemove));
    };

    const handleUpdateBottomLink = (index, field, value) => {
        const updated = [...data.bottom_links];
        updated[index] = { ...updated[index], [field]: value };
        setData('bottom_links', updated);
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
            <Head title="Kelola Content Web — Footer & Kontak" />

            <div className="font-['Raleway']">
                
                {/* Header Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-100 text-xs font-normal mb-1">
                            <Layers className="w-3.5 h-3.5 text-[#800020]" />
                            <span>Pengaturan Content Website</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight font-['Raleway']">
                            Kelola Footer & Kontak Perusahaan
                        </h1>
                        <p className="text-xs text-slate-500 font-normal">
                            Atur informasi profil footer, alamat kantor pusat, jam buka, link navigasi cepat, dan hak cipta.
                        </p>
                    </div>

                    <a
                        href="/#contact"
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
                                            tab.id === 'footer'
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
                        
                        {/* Section 1: Brand Info */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway'] flex items-center gap-2">
                                    <Store className="w-4 h-4 text-[#800020]" />
                                    <span>Informasi Profil Brand Footer</span>
                                </h3>
                                <p className="text-xs text-slate-500">Teks identitas & deskripsi umum perusahaan di bagian kiri footer.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Nama Brand</label>
                                        <input
                                            type="text"
                                            value={data.brand_name}
                                            onChange={(e) => setData('brand_name', e.target.value)}
                                            placeholder="DANCELL"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Badge Tag</label>
                                        <input
                                            type="text"
                                            value={data.brand_tag}
                                            onChange={(e) => setData('brand_tag', e.target.value)}
                                            placeholder="Group"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Subtitle Brand</label>
                                        <input
                                            type="text"
                                            value={data.brand_subtitle}
                                            onChange={(e) => setData('brand_subtitle', e.target.value)}
                                            placeholder="Dan Group Official..."
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Paragraf Deskripsi Perusahaan
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={data.brand_description}
                                        onChange={(e) => setData('brand_description', e.target.value)}
                                        placeholder="Dancell adalah perusahaan ritel terpercaya..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs text-slate-900 leading-relaxed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Teks Badge Status Cabang (Hijau)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.branch_badge_text}
                                        onChange={(e) => setData('branch_badge_text', e.target.value)}
                                        placeholder="56 Cabang Siap Melayani Pelanggan"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Kantor Pusat Info */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway'] flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#800020]" />
                                    <span>Informasi Kantor Pusat & Operasional</span>
                                </h3>
                                <p className="text-xs text-slate-500">Alamat utama, jam operasional, dan info tahun berdiri.</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Judul Kolom</label>
                                    <input
                                        type="text"
                                        value={data.office_title}
                                        onChange={(e) => setData('office_title', e.target.value)}
                                        placeholder="Kantor Pusat"
                                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Alamat Kantor Pusat</label>
                                    <textarea
                                        rows={2}
                                        value={data.office_address}
                                        onChange={(e) => setData('office_address', e.target.value)}
                                        placeholder="Warujayeng, Kec. Tanjunganom, Kab. Nganjuk..."
                                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Jam Operasional</label>
                                        <input
                                            type="text"
                                            value={data.office_hours}
                                            onChange={(e) => setData('office_hours', e.target.value)}
                                            placeholder="Senin - Minggu (08:00 - 21:00 WIB)"
                                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Tahun Berdiri</label>
                                        <input
                                            type="text"
                                            value={data.office_established}
                                            onChange={(e) => setData('office_established', e.target.value)}
                                            placeholder="Berdiri Sejak Tahun 2008"
                                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Nilai Utama Box */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway'] flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-[#800020]" />
                                    <span>Card Nilai Utama (Pilar Perusahaan)</span>
                                </h3>
                                <p className="text-xs text-slate-500">Box nilai utama yang tampil di kolom kanan footer.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Judul Kolom</label>
                                        <input
                                            type="text"
                                            value={data.value_box_title}
                                            onChange={(e) => setData('value_box_title', e.target.value)}
                                            placeholder="Nilai Utama"
                                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Heading Tagline</label>
                                        <input
                                            type="text"
                                            value={data.value_box_heading}
                                            onChange={(e) => setData('value_box_heading', e.target.value)}
                                            placeholder="Kesejahteraan Bersama"
                                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Deskripsi Nilai Utama</label>
                                    <textarea
                                        rows={2}
                                        value={data.value_box_description}
                                        onChange={(e) => setData('value_box_description', e.target.value)}
                                        placeholder="Mengedepankan kualitas pelayanan..."
                                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Navigasi Links (CRUD) */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 font-['Raleway']">
                                        Tautan Navigasi Cepat Footer (Dinamis)
                                    </h3>
                                    <p className="text-xs text-slate-500">Tambah, edit, atau hapus link navigasi cepat.</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddNavLink}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#800020] text-white text-xs font-semibold hover:bg-[#5c0017] transition-colors shadow-2xs cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Link</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {data.nav_links.map((link, index) => (
                                    <div key={`nav-${index}`} className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                                        <input
                                            type="text"
                                            value={link.label}
                                            onChange={(e) => handleUpdateNavLink(index, 'label', e.target.value)}
                                            placeholder="Label Link"
                                            className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-medium"
                                        />
                                        <input
                                            type="text"
                                            value={link.href}
                                            onChange={(e) => handleUpdateNavLink(index, 'href', e.target.value)}
                                            placeholder="#about"
                                            className="w-36 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-800"
                                        />
                                        {data.nav_links.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNavLink(index)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100/50"
                                                title="Hapus Link"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 5: Copyright & Bottom Legal Links */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway']">
                                    Hak Cipta (Copyright) & Link Bawah Legal
                                </h3>
                                <p className="text-xs text-slate-500">Atur teks copyright dan daftar link legal pada baris paling bawah.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Teks Copyright Bottom Bar</label>
                                    <input
                                        type="text"
                                        value={data.copyright_text}
                                        onChange={(e) => setData('copyright_text', e.target.value)}
                                        placeholder="© 2008 - 2026 Dancell (Dan Group)..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-800">Daftar Link Bawah (Bottom Bar Links):</span>
                                        <button
                                            type="button"
                                            onClick={handleAddBottomLink}
                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 text-white text-[11px] font-semibold hover:bg-slate-700 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                            <span>Tambah Link Bawah</span>
                                        </button>
                                    </div>

                                    {data.bottom_links.map((link, index) => (
                                        <div key={`bot-${index}`} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                                            <input
                                                type="text"
                                                value={link.label}
                                                onChange={(e) => handleUpdateBottomLink(index, 'label', e.target.value)}
                                                placeholder="Syarat & Ketentuan"
                                                className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                                            />
                                            <input
                                                type="text"
                                                value={link.href}
                                                onChange={(e) => handleUpdateBottomLink(index, 'href', e.target.value)}
                                                placeholder="#"
                                                className="w-32 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-800"
                                            />
                                            {data.bottom_links.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveBottomLink(index)}
                                                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100/50"
                                                    title="Hapus Link"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
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
                                <span>{processing ? 'Menyimpan Perubahan...' : 'Simpan Konten Footer & Kontak'}</span>
                            </button>
                        </div>

                    </div>

                    {/* Right Column: Realtime Live Preview Card (Sticky Desktop Floating) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-[130px] space-y-4">
                        
                        <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                                <span className="flex items-center gap-1.5 font-medium text-rose-300">
                                    <Eye className="w-4 h-4" />
                                    <span>Pratinjau Footer Realtime</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30 font-mono">
                                    Live Draft
                                </span>
                            </div>

                            {/* Simulated Dark Footer Box */}
                            <div className="rounded-2xl bg-slate-950 text-white p-4 space-y-4 border border-slate-800 shadow-inner max-h-[75vh] overflow-y-auto">
                                
                                {/* Brand Header */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#5c0017] to-[#800020] flex items-center justify-center text-white">
                                            <Store className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold text-sm text-white font-['Raleway']">
                                                {data.brand_name}
                                            </span>
                                            <span className="px-1 py-0.2 text-[8px] font-bold bg-[#800020] text-white rounded">
                                                {data.brand_tag}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-3">
                                        {data.brand_description}
                                    </p>
                                    <div className="inline-flex items-center gap-1.5 text-[9px] text-emerald-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        <span>{data.branch_badge_text}</span>
                                    </div>
                                </div>

                                {/* Office Info Preview */}
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-[10px]">
                                    <span className="font-bold text-rose-300 block">{data.office_title}</span>
                                    <div className="text-slate-300 flex items-start gap-1">
                                        <MapPin className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{data.office_address}</span>
                                    </div>
                                    <div className="text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-rose-400 shrink-0" />
                                        <span>{data.office_hours}</span>
                                    </div>
                                    <div className="text-slate-400 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-rose-400 shrink-0" />
                                        <span>{data.office_established}</span>
                                    </div>
                                </div>

                                {/* Value Box Preview */}
                                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[10px]">
                                    <span className="font-bold text-slate-400 block">{data.value_box_title}</span>
                                    <div className="font-semibold text-rose-300 flex items-center gap-1">
                                        <Heart className="w-3 h-3" />
                                        <span>{data.value_box_heading}</span>
                                    </div>
                                    <p className="text-slate-400 leading-snug line-clamp-2">
                                        {data.value_box_description}
                                    </p>
                                </div>

                                {/* Nav Links Preview */}
                                <div className="space-y-1 pt-1 border-t border-slate-800 text-[10px]">
                                    <span className="font-bold text-slate-400 block">Navigasi ({data.nav_links.length} Link):</span>
                                    <div className="flex flex-wrap gap-1.5 text-slate-300">
                                        {data.nav_links.map((l, idx) => (
                                            <span key={`n-p-${idx}`} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                                                {l.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Bar Copyright Preview */}
                                <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-400 space-y-1">
                                    <p className="line-clamp-1">{data.copyright_text}</p>
                                    <div className="flex flex-wrap gap-2 text-slate-300">
                                        {data.bottom_links.map((bl, idx) => (
                                            <span key={`b-p-${idx}`}>{bl.label}</span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Informational Hint */}
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                            <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                                <Info className="w-4 h-4 text-amber-700" />
                                <span>Pengaturan Footer Lengkap:</span>
                            </div>
                            <p className="text-[11px] text-amber-800/90 leading-relaxed font-normal">
                                Lu bisa mengubah seluruh teks kantor pusat, deskripsi brand, link navigasi cepat, hingga link legal kebijakan privacy yang ada di baris paling bawah.
                            </p>
                        </div>

                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}

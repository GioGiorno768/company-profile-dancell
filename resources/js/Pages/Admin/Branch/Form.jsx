import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Store,
    Save,
    MapPin,
    Clock,
    Phone,
    MessageCircle,
    ExternalLink,
    Sparkles,
    ShieldCheck,
    Check,
    Info,
    Crown
} from 'lucide-react';

export default function BranchForm({ branch = null, cities = [], nextOrder = 1 }) {
    const isEdit = Boolean(branch?.id);

    const { data, setData, post, processing, errors } = useForm({
        name: branch?.name || '',
        city: branch?.city || (cities[0] || 'Malang'),
        area: branch?.area || '',
        year: branch?.year || '2026',
        is_hq: branch?.is_hq ?? false,
        address: branch?.address || '',
        phone: branch?.phone || '',
        whatsapp: branch?.whatsapp || '',
        google_maps_url: branch?.google_maps_url || '',
        opening_hours: branch?.opening_hours || 'Buka Setiap Hari (08.00 - 21.00 WIB)',
        is_active: branch?.is_active ?? true,
        order: branch?.order ?? nextOrder,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('admin.branches.update', branch.id));
        } else {
            post(route('admin.branches.store'));
        }
    };

    return (
        <AdminLayout activeMenu="branches">
            <Head title={isEdit ? `Edit ${branch.name} — Dancell Admin` : 'Tambah Cabang Baru — Dancell Admin'} />

            <div className="font-['Raleway'] space-y-6">
                
                {/* Top Navigation Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.branches.index')}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shadow-2xs cursor-pointer shrink-0"
                            title="Kembali ke Daftar Cabang"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                    isEdit ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-rose-50 text-[#800020] border border-rose-100'
                                }`}>
                                    {isEdit ? 'Penyuntingan Outlet' : 'Outlet Baru'}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                                {isEdit ? `Edit Outlet: ${branch.name}` : 'Tambah Outlet Cabang Baru'}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* 2-Column Split: Form (Left) vs Interactive Live Preview (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Form Inputs (7 Cols) */}
                    <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                            <Store className="w-5 h-5 text-[#800020]" />
                            <h2 className="text-sm font-semibold text-slate-900">Form Informasi Detail Outlet</h2>
                        </div>

                        <form onSubmit={submit} className="space-y-5 text-xs">
                            
                            {/* Branch Name */}
                            <div className="space-y-1.5">
                                <label className="block font-semibold text-slate-700">
                                    Nama Outlet / Cabang <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Dancell Warujayeng (HQ) / Dancell Mojoroto"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                />
                                {errors.name && <p className="text-[11px] text-rose-600 font-medium">{errors.name}</p>}
                            </div>

                            {/* City & Area / District */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">
                                        Kota / Kabupaten <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Nganjuk / Kediri / Malang"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                    {errors.city && <p className="text-[11px] text-rose-600 font-medium">{errors.city}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">
                                        Area / Kecamatan Spesifik
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Pusat Nganjuk / Mojoroto / Alun-alun"
                                        value={data.area}
                                        onChange={(e) => setData('area', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Year Founded & Opening Hours */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">
                                        Tahun Berdiri Cabang
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: 2008 / 2020 / 2026"
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">
                                        Jam Operasional <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Buka Setiap Hari (08.00 - 21.00 WIB)"
                                        value={data.opening_hours}
                                        onChange={(e) => setData('opening_hours', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-1.5">
                                <label className="block font-semibold text-slate-700">
                                    Alamat Lengkap Outlet <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    placeholder="Jalan, gedung, nomor, kelurahan, kecamatan..."
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none leading-relaxed"
                                />
                                {errors.address && <p className="text-[11px] text-rose-600 font-medium">{errors.address}</p>}
                            </div>

                            {/* Phone & WhatsApp */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">
                                        No Telepon Toko (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: 0358-771234"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">
                                        No WhatsApp CS (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: 081234567800"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Google Maps URL */}
                            <div className="space-y-1.5">
                                <label className="block font-semibold text-slate-700">
                                    Link Google Maps Lokasi (Opsional)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://maps.google.com/?q=..."
                                    value={data.google_maps_url}
                                    onChange={(e) => setData('google_maps_url', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                />
                            </div>

                            {/* Options: HQ Flag & Active Switch */}
                            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-rose-200 bg-rose-50/50 cursor-pointer hover:bg-rose-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.is_hq}
                                        onChange={(e) => setData('is_hq', e.target.checked)}
                                        className="w-4 h-4 text-[#800020] rounded border-rose-300 focus:ring-[#800020]"
                                    />
                                    <div>
                                        <div className="font-bold text-slate-900 flex items-center gap-1.5 leading-tight">
                                            <Crown className="w-3.5 h-3.5 text-[#800020]" />
                                            <span>Kantor Pusat (HQ)</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500">Tampilkan kartu dengan tema khusus Headquarter di landing page</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="w-4 h-4 text-[#800020] rounded border-slate-300 focus:ring-[#800020]"
                                    />
                                    <div>
                                        <span className="font-bold text-slate-900 block leading-tight">Status Toko Aktif</span>
                                        <span className="text-[10px] text-slate-500">Tampilkan outlet ini di website utama</span>
                                    </div>
                                </label>
                            </div>

                            {/* Submit Bar */}
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                                <Link
                                    href={route('admin.branches.index')}
                                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                                >
                                    Batal
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 rounded-xl bg-[#800020] hover:bg-[#600018] text-white font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>{processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Terbitkan Cabang Baru')}</span>
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Right Column: Live Interactive Card Preview Matching BranchNetwork.jsx (5 Cols) */}
                    <div className="lg:col-span-5 sticky top-[80px] space-y-4">
                        
                        <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2 text-xs font-semibold">
                                <Sparkles className="w-4 h-4 text-rose-400" />
                                <span>Pratinjau Landing Page (BranchNetwork.jsx)</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-rose-200 text-[10px] font-mono">
                                Live Card Preview
                            </span>
                        </div>

                        {/* Card Component Matching Landing Page BranchNetwork.jsx */}
                        <div className={`rounded-3xl p-5 transition-all duration-300 shadow-lg ${
                            data.is_hq 
                                ? 'bg-slate-900 text-white border-2 border-[#800020]' 
                                : 'bg-white border border-slate-200/80 shadow-xs'
                        }`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-normal ${
                                    data.is_hq ? 'bg-[#800020] text-white' : 'bg-rose-50 text-[#800020]'
                                }`}>
                                    <Store className="w-4 h-4" />
                                </div>
                                <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${
                                    data.is_hq ? 'bg-[#800020] text-white font-bold border border-rose-400/40' : 'bg-rose-50 text-[#800020]'
                                }`}>
                                    {data.is_hq ? `Kantor Pusat (${data.year || '2008'})` : `Berdiri ${data.year || '2026'}`}
                                </span>
                            </div>

                            <h3 className={`text-base font-semibold font-['Raleway'] mb-1 ${
                                data.is_hq ? 'text-white' : 'text-slate-900'
                            }`}>
                                {data.name || 'Nama Outlet Cabang Dancell'}
                            </h3>

                            <div className={`flex items-center gap-1 text-xs font-normal mb-3 ${
                                data.is_hq ? 'text-slate-300' : 'text-slate-500'
                            }`}>
                                <MapPin className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                                <span className="line-clamp-1">
                                    {data.area || 'Area'}, Kota {data.city || 'Kota'}
                                </span>
                            </div>

                            <div className={`pt-3 border-t flex items-center justify-between text-xs font-normal ${
                                data.is_hq ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-[#800020]'
                            }`}>
                                <span className="flex items-center gap-1 text-[11px]">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>{data.opening_hours || 'Buka Setiap Hari (08.00 - 21.00 WIB)'}</span>
                                </span>
                                {data.google_maps_url ? (
                                    <a 
                                        href={data.google_maps_url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="underline font-medium hover:text-rose-600 transition-colors"
                                    >
                                        Lokasi
                                    </a>
                                ) : (
                                    <span className="underline cursor-pointer">Lokasi</span>
                                )}
                            </div>
                        </div>

                        {/* Info Note */}
                        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-rose-950 text-xs flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-[#800020] shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                                💡 Pratinjau di atas menggunakan desain komponen <code>BranchNetwork.jsx</code> yang sama persis dengan yang tampil di landing page website utama.
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}

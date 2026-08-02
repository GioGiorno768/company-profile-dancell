import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { 
    Store, 
    ShoppingBag, 
    Award, 
    Search, 
    MapPin, 
    ExternalLink
} from 'lucide-react';

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');

    const branches = [
        { name: 'Dancell Warujayeng (HQ)', city: 'Nganjuk', area: 'Pusat Nganjuk', year: '2008', isHQ: true },
        { name: 'Dancell Mojoroto', city: 'Kediri', area: 'Mojoroto', year: '2020' },
        { name: 'Dancell Srengat', city: 'Blitar', area: 'Srengat', year: '2021' },
        { name: 'Dancell Magetan', city: 'Magetan', area: 'Pusat Magetan', year: '2022' },
        { name: 'Dancell Semen', city: 'Kediri', area: 'Semen', year: '2023' },
        { name: 'Dancell Uteran', city: 'Madiun', area: 'Uteran', year: '2024' },
        { name: 'Dancell Mojosari', city: 'Mojokerto', area: 'Mojosari', year: '2025' },
        { name: 'Dancell Nganjuk Kota', city: 'Nganjuk', area: 'Alun-alun', year: '2026' },
    ];

    const filteredBranches = branches.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout activeMenu="dashboard">
            <Head title="Dashboard Admin — Dancell" />

            <div className="space-y-8 font-['Raleway']">
                
                {/* Hero Welcome Banner (Matched with Landing Page Hero Style) */}
                <div className="rounded-3xl bg-gradient-to-br from-[#4a0012] via-[#800020] to-[#5c0017] text-white p-7 sm:p-10 shadow-xl relative overflow-hidden">
                    
                    {/* Ambient Glows */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                    
                    {/* Subtle Texture Grid */}
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                    <div className="relative z-10 space-y-5 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-rose-100 text-xs font-normal backdrop-blur-xs">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <Store className="w-3.5 h-3.5 text-rose-200" />
                            <span>Pusat Pengelolaan Company Profile Dancell</span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-normal text-white leading-tight font-['Raleway'] tracking-tight">
                            Selamat Datang di Dashboard,{' '}
                            <span className="text-rose-200 font-medium">
                                Administrator Dancell
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base text-rose-100/90 font-normal leading-relaxed">
                            Panel kontrol resmi untuk memantau data 56 cabang ritel, informasi brand resmi, dan konten company profile Dancell di seluruh wilayah Jawa Timur.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <a
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-[#800020] font-medium text-xs shadow-md hover:bg-rose-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span>Lihat Halaman Utama</span>
                                <ExternalLink className="w-3.5 h-3.5 text-[#800020]" />
                            </a>
                            <a
                                href="#branches"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/25 text-white font-medium text-xs hover:bg-white/20 transition-all backdrop-blur-xs"
                            >
                                <Store className="w-3.5 h-3.5 text-rose-300" />
                                <span>Ringkasan Cabang</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 3 Metric Cards — Pure Raw Vector Icons (No Background Boxes) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Card 1: Cabang Ritel */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
                        <div className="flex items-center justify-between">
                            <Store className="w-7 h-7 text-[#800020]" />
                            <span className="text-[11px] font-normal uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 text-[#800020] border border-rose-100">
                                Jawa Timur
                            </span>
                        </div>
                        <div>
                            <div className="text-3xl font-semibold text-slate-900 font-['Raleway'] tracking-tight">
                                56 Cabang
                            </div>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                                Outlet ritel aktif tersebar di Nganjuk, Kediri, Blitar, Magetan, Madiun, & Mojokerto.
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Official Brand Partner */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
                        <div className="flex items-center justify-between">
                            <Award className="w-7 h-7 text-amber-600" />
                            <span className="text-[11px] font-normal uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-100">
                                Mitra Resmi
                            </span>
                        </div>
                        <div>
                            <div className="text-3xl font-semibold text-slate-900 font-['Raleway'] tracking-tight">
                                15+ Brand
                            </div>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                                Brand ternama: Apple, Samsung, Xiaomi, OPPO, Vivo, Realme, JBL, Anker, dll.
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Katalog Produk & Aksesori */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
                        <div className="flex items-center justify-between">
                            <ShoppingBag className="w-7 h-7 text-emerald-600" />
                            <span className="text-[11px] font-normal uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                                Garansi 100%
                            </span>
                        </div>
                        <div>
                            <div className="text-3xl font-semibold text-slate-900 font-['Raleway'] tracking-tight">
                                500+ Items
                            </div>
                            <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                                Kategori lengkap Smartphone, Laptop, Audio Wireless, & Solusi Fast Charging.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Clean Branch Outlets Showcase (Matched with BranchNetwork.jsx Style) */}
                <div id="branches" className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-xs space-y-6">
                    
                    {/* Header & Live Search */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="space-y-1 max-w-xl">
                            <span className="px-3 py-1 rounded-full bg-rose-50 text-[#800020] text-xs font-normal uppercase tracking-wider border border-rose-100">
                                Ringkasan Outlet Ritel
                            </span>
                            <h2 className="text-2xl font-normal text-slate-900 tracking-tight font-['Raleway'] pt-1">
                                Jaringan Cabang Dancell <span className="text-[#800020] font-medium">Jawa Timur</span>
                            </h2>
                            <p className="text-xs text-slate-500 font-normal">
                                Cari dan telusuri informasi cabang terdaftar Dancell berdasarkan kota atau nama outlet.
                            </p>
                        </div>

                        {/* Search Input Box */}
                        <div className="w-full md:w-72 relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari kota / outlet..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs font-normal text-slate-900 shadow-2xs"
                            />
                        </div>
                    </div>

                    {/* Branch Grid Cards — Pure Icons (No Background Boxes) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredBranches.map((branch, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl p-5 transition-all duration-300 ${
                                    branch.isHQ 
                                        ? 'bg-slate-900 text-white shadow-md border border-slate-800'
                                        : 'bg-slate-50/60 border border-slate-200/80 hover:bg-rose-50/40 hover:border-rose-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <Store className={`w-5 h-5 ${
                                        branch.isHQ ? 'text-rose-300' : 'text-[#800020]'
                                    }`} />
                                    <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${
                                        branch.isHQ ? 'bg-amber-400 text-slate-900 font-semibold' : 'bg-rose-50 text-[#800020]'
                                    }`}>
                                        {branch.isHQ ? 'Pusat (2008)' : `Berdiri ${branch.year}`}
                                    </span>
                                </div>

                                <h3 className={`text-sm font-semibold font-['Raleway'] mb-1 ${
                                    branch.isHQ ? 'text-white' : 'text-slate-900'
                                }`}>
                                    {branch.name}
                                </h3>

                                <div className={`flex items-center gap-1 text-xs font-normal ${
                                    branch.isHQ ? 'text-slate-300' : 'text-slate-500'
                                }`}>
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{branch.area}, {branch.city}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}

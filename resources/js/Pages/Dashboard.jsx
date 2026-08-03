import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Store,
    Layers,
    Award,
    Clock,
    PhoneCall,
    ExternalLink,
    ArrowRight,
    Building2,
    Zap,
    CheckCircle2,
    SlidersHorizontal,
    ShieldCheck,
    Globe,
    Activity,
    Sparkles,
    ChevronRight
} from 'lucide-react';

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name || 'Administrator';

    const modules = [
        {
            title: 'Kelola Outlet Cabang',
            badge: '56 Toko Active',
            badgeColor: 'bg-[#800020] text-white',
            description: 'Kelola jaringan 56 outlet ritel Dancell, lokasi Google Maps, kontak CS WhatsApp, jam buka, & toggle status keaktifan.',
            href: route('admin.branches.index'),
            icon: Store,
            iconColor: 'text-[#800020]',
            statsText: `${stats?.totalBranches || 56} Total Cabang (${stats?.activeBranches || 54} Aktif)`,
        },
        {
            title: 'Kelola Hero Landing Page',
            badge: 'Banner & CTA',
            badgeColor: 'bg-rose-50 text-[#800020] border border-rose-100',
            description: 'Atur banner utama website, headline tagline, deskripsi company profile, background slider, dan link tombol CTA.',
            href: route('admin.content.hero'),
            icon: Layers,
            iconColor: 'text-[#800020]',
            statsText: 'Tampil di Halaman Depan',
        },
        {
            title: 'Visi Misi & Culture',
            badge: 'Filosofi Perusahaan',
            badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
            description: 'Perbarui visi 2030 Dancell, filosofi pelayanan ritel gadget, serta 4 pilar budaya kerja perusahaan.',
            href: route('admin.content.visi-misi'),
            icon: ShieldCheck,
            iconColor: 'text-emerald-600',
            statsText: 'Visi 2030 & 4 Pilar Utama',
        },
        {
            title: 'Mitra Brand Resmi',
            badge: '15+ Brand Partner',
            badgeColor: 'bg-amber-50 text-amber-800 border border-amber-100',
            description: 'Kelola daftar logo brand resmi (Apple, Samsung, Xiaomi, OPPO, Vivo, Realme, JBL, Anker, dll) yang ditampilkan.',
            href: route('admin.content.mitra'),
            icon: Award,
            iconColor: 'text-amber-600',
            statsText: 'Mitra Authorised Reseller',
        },
        {
            title: 'Sejarah & Timeline',
            badge: 'Milestone 2008 - 2026',
            badgeColor: 'bg-blue-50 text-blue-800 border border-blue-100',
            description: 'Atur jejak langkah perjalanan Dancell dari toko pertama di Nganjuk 2008 hingga ekspansi 56 cabang 2026.',
            href: route('admin.content.history'),
            icon: Clock,
            iconColor: 'text-blue-600',
            statsText: '18 Tahun Perjalanan Ritel',
        },
        {
            title: 'Footer & Kontak CS',
            badge: 'Alamat HQ & Sosmed',
            badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
            description: 'Atur informasi kontak resmi, alamat Kantor Pusat Warujayeng Nganjuk, email, WhatsApp CS, & sosial media.',
            href: route('admin.content.footer'),
            icon: PhoneCall,
            iconColor: 'text-slate-700',
            statsText: 'Warujayeng, Nganjuk, Jatim',
        },
    ];

    return (
        <AdminLayout activeMenu="dashboard">
            <Head title="Dashboard Utama — Dancell Admin" />

            <div className="font-['Raleway'] space-y-7">
                
                {/* Hero Welcome Banner */}
                <div className="rounded-3xl bg-gradient-to-br from-[#4a0012] via-[#800020] to-[#5c0017] text-white p-7 sm:p-9 shadow-xl relative overflow-hidden">
                    
                    {/* Ambient Glow Effects */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                    <div className="relative z-10 space-y-4 max-w-3xl">
                        
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-rose-100 text-xs font-normal backdrop-blur-xs">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                            <span>System Online — Redis Cache 0.4ms</span>
                        </div>

                        {/* Greeting Title */}
                        <h1 className="text-2xl sm:text-4xl font-normal text-white leading-tight tracking-tight">
                            Selamat Datang kembali,{' '}
                            <span className="text-rose-200 font-semibold">
                                {userName}
                            </span>
                        </h1>

                        <p className="text-xs sm:text-sm text-rose-100/90 font-normal leading-relaxed">
                            Pusat kendali administrasi company profile Dancell. Pantau jaringan 56 outlet cabang, integrasi cache Redis real-time, dan pembaruan konten landing page.
                        </p>

                        {/* Quick CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link
                                href={route('admin.branches.index')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#800020] font-semibold text-xs shadow-md hover:bg-rose-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Store className="w-4 h-4 text-[#800020]" />
                                <span>Kelola Cabang ({stats?.totalBranches || 56})</span>
                            </Link>

                            <Link
                                href={route('admin.content.hero')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/25 text-white font-medium text-xs hover:bg-white/20 transition-all backdrop-blur-xs"
                            >
                                <Layers className="w-4 h-4 text-rose-300" />
                                <span>Kelola Content Web</span>
                            </Link>

                            <a
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-rose-200 hover:text-white text-xs font-medium transition-colors"
                            >
                                <span>Lihat Website</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* 4 Metric Highlight Cards (Raw Icons Without Background Boxes) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Card 1: Total Outlet */}
                    <Link
                        href={route('admin.branches.index')}
                        className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-rose-300 hover:shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer"
                    >
                        <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Outlet Cabang</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
                                <span>{stats?.totalBranches || 56}</span>
                                <span className="text-xs font-normal text-emerald-600 font-medium">({stats?.activeBranches || 54} Aktif)</span>
                            </div>
                        </div>
                        <Store className="w-6 h-6 text-[#800020] group-hover:scale-110 transition-transform" />
                    </Link>

                    {/* Card 2: Kota Terjangkau */}
                    <Link
                        href={route('admin.branches.index')}
                        className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-rose-300 hover:shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer"
                    >
                        <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Wilayah Terjangkau</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
                                <span>{stats?.citiesCount || 8}</span>
                                <span className="text-xs font-normal text-slate-400">Kota/Kab</span>
                            </div>
                        </div>
                        <Building2 className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                    </Link>

                    {/* Card 3: Cache Engine */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                        <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Performa Cache</div>
                            <div className="text-2xl font-bold text-rose-800 mt-1 flex items-center gap-1.5">
                                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                                <span>Redis 100%</span>
                            </div>
                        </div>
                        <Zap className="w-6 h-6 text-amber-500" />
                    </div>

                    {/* Card 4: Web Content Modules */}
                    <Link
                        href={route('admin.content.hero')}
                        className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-rose-300 hover:shadow-xs transition-all duration-200 flex items-center justify-between group cursor-pointer"
                    >
                        <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Modul Landing Page</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-1.5">
                                <span>5</span>
                                <span className="text-xs font-normal text-slate-400">Seksi Konten</span>
                            </div>
                        </div>
                        <Layers className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                    </Link>

                </div>

                {/* Main Section Header */}
                <div className="flex items-center justify-between pt-2">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight font-['Raleway']">
                            Pusat Pengelolaan Fitur & Konten
                        </h2>
                        <p className="text-xs text-slate-500 font-normal">
                            Pilih modul di bawah ini untuk memperbarui informasi company profile dan jaringan toko Dancell.
                        </p>
                    </div>
                </div>

                {/* 6 Feature Overview Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {modules.map((mod, idx) => {
                        const IconComp = mod.icon;
                        return (
                            <Link
                                key={idx}
                                href={mod.href}
                                className="bg-white rounded-3xl border border-slate-200/80 hover:border-rose-300 p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                            >
                                <div className="space-y-4">
                                    
                                    {/* Top Card Header */}
                                    <div className="flex items-center justify-between gap-2">
                                        <IconComp className={`w-6 h-6 ${mod.iconColor} group-hover:scale-110 transition-transform`} />
                                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${mod.badgeColor}`}>
                                            {mod.badge}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <div className="space-y-1">
                                        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#800020] transition-colors leading-snug">
                                            {mod.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                                            {mod.description}
                                        </p>
                                    </div>

                                </div>

                                {/* Footer Link */}
                                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-[#800020] transition-colors">
                                    <span className="text-[11px] text-slate-400 font-normal">
                                        {mod.statsText}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span>Buka Fitur</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* System Performa & Quick Info Panel */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <span>Status Infrastruktur Dancell Online</span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-medium">
                                    PHP 8.4 • Laravel 12
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                                Semua data cabang dan konten website di-cache secara otomatis melalui Redis Server untuk kecepatan respon maksimal.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    >
                        <span>Pratinjau Landing Page</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                    </a>
                </div>

            </div>
        </AdminLayout>
    );
}

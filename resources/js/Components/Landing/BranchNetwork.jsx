import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { MapPin, Store, Navigation, ShieldCheck, ArrowRight } from 'lucide-react';

export default function BranchNetwork({ branchSection = null, branches = [] }) {
    const defaultBranches = [
        { name: 'Dancell Warujayeng (HQ)', city: 'Nganjuk', area: 'Pusat Nganjuk', year: '2008', opening_hours: 'Buka Setiap Hari', is_hq: true, isHQ: true },
        { name: 'Dancell Mojoroto', city: 'Kediri', area: 'Mojoroto', year: '2020', opening_hours: 'Buka Setiap Hari' },
        { name: 'Dancell Srengat', city: 'Blitar', area: 'Srengat', year: '2021', opening_hours: 'Buka Setiap Hari' },
        { name: 'Dancell Magetan', city: 'Magetan', area: 'Pusat Magetan', year: '2022', opening_hours: 'Buka Setiap Hari' },
        { name: 'Dancell Semen', city: 'Kediri', area: 'Semen', year: '2023', opening_hours: 'Buka Setiap Hari' },
        { name: 'Dancell Uteran', city: 'Madiun', area: 'Uteran', year: '2024', opening_hours: 'Buka Setiap Hari' },
        { name: 'Dancell Mojosari', city: 'Mojokerto', area: 'Mojosari', year: '2025', opening_hours: 'Buka Setiap Hari' },
        { name: 'Dancell Nganjuk Kota', city: 'Nganjuk', area: 'Alun-alun', year: '2026', opening_hours: 'Buka Setiap Hari' },
    ];

    const allBranches = Array.isArray(branches) && branches.length > 0 ? branches : defaultBranches;
    
    // Tampilkan maksimal 8 cabang di landing page
    const limitedBranches = allBranches.slice(0, 8);

    // Section Content Settings
    const badge = branchSection?.header_badge || 'Jaringan Outlet Ritel';
    const title = branchSection?.header_title || `${allBranches.length} Cabang Ritel Tersebar di Jawa Timur`;
    const description = branchSection?.header_description || 'Temukan cabang Dancell terdekat di kota Anda dengan pelayanan terbaik dan garansi produk terpercaya.';
    const bannerTitle = branchSection?.banner_title || `Total ${allBranches.length} Cabang & Terus Bertambah`;
    const bannerDesc = branchSection?.banner_description || 'Dancell berkomitmen menghadirkan outlet terdekat yang mudah dijangkau di seluruh kabupaten/kota Jawa Timur.';
    const ctaText = branchSection?.cta_btn_text || 'Hubungi Manajemen Dancell';
    const ctaLink = branchSection?.cta_btn_link || '#contact';

    return (
        <section id="branches" className="py-20 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="space-y-3 max-w-2xl">
                        <span className="px-3.5 py-1 rounded-full bg-rose-100/80 text-[#800020] text-xs font-normal uppercase tracking-wider">
                            {badge}
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight font-['Raleway']">
                            {title}
                        </h2>
                        <p className="text-slate-600 text-base font-normal leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Tombol Lihat Selengkapnya */}
                    <Link
                        href={route('branches.public')}
                        className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all shrink-0 self-start md:self-auto group cursor-pointer"
                    >
                        <span>Lihat Selengkapnya ({allBranches.length} Outlet)</span>
                        <ArrowRight className="w-4 h-4 text-rose-200 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Branches Grid (Maksimal 8 Cabang) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {limitedBranches.map((branch, index) => {
                        const isHQ = branch.is_hq || branch.isHQ;
                        const year = branch.year || '2008';
                        const areaName = branch.area || branch.city;

                        return (
                            <motion.div
                                key={branch.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className={`rounded-3xl p-5 transition-all duration-300 ${
                                    isHQ 
                                        ? 'bg-slate-900 text-white shadow-md border-2 border-[#800020]'
                                        : 'bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-normal ${
                                        isHQ ? 'bg-[#800020] text-white' : 'bg-rose-50 text-[#800020]'
                                    }`}>
                                        <Store className="w-4 h-4" />
                                    </div>
                                    <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${
                                        isHQ ? 'bg-[#800020] text-white font-bold border border-rose-400/40' : 'bg-rose-50 text-[#800020]'
                                    }`}>
                                        {isHQ ? `Kantor Pusat (${year})` : `Berdiri ${year}`}
                                    </span>
                                </div>

                                <h3 className={`text-base font-semibold font-['Raleway'] mb-1 ${
                                    isHQ ? 'text-white' : 'text-slate-900'
                                }`}>
                                    {branch.name}
                                </h3>

                                <div className={`flex items-center gap-1 text-xs font-normal mb-3 ${
                                    isHQ ? 'text-slate-300' : 'text-slate-500'
                                }`}>
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                                    <span className="line-clamp-1">{areaName}, Kota {branch.city}</span>
                                </div>

                                <div className={`pt-3 border-t flex items-center justify-between text-xs font-normal ${
                                    isHQ ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-[#800020]'
                                }`}>
                                    <span className="flex items-center gap-1 text-[11px]">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>{branch.opening_hours || 'Buka Setiap Hari'}</span>
                                    </span>
                                    {branch.google_maps_url ? (
                                        <a 
                                            href={branch.google_maps_url} 
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
                            </motion.div>
                        );
                    })}
                </div>

                {/* Total Network Banner */}
                <div className="mt-10 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#800020] text-white flex items-center justify-center shrink-0">
                            <Navigation className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-900 font-['Raleway']">
                                {bannerTitle}
                            </h4>
                            <p className="text-slate-600 text-xs font-normal mt-0.5">
                                {bannerDesc}
                            </p>
                        </div>
                    </div>
                    <a
                        href={ctaLink}
                        className="px-5 py-3 rounded-xl bg-[#800020] text-white font-medium text-xs shadow-xs hover:bg-[#5c0017] transition-colors shrink-0"
                    >
                        {ctaText}
                    </a>
                </div>

            </div>
        </section>
    );
}

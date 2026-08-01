import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Store, Navigation, ShieldCheck } from 'lucide-react';

export default function BranchNetwork() {
    const [searchQuery, setSearchQuery] = useState('');

    const branches = [
        { name: 'Dancell Warujayeng (HQ)', city: 'Nganjuk', area: 'Pusat Nganjuk', year: '2008', status: 'Pusat History', isHQ: true },
        { name: 'Dancell Mojoroto', city: 'Kediri', area: 'Mojoroto', year: '2020', status: 'Aktif' },
        { name: 'Dancell Srengat', city: 'Blitar', area: 'Srengat', year: '2021', status: 'Aktif' },
        { name: 'Dancell Magetan', city: 'Magetan', area: 'Pusat Magetan', year: '2022', status: 'Aktif' },
        { name: 'Dancell Semen', city: 'Kediri', area: 'Semen', year: '2023', status: 'Aktif' },
        { name: 'Dancell Uteran', city: 'Madiun', area: 'Uteran', year: '2024', status: 'Aktif' },
        { name: 'Dancell Mojosari', city: 'Mojokerto', area: 'Mojosari', year: '2025', status: 'Aktif' },
        { name: 'Dancell Nganjuk Kota', city: 'Nganjuk', area: 'Alun-alun', year: '2026', status: 'Aktif' },
    ];

    const filteredBranches = branches.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section id="branches" className="py-20 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="space-y-3 max-w-2xl">
                        <span className="px-3.5 py-1 rounded-full bg-rose-100/80 text-[#800020] text-xs font-normal uppercase tracking-wider">
                            Jaringan Outlet Ritel
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight font-['Raleway']">
                            56 Cabang Ritel Tersebar di{' '}
                            <span className="text-[#800020] font-medium">Jawa Timur</span>
                        </h2>
                        <p className="text-slate-600 text-base font-normal">
                            Temukan cabang Dancell terdekat di kota Anda dengan pelayanan terbaik dan garansi produk terpercaya.
                        </p>
                    </div>

                    {/* Search Input Box */}
                    <div className="w-full md:w-80 relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari kota / cabang..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs font-normal text-slate-900 shadow-xs"
                        />
                    </div>
                </div>

                {/* Branches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredBranches.map((branch, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className={`rounded-3xl p-5 transition-all duration-300 ${
                                branch.isHQ 
                                    ? 'bg-slate-900 text-white shadow-md border border-slate-800'
                                    : 'bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-200'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-normal ${
                                    branch.isHQ ? 'bg-white/10 text-white' : 'bg-rose-50 text-[#800020]'
                                }`}>
                                    <Store className="w-4 h-4" />
                                </div>
                                <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${
                                    branch.isHQ ? 'bg-amber-400/90 text-slate-900' : 'bg-rose-50 text-[#800020]'
                                }`}>
                                    {branch.isHQ ? 'Kantor Pusat (2008)' : `Berdiri ${branch.year}`}
                                </span>
                            </div>

                            <h3 className={`text-base font-semibold font-['Raleway'] mb-1 ${
                                branch.isHQ ? 'text-white' : 'text-slate-900'
                            }`}>
                                {branch.name}
                            </h3>

                            <div className={`flex items-center gap-1 text-xs font-normal mb-3 ${
                                branch.isHQ ? 'text-slate-300' : 'text-slate-500'
                            }`}>
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{branch.area}, Kota {branch.city}</span>
                            </div>

                            <div className={`pt-3 border-t flex items-center justify-between text-xs font-normal ${
                                branch.isHQ ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-[#800020]'
                            }`}>
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Buka Setiap Hari
                                </span>
                                <span className="underline cursor-pointer">Lokasi</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Total Network Banner */}
                <div className="mt-10 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#800020] text-white flex items-center justify-center shrink-0">
                            <Navigation className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-900 font-['Raleway']">
                                Total 56 Cabang & Terus Bertambah
                            </h4>
                            <p className="text-slate-600 text-xs font-normal">
                                Dancell berkomitmen menghadirkan outlet terdekat yang mudah dijangkau di seluruh kabupaten/kota Jawa Timur.
                            </p>
                        </div>
                    </div>
                    <a
                        href="#contact"
                        className="px-5 py-3 rounded-xl bg-[#800020] text-white font-medium text-xs shadow-xs hover:bg-[#5c0017] transition-colors shrink-0"
                    >
                        Hubungi Manajemen Dancell
                    </a>
                </div>

            </div>
        </section>
    );
}

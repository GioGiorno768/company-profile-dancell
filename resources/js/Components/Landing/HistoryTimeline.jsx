import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Award, CheckCircle2, Building2, Store, Users } from 'lucide-react';
import DynamicIcon from '@/Components/Common/DynamicIcon';

export default function HistoryTimeline({ historyTimeline }) {
    const [activeTab, setActiveTab] = useState('expansion');

    const headerBadge = historyTimeline?.header_badge || 'Perjalanan & Rekam Jejak';
    const headerTitle = historyTimeline?.header_title || 'Sejarah Pertumbuhan Dancell';
    const headerDesc = historyTimeline?.header_description || 'Dari toko pertama di Warujayeng pada tahun 2008, bertransformasi menjadi jaringan ritel 56 cabang terdepan di Jawa Timur.';

    const branchHistory = historyTimeline?.expansions && historyTimeline.expansions.length > 0
        ? historyTimeline.expansions
        : [
            { year: '2020', count: 14, added: '14 Cabang', highlight: 'Dancell 2020 – Mojoroto', desc: 'Awal ekspansi multi-cabang terstruktur di area Kediri & Mojoroto.' },
            { year: '2021', count: 25, added: '+11 Cabang', highlight: 'Dancell 2021 – Srengat', desc: 'Pertumbuhan pesat merambah area Blitar & Srengat.' },
            { year: '2022', count: 34, added: '+9 Cabang', highlight: 'Dancell 2022 – Magetan', desc: 'Melebarkan jaringan ritel ke wilayah Barat Jawa Timur (Magetan).' },
            { year: '2023', count: 41, added: '+7 Cabang', highlight: 'Dancell 2023 – Semen', desc: 'Tersebar kokoh hampir di seluruh wilayah strategis Jawa Timur.' },
            { year: '2024', count: 48, added: '+7 Cabang', highlight: 'Dancell 2024 – Uteran', desc: 'Memperkuat jaringan outlet di kawasan Uteran dan sekitarnya.' },
            { year: '2025', count: 53, added: '+5 Cabang', highlight: 'Dancell 2025 – Mojosari', desc: 'Penambahan cabang berlanjut secara masif di Mojosari.' },
            { year: '2026', count: 56, added: '+3 Cabang', highlight: '56 Cabang Terkini', desc: 'Kondisi terkini 56 outlet aktif siap melayani pelanggan Jawa Timur.', current: true },
        ];

    const milestones = historyTimeline?.milestones && historyTimeline.milestones.length > 0
        ? historyTimeline.milestones
        : [
            { year: '2008', title: 'Berdiri Pertama Kali', desc: 'Dancell pertama kali berdiri di Warujayeng, Nganjuk.', icon_svg: '' },
            { year: '2012', title: 'Awal Perjalanan Toko', desc: 'Perjalanan awal toko dengan pembentukan tim kecil yang solid.', icon_svg: '' },
            { year: '2013', title: 'Pengembangan Layanan', desc: 'Pengembangan kapasitas tim dan standar pelayanan ritel.', icon_svg: '' },
            { year: '2015', title: 'Pembukaan Dancell 2', desc: 'Pembukaan outlet Dancell 2, tim operasional mulai membesar.', icon_svg: '' },
            { year: '2017', title: 'Budaya Kerja Solid', desc: 'Pematangan suasana kerja yang semakin terstruktur dan kompak.', icon_svg: '' },
            { year: '2018', title: 'Pertumbuhan Pesat', desc: 'Tim besar dengan seragam khas, menandai era pertumbuhan cepat.', icon_svg: '' },
        ];

    return (
        <section id="history" className="py-20 bg-slate-50 relative overflow-hidden font-['Raleway']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
                    <span className="px-3.5 py-1 rounded-full bg-rose-100/80 text-[#800020] text-xs font-normal uppercase tracking-wider">
                        {headerBadge}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight font-['Raleway']">
                        {headerTitle}
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg font-normal">
                        {headerDesc}
                    </p>
                </div>

                {/* Interactive View Switcher Tabs */}
                <div className="flex justify-center mb-14">
                    <div className="inline-flex p-1 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                        <button
                            onClick={() => setActiveTab('expansion')}
                            className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 ${
                                activeTab === 'expansion'
                                    ? 'bg-[#800020] text-white shadow-xs'
                                    : 'text-slate-600 hover:text-[#800020]'
                            }`}
                        >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Pertumbuhan Cabang</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('milestones')}
                            className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 ${
                                activeTab === 'milestones'
                                    ? 'bg-[#800020] text-white shadow-xs'
                                    : 'text-slate-600 hover:text-[#800020]'
                            }`}
                        >
                            <Award className="w-3.5 h-3.5" />
                            <span>Momen Penting</span>
                        </button>
                    </div>
                </div>

                {/* Tab Content Display */}
                <AnimatePresence mode="wait">
                    {activeTab === 'expansion' ? (
                        <motion.div
                            key="expansion"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                {branchHistory.map((item, idx) => (
                                    <motion.div
                                        key={item.id || item.year || idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        className={`rounded-3xl p-6 relative overflow-hidden transition-all duration-300 ${
                                            item.current
                                                ? 'bg-slate-900 text-white shadow-lg border border-slate-800'
                                                : 'bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-xl font-semibold font-['Raleway'] ${
                                                item.current ? 'text-white' : 'text-[#800020]'
                                            }`}>
                                                {item.year}
                                            </span>
                                            {item.added && (
                                                <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                                                    item.current
                                                        ? 'bg-rose-950 text-rose-200 border border-rose-800'
                                                        : 'bg-rose-50 text-[#800020]'
                                                }`}>
                                                    {item.added}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className={`text-2xl font-medium font-['Raleway'] ${
                                                item.current ? 'text-white' : 'text-slate-900'
                                            }`}>
                                                {item.count} <span className="text-xs font-normal text-slate-500">Cabang</span>
                                            </div>
                                            <h4 className={`font-semibold text-sm ${item.current ? 'text-rose-100' : 'text-slate-800'}`}>
                                                {item.highlight}
                                            </h4>
                                            <p className={`text-xs leading-relaxed font-normal ${item.current ? 'text-slate-300' : 'text-slate-500'}`}>
                                                {item.desc}
                                            </p>
                                        </div>

                                        {item.current && (
                                            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span>Kondisi Terkini</span>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="milestones"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="relative border-l border-rose-200 ml-4 md:ml-32 space-y-8 py-2">
                                {milestones.map((m, idx) => {
                                    const fallbackIcon = idx === 0 ? Store : idx === 1 ? Users : idx === 2 ? TrendingUp : idx === 3 ? Building2 : idx === 4 ? CheckCircle2 : Award;
                                    return (
                                        <motion.div
                                            key={m.id || m.year || idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                                            className="relative pl-8 md:pl-10 group"
                                        >
                                            <div className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#800020] flex items-center justify-center text-[#800020] shadow-xs" />

                                            <div className="hidden md:block absolute -left-32 top-1.5 w-24 text-right">
                                                <span className="font-semibold text-lg text-[#800020] font-['Raleway']">
                                                    {m.year}
                                                </span>
                                            </div>

                                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                                                <div className="md:hidden text-xs font-medium text-[#800020] mb-1">
                                                    TAHUN {m.year}
                                                </div>
                                                <div className="flex items-center gap-2.5 mb-1.5">
                                                    <div className="p-1.5 rounded-lg bg-rose-50 text-[#800020]">
                                                        <DynamicIcon svgString={m.icon_svg} fallback={fallbackIcon} className="w-4 h-4 text-[#800020]" />
                                                    </div>
                                                    <h3 className="text-base font-semibold text-slate-900 font-['Raleway']">
                                                        {m.title}
                                                    </h3>
                                                </div>
                                                <p className="text-slate-600 text-xs leading-relaxed font-normal">
                                                    {m.desc}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}

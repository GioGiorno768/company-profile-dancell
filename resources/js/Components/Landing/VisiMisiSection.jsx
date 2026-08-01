import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Users, HeartHandshake, Award, Sparkles, ShieldCheck } from 'lucide-react';

export default function VisiMisiSection() {
    const misiList = [
        {
            icon: HeartHandshake,
            title: "Manfaat Bagi Semua Pihak",
            desc: "Memberikan manfaat berkelanjutan bagi pelanggan, karyawan, investor, dan masyarakat secara konsisten.",
            tag: "Sosial & Ekonomi"
        },
        {
            icon: Award,
            title: "Pemimpin Pasar Ritel",
            desc: "Mencapai kepuasan pelanggan/relasi maksimal, serta mengembangkan dan mempertahankan posisi sebagai pemimpin pasar di setiap kategori divisi usaha.",
            tag: "Kualitas & Kepuasan"
        },
        {
            icon: Users,
            title: "Pemberdayaan Perempuan",
            desc: "Misi khusus memberdayakan perempuan agar bisa berdikari, mandiri, dan memiliki penghasilan sendiri yang layak.",
            tag: "Empowerment",
            highlight: true
        }
    ];

    return (
        <section id="visimisi" className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
                    <span className="px-3.5 py-1 rounded-full bg-rose-50 text-[#800020] text-xs font-normal uppercase tracking-wider border border-rose-100">
                        Komitmen & Landasan Perusahaan
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight font-['Raleway']">
                        Visi & Misi{' '}
                        <span className="text-[#800020] font-medium">
                            Dancell
                        </span>
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg font-normal">
                        Landasan utama yang menuntun langkah Dancell sejak 2008 dalam memberikan dampak positif bagi seluruh masyarakat.
                    </p>
                </div>

                {/* Visi Spotlight Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-14 p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800"
                >
                    <div className="relative z-10 max-w-4xl space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-200 text-xs font-normal uppercase tracking-wider">
                            <Target className="w-3.5 h-3.5 text-rose-300" />
                            <span>Visi Perusahaan</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal leading-relaxed font-['Raleway'] text-rose-50">
                            "Mewujudkan perusahaan yang bermanfaat dan berdaya saing, mampu bertahan dan mengedepankan kualitas, serta kesejahteraan berkelanjutan untuk sesama."
                        </h3>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-rose-200/80 pt-1 font-normal">
                            <span className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-rose-400" />
                                Kualitas Terbaik
                            </span>
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-rose-400" />
                                Daya Saing Tinggi
                            </span>
                            <span className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-rose-400" />
                                Kesejahteraan Berkelanjutan
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Misi Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {misiList.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className={`rounded-3xl p-7 transition-all duration-300 relative flex flex-col justify-between ${
                                    item.highlight
                                        ? 'bg-rose-50/40 border border-rose-200 shadow-sm hover:shadow-md'
                                        : 'bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-200'
                                }`}
                            >
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <span className="text-[11px] font-normal uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                            {item.tag}
                                        </span>
                                    </div>

                                    <h4 className="text-lg font-semibold text-slate-900 font-['Raleway']">
                                        {item.title}
                                    </h4>

                                    <p className="text-slate-600 leading-relaxed text-sm font-normal">
                                        {item.desc}
                                    </p>
                                </div>

                                {item.highlight && (
                                    <div className="mt-6 pt-3 border-t border-rose-200/60 flex items-center gap-2 text-xs font-medium text-[#800020]">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Fokus Kemandirian Perempuan</span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

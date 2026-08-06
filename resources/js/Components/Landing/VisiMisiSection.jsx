import React from "react";
import { motion } from "framer-motion";
import {
    Target,
    Users,
    HeartHandshake,
    Award,
    Sparkles,
    ShieldCheck,
} from "lucide-react";
import DynamicIcon from "@/Components/Common/DynamicIcon";

export default function VisiMisiSection({ visiMisi }) {
    const headerBadge = visiMisi?.header_badge || "Komitmen & Landasan Perusahaan";
    const headerTitle = visiMisi?.header_title || "Visi & Misi Dancell";
    const headerDesc = visiMisi?.header_description || "Landasan utama yang menuntun langkah Dancell sejak 2008 dalam memberikan dampak positif bagi seluruh masyarakat.";

    const visiBadge = visiMisi?.visi_badge || "Visi Perusahaan";
    const visiBadgeIcon = visiMisi?.visi_badge_icon_svg || "";
    const visiTitle = visiMisi?.visi_title || '"Mewujudkan perusahaan yang bermanfaat dan berdaya saing, mampu bertahan dan mengedepankan kualitas, serta kesejahteraan berkelanjutan untuk sesama."';

    const visiPillar1Text = visiMisi?.visi_pillar_1_text || "Kualitas Terbaik";
    const visiPillar1Icon = visiMisi?.visi_pillar_1_icon_svg || "";

    const visiPillar2Text = visiMisi?.visi_pillar_2_text || "Daya Saing Tinggi";
    const visiPillar2Icon = visiMisi?.visi_pillar_2_icon_svg || "";

    const visiPillar3Text = visiMisi?.visi_pillar_3_text || "Kesejahteraan Berkelanjutan";
    const visiPillar3Icon = visiMisi?.visi_pillar_3_icon_svg || "";

    const misiList = visiMisi?.misi_items && visiMisi.misi_items.length > 0
        ? visiMisi.misi_items
        : [
            {
                title: "Manfaat Bagi Semua Pihak",
                desc: "Memberikan manfaat berkelanjutan bagi pelanggan, karyawan, investor, dan masyarakat secara konsisten.",
                tag: "Sosial & Ekonomi",
                icon_svg: "",
                highlight: false,
            },
            {
                title: "Pemimpin Pasar Ritel",
                desc: "Mencapai kepuasan pelanggan/relasi maksimal, serta mengembangkan dan mempertahankan posisi sebagai pemimpin pasar di setiap kategori divisi usaha.",
                tag: "Kualitas & Kepuasan",
                icon_svg: "",
                highlight: false,
            },
            {
                title: "Pemberdayaan Perempuan",
                desc: "Misi khusus memberdayakan perempuan agar bisa berdikari, mandiri, dan memiliki penghasilan sendiri yang layak.",
                tag: "Empowerment",
                icon_svg: "",
                highlight: true,
            },
        ];

    // Responsive grid column calculation based on count
    const getGridColsClass = (count) => {
        if (count === 1) return "grid-cols-1 max-w-xl mx-auto";
        if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    };

    return (
        <section id="visimisi" className="-mt-[100vh]">
            <div className="w-full h-8 sm:h-12 bg-white rounded-t-[3rem] -mt-10 relative z-20 shadow-xs pointer-events-none" />
            <div className="py-10 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
                        <span className="px-3.5 py-1 rounded-full bg-rose-50 text-[#800020] text-xs font-normal uppercase tracking-wider border border-rose-100">
                            {headerBadge}
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight font-['Raleway']">
                            {headerTitle}
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg font-normal">
                            {headerDesc}
                        </p>
                    </div>

                    {/* Visi Spotlight Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="mb-14 p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800 transform-gpu"
                    >
                        <div className="relative z-10 max-w-4xl space-y-5 flex flex-col justify-center items-center m-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-200 text-xs font-normal uppercase tracking-wider">
                                <DynamicIcon svgString={visiBadgeIcon} fallback={Target} className="w-3.5 h-3.5 text-rose-300" />
                                <span>{visiBadge}</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-normal leading-relaxed font-['Raleway'] text-rose-50 text-center">
                                {visiTitle}
                            </h3>
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-rose-200/80 pt-1 font-normal">
                                {visiPillar1Text && (
                                    <span className="flex items-center gap-2">
                                        <DynamicIcon svgString={visiPillar1Icon} fallback={ShieldCheck} className="w-4 h-4 text-rose-400" />
                                        {visiPillar1Text}
                                    </span>
                                )}
                                {visiPillar2Text && (
                                    <span className="flex items-center gap-2">
                                        <DynamicIcon svgString={visiPillar2Icon} fallback={Sparkles} className="w-4 h-4 text-rose-400" />
                                        {visiPillar2Text}
                                    </span>
                                )}
                                {visiPillar3Text && (
                                    <span className="flex items-center gap-2">
                                        <DynamicIcon svgString={visiPillar3Icon} fallback={Users} className="w-4 h-4 text-rose-400" />
                                        {visiPillar3Text}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Misi Cards Grid */}
                    <div className={`grid ${getGridColsClass(misiList.length)} gap-6`}>
                        {misiList.map((item, index) => {
                            const fallbackIcon = index === 0 ? HeartHandshake : index === 1 ? Award : Users;
                            return (
                                <motion.div
                                    key={item.id || index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.15,
                                    }}
                                    className={`rounded-3xl p-7 transition-all duration-300 relative flex flex-col justify-between ${
                                        item.highlight
                                            ? "bg-rose-50/40 border border-rose-200 shadow-sm hover:shadow-md"
                                            : "bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-200"
                                    }`}
                                >
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center shrink-0">
                                                <DynamicIcon svgString={item.icon_svg} fallback={fallbackIcon} className="w-6 h-6 text-[#800020]" />
                                            </div>
                                            {item.tag && (
                                                <span className="text-[11px] font-normal uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                    {item.tag}
                                                </span>
                                            )}
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
                                            <span>
                                                Poin Misi Berkelanjutan
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

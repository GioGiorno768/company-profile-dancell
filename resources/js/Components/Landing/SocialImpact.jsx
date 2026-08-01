import React from 'react';
import { Sparkles, Heart, CheckCircle2 } from 'lucide-react';

export default function SocialImpact() {
    const impactPoints = [
        {
            title: "Kemandirian Finansial",
            desc: "Membuka lapangan kerja dan jenjang karir profesional yang setara bagi perempuan di seluruh wilayah operasional Dancell.",
        },
        {
            title: "Pengembangan Keterampilan Ritel",
            desc: "Program pelatihan intensif kepemimpinan, pelayanan ritel modern, manajemen stok, dan komunikasi bisnis.",
        },
        {
            title: "Lingkungan Kerja Solid & Aman",
            desc: "Menciptakan ekosistem kerja inklusif yang mendukung kesejahteraan berkelanjutan bagi karyawan dan keluarganya.",
        },
    ];

    return (
        <section id="social-impact" className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden border border-slate-800">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                        
                        {/* Left Text */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-rose-200 text-xs font-normal uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                                <span>Pemberdayaan Sosial</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight font-['Raleway']">
                                Memberdayakan Perempuan,{' '}
                                <span className="text-rose-300 font-medium">
                                    Membangun Kemandirian
                                </span>
                            </h2>

                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                                Di Dancell, kami percaya bahwa keberhasilan usaha ritel tidak hanya diukur dari angka pertumbuhan cabang, tetapi juga dari seberapa besar manfaat sosial yang kami hadirkan bagi sesama.
                            </p>

                            <div className="space-y-3 pt-1">
                                {impactPoints.map((point, index) => (
                                    <div key={index} className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                                        <CheckCircle2 className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-white text-sm font-['Raleway']">{point.title}</h4>
                                            <p className="text-xs text-slate-300 mt-0.5 font-normal">{point.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Highlight Box */}
                        <div className="lg:col-span-5">
                            <div className="bg-white text-slate-900 rounded-3xl p-7 shadow-lg border border-slate-200 space-y-5 relative">
                                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center font-normal">
                                    <Heart className="w-5 h-5 text-[#800020]" />
                                </div>

                                <div className="space-y-1.5">
                                    <h3 className="text-xl font-semibold text-slate-900 font-['Raleway']">
                                        Misi Utama Dancell
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed font-normal italic">
                                        "Memberdayakan perempuan agar bisa berdikari, mandiri, dan memiliki penghasilan sendiri."
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                                        <div className="text-xl font-semibold text-[#800020] font-['Raleway']">100%</div>
                                        <div className="text-[10px] font-normal text-slate-600">Kesempatan Setara</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                        <div className="text-xl font-semibold text-slate-900 font-['Raleway']">56</div>
                                        <div className="text-[10px] font-normal text-slate-600">Outlet Jawa Timur</div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

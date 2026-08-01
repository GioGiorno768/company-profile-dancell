import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Users, Heart, ArrowRight, ShieldCheck, Store, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HeroSection({ heroImageSrc = "/images/hero.png" }) {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, -25]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0.7]);

    return (
        <section className="relative pt-32 md:pt-40 pb-0 bg-gradient-to-br from-[#4a0012] via-[#800020] to-[#5c0017] text-white overflow-hidden flex flex-col justify-between">
            
            {/* Animated Ambient Background Glows */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-500/20 rounded-full blur-3xl pointer-events-none" 
            />
            <motion.div 
                animate={{ 
                    y: [0, -25, 0],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-3xl pointer-events-none" 
            />

            {/* Subtle Texture Grid */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-end">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                    
                    {/* Left Hero Text Column */}
                    <div className="lg:col-span-6 space-y-7 text-center lg:text-left pb-16 lg:pb-24">
                        
                        {/* Pill Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-rose-100 text-xs font-normal tracking-wide backdrop-blur-xs"
                        >
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <Store className="w-3.5 h-3.5 text-rose-200" />
                            <span>Berdiri Sejak 2008 — Warujayeng, Nganjuk</span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-[1.16] tracking-tight font-['Raleway']"
                        >
                            Tumbuh Berkelanjutan,{' '}
                            <span className="text-rose-200 font-medium">
                                Melayani Sepenuh Hati
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-base sm:text-lg text-rose-100/90 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0"
                        >
                            <strong className="text-white font-medium">Dancell (Dan Group)</strong> adalah jaringan ritel gadget & handphone terpercaya di Jawa Timur. Dari toko pertama di Warujayeng pada tahun 2008, kini berkembang pesat hingga <span className="text-white font-semibold underline decoration-rose-300 decoration-2">56 cabang</span> di tahun 2026.
                        </motion.p>

                        {/* CTA Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
                        >
                            <a
                                href="#history"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white text-[#800020] font-medium text-sm shadow-lg hover:bg-rose-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span>Perjalanan 56 Cabang</span>
                                <ArrowRight className="w-4 h-4 text-[#800020]" />
                            </a>
                            <a
                                href="#visimisi"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/25 text-white font-medium text-sm hover:bg-white/20 backdrop-blur-xs transition-all duration-200"
                            >
                                <Heart className="w-4 h-4 text-rose-300" />
                                <span>Visi & Misi Kami</span>
                            </a>
                        </motion.div>

                        {/* Quick Trust Highlights */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-normal text-rose-100/90"
                        >
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-rose-300" />
                                <span>Produk 100% Original</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-rose-300" />
                                <span>Pemberdayaan Perempuan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-rose-300" />
                                <span>Tersebar di Jawa Timur</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Hero Image Column - Perfectly Bottom-Aligned & Sized */}
                    <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-end h-full pt-4 -mt-[400px]">
                        
                        {/* Soft Glow behind staff */}
                        <div className="absolute bottom-0 right-10 w-96 h-96 bg-rose-400/25 rounded-full blur-3xl pointer-events-none" />

                        <motion.div 
                            style={{ y: y1, opacity }} 
                            className="relative z-10 flex items-end justify-center lg:justify-end w-full"
                        >
                            {/* Main Staff Image - Bottom Aligned & Prominent */}
                            <motion.img 
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                src={heroImageSrc} 
                                alt="Tim Pelayanan Dancell" 
                                className="h-[460px] sm:h-[540px] lg:h-[800px] w-auto object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-[1.01] -mt-[400px]"
                            />

                            {/* Floating Accent Badge 1 - Left Side */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="absolute bottom-12 left-0 sm:left-4 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-3 rounded-2xl shadow-2xl border border-rose-100 flex items-center gap-3 z-20"
                            >
                                <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#800020] flex items-center justify-center shrink-0">
                                    <Users className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-normal text-slate-500 uppercase tracking-wider">Misi Utama</div>
                                    <div className="text-xs font-semibold text-slate-900 font-['Raleway']">Pemberdayaan Perempuan</div>
                                </div>
                            </motion.div>

                            {/* Floating Accent Badge 2 - Top Right */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="absolute top-16 right-0 sm:right-6 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2.5 rounded-2xl shadow-2xl border border-rose-100 flex items-center gap-2.5 z-20"
                            >
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-semibold text-slate-900 font-['Raleway']">56 Cabang Ritel</div>
                                    <div className="text-[10px] font-normal text-emerald-600">Tersebar di Jawa Timur</div>
                                </div>
                            </motion.div>

                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Smooth Curve Transition to White Section Below */}
            <div className="w-full h-8 sm:h-12 bg-white rounded-t-[3rem] -mt-1 relative z-20 shadow-xs pointer-events-none" />

        </section>
    );
}

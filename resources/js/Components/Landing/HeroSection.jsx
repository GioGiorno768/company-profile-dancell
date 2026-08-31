import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    MapPin,
    ShieldCheck,
    Store,
    ShoppingBag,
    Laptop,
    ChevronRight
} from "lucide-react";

export default function HeroSection({ hero, heroImageSrc = "/images/hero.webp" }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.66]);
    const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.95, 0.5]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], [0, 40]);
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -40]);

    // Data fallbacks if hero prop is missing or empty
    const badgeText = hero?.badge_text || "Pusat Ritel Gadget, Laptop & Aksesori — 58 Outlet Jawa Timur";
    const badgeSvg = hero?.badge_icon_svg;
    const titleText = hero?.title || "Pusat Ritel Gadget & Laptop, Terlengkap & Bergaransi Resmi";
    const descText = hero?.description || "Dancell (Dan Group) adalah jaringan ritel gadget, smartphone, laptop, hingga aksesori terlengkap di Jawa Timur. Berdiri sejak 2008, kini siap melayani Anda di 58 outlet resmi dengan jaminan 100% original, garansi resmi, dan tukar tambah tepercaya.";
    const primaryBtnText = hero?.primary_btn_text || "Temukan Outlet Terdekat";
    const primaryBtnLink = hero?.primary_btn_link || "#branches";
    const primaryBtnSvg = hero?.primary_btn_icon_svg;
    const secondaryBtnText = hero?.secondary_btn_text || "Katalog Produk & Brand";
    const secondaryBtnLink = hero?.secondary_btn_link || "#products";
    const secondaryBtnSvg = hero?.secondary_btn_icon_svg;

    const feature1Text = hero?.feature_1_text || "100% Garansi Resmi";
    const feature1Svg = hero?.feature_1_icon_svg;
    const feature2Text = hero?.feature_2_text || "Gadget, Laptop & Aksesori";
    const feature2Svg = hero?.feature_2_icon_svg;
    const feature3Text = hero?.feature_3_text || "58 Outlet Jawa Timur";
    const feature3Svg = hero?.feature_3_icon_svg;

    const renderIcon = (svgCode, FallbackIcon, defaultClasses) => {
        if (svgCode && svgCode.trim().length > 0) {
            return (
                <span 
                    className="inline-flex items-center justify-center shrink-0" 
                    dangerouslySetInnerHTML={{ __html: svgCode }} 
                />
            );
        }
        return <FallbackIcon className={defaultClasses} />;
    };

    const handleScrollDown = () => {
        if (containerRef.current) {
            const nextPosition = containerRef.current.offsetTop + containerRef.current.offsetHeight * 0.55;
            window.scrollTo({ top: nextPosition, behavior: "smooth" });
        }
    };

    return (
        <section
            ref={containerRef}
            className="relative bg-gradient-to-br from-[#4a0012] via-[#800020] to-[#5c0017] text-white overflow-x-clip h-[200vh]"
        >
            <motion.div
                style={{
                    scale,
                    opacity,
                    borderRadius,
                    willChange: "transform, opacity",
                }}
                className="sticky top-0 left-0 h-screen w-full flex flex-col justify-center pt-14 sm:pt-16 lg:pt-20 pb-4 lg:pb-6 overflow-hidden origin-center transform-gpu"
            >
                {/* Animated Ambient Background Glows (GPU Accelerated) */}
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.3, 0.45, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[700px] h-[600px] sm:h-[700px] bg-rose-500/20 rounded-full blur-3xl pointer-events-none transform-gpu will-change-transform"
                />
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.2, 0.35, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-0 right-10 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-amber-400/15 rounded-full blur-3xl pointer-events-none transform-gpu will-change-transform"
                />

                {/* Subtle Texture Grid */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 relative z-10 w-full my-auto flex flex-col justify-center">
                    
                    {/* ========================================================== */}
                    {/* MOBILE & TABLET MODERN VISUAL BENTO LAYOUT (Clean & Minimal)*/}
                    {/* ========================================================== */}
                    <div className="block lg:hidden w-full space-y-3 sm:space-y-4 pt-1 sm:pt-4 pb-2 text-center my-auto">
                        
                        {/* Compact Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-rose-100 text-[10.5px] sm:text-xs font-normal backdrop-blur-xs max-w-full truncate"
                        >
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                            {renderIcon(badgeSvg, Store, "w-3 h-3 text-rose-200 shrink-0")}
                            <span className="truncate">{badgeText}</span>
                        </motion.div>

                        {/* Main Title H1 */}
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-xl sm:text-2xl md:text-3xl font-thin text-white leading-snug tracking-tight font-['Raleway'] max-w-md md:max-w-xl mx-auto px-2"
                        >
                            {titleText}
                        </motion.h1>

                        {/* Centerpiece: Sculpted Asymmetric Organic Pop-Out BA Canvas (Bolder & Taller Proportion) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                            className="relative flex justify-center items-end max-w-[310px] sm:max-w-[380px] md:max-w-[430px] mx-auto pt-3 pb-0"
                        >
                            
                            {/* Layer 1: Outer Offset Glowing Frame */}
                            <div className="absolute -inset-2.5 bottom-0 top-12 sm:top-14 md:top-16 rounded-tl-[72px] sm:rounded-tl-[84px] md:rounded-tl-[96px] rounded-tr-[28px] sm:rounded-tr-[34px] rounded-br-[64px] sm:rounded-br-[76px] md:rounded-br-[88px] rounded-bl-[24px] sm:rounded-bl-[28px] bg-gradient-to-br from-amber-400/20 via-rose-500/10 to-transparent border border-white/15 pointer-events-none z-0" />

                            {/* Layer 2: Main Asymmetric Glass Canvas */}
                            <div className="absolute inset-x-2.5 bottom-0 top-14 sm:top-16 md:top-18 rounded-tl-[64px] sm:rounded-tl-[76px] md:rounded-tl-[88px] rounded-tr-[24px] sm:rounded-tr-[30px] rounded-br-[56px] sm:rounded-br-[68px] md:rounded-br-[80px] rounded-bl-[20px] sm:rounded-bl-[24px] bg-gradient-to-b from-white/20 via-white/10 to-white/5 backdrop-blur-2xl border border-white/30 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] z-0 overflow-hidden">
                                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-amber-300/25 blur-xl pointer-events-none" />
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-rose-500/20 blur-xl pointer-events-none" />
                                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />
                            </div>

                            {/* Decorative Dark Accent Dot */}
                            <div className="absolute left-0 top-16 sm:top-20 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#7e021f] border-2 border-white/50 shadow-md z-20" />

                            {/* Decorative Amber Orb */}
                            <div className="absolute -right-1 top-8 sm:top-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-500/40 to-amber-300/50 border border-amber-200/50 backdrop-blur-md shadow-md z-0 pointer-events-none" />

                            {/* BA Ambassador Cutout Image (Taller & Bolder) */}
                            <motion.img
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                src={heroImageSrc}
                                alt="Tim Pelayanan Dancell"
                                width={1200}
                                height={1277}
                                fetchpriority="high"
                                decoding="async"
                                className="relative z-10 h-[300px] sm:h-[360px] md:h-[410px] max-h-[48vh] sm:max-h-[54vh] w-auto object-contain object-bottom drop-shadow-[0_15px_25px_rgba(0,0,0,0.55)]"
                            />

                            {/* Floating Micro-Widget 1 (Left): 100% Garansi */}
                            <motion.div
                                animate={{ y: [-3, 3, -3] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -left-5 sm:-left-7 top-[54%] -translate-y-1/2 bg-white/95 backdrop-blur-md py-1.5 px-2.5 sm:px-3.5 rounded-xl shadow-xl border border-white flex items-center gap-1.5 text-slate-800 z-30"
                            >
                                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#800020] shrink-0" />
                                <span className="text-[10px] sm:text-xs font-bold text-slate-900 leading-none">
                                    100% Garansi
                                </span>
                            </motion.div>

                            {/* Floating Micro-Widget 2 (Right): 58 Outlet */}
                            <motion.div
                                animate={{ y: [3, -3, 3] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                className="absolute -right-5 sm:-right-7 top-14 sm:top-18 bg-white/95 backdrop-blur-md py-1.5 px-2.5 sm:px-3.5 rounded-xl shadow-xl border border-white flex items-center gap-1.5 text-slate-800 z-30"
                            >
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                                <span className="text-[10px] sm:text-xs font-bold text-slate-900 leading-none">
                                    58 Outlet Jatim
                                </span>
                            </motion.div>

                        </motion.div>

                        {/* Minimalist Trust Features Highlight Row */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="pt-2 flex items-center justify-center flex-wrap gap-3 sm:gap-6 text-[10px] sm:text-xs font-normal text-rose-100/80"
                        >
                            <div className="flex items-center gap-1">
                                {renderIcon(feature1Svg, ShieldCheck, "w-3 h-3 text-rose-300")}
                                <span>{feature1Text}</span>
                            </div>
                            <span className="opacity-40">•</span>
                            <div className="flex items-center gap-1">
                                {renderIcon(feature2Svg, Laptop, "w-3 h-3 text-rose-300")}
                                <span>{feature2Text}</span>
                            </div>
                            <span className="opacity-40">•</span>
                            <div className="flex items-center gap-1">
                                {renderIcon(feature3Svg, MapPin, "w-3 h-3 text-rose-300")}
                                <span>{feature3Text}</span>
                            </div>
                        </motion.div>

                    </div>


                    {/* ========================================================== */}
                    {/* DESKTOP 2-COLUMN LAYOUT (Visible on Desktop lg:grid)       */}
                    {/* ========================================================== */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-8 lg:gap-[3vw] items-center w-full">
                        
                        {/* Left Hero Text Column (Compact & Balanced for Laptop Viewports) */}
                        <div className="ps-16 lg:col-span-6 space-y-4 xl:space-y-5 2xl:space-y-7 text-left flex flex-col justify-center">
                            
                            {/* Pill Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1 xl:px-4 xl:py-1.5 rounded-full bg-white/10 border border-white/20 text-rose-100 text-[11px] xl:text-xs 2xl:text-sm font-normal backdrop-blur-xs shadow-xs self-start"
                            >
                                <span className="flex h-1.5 w-1.5 xl:h-2 xl:w-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                                {renderIcon(badgeSvg, Store, "w-3 h-3 xl:w-3.5 xl:h-3.5 text-rose-200 shrink-0")}
                                <span>{badgeText}</span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-thin text-white leading-[1.18] tracking-tight font-['Raleway'] max-w-xl xl:max-w-2xl"
                            >
                                {titleText}
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xs xl:text-sm 2xl:text-base text-rose-100/85 font-normal leading-relaxed max-w-lg xl:max-w-xl whitespace-pre-line"
                            >
                                {descText}
                            </motion.p>

                            {/* CTA Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex items-center justify-start gap-3 xl:gap-4 pt-1"
                            >
                                <a
                                    href={primaryBtnLink}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 xl:px-6 xl:py-3 2xl:px-8 2xl:py-4 rounded-xl 2xl:rounded-2xl bg-white text-[#800020] font-semibold text-xs xl:text-sm 2xl:text-base shadow-md hover:bg-rose-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {renderIcon(primaryBtnSvg, MapPin, "w-3.5 h-3.5 xl:w-4 xl:h-4 text-[#800020]")}
                                    <span>{primaryBtnText}</span>
                                </a>
                                <a
                                    href={secondaryBtnLink}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 xl:px-5 xl:py-3 2xl:px-7 2xl:py-4 rounded-xl 2xl:rounded-2xl bg-white/10 border border-white/25 text-white font-medium text-xs xl:text-sm 2xl:text-base hover:bg-white/20 backdrop-blur-xs transition-all duration-200"
                                >
                                    {renderIcon(secondaryBtnSvg, ShoppingBag, "w-3.5 h-3.5 xl:w-4 xl:h-4 text-rose-300")}
                                    <span>{secondaryBtnText}</span>
                                </a>
                            </motion.div>

                            {/* Quick Trust Highlights */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="pt-4 xl:pt-5 border-t border-white/15 flex flex-wrap items-center justify-start gap-4 xl:gap-6 2xl:gap-8 text-[11px] xl:text-xs 2xl:text-sm font-normal text-rose-100/80"
                            >
                                <div className="flex items-center gap-1.5 xl:gap-2">
                                    {renderIcon(feature1Svg, ShieldCheck, "w-3.5 h-3.5 xl:w-4 xl:h-4 text-rose-300")}
                                    <span>{feature1Text}</span>
                                </div>
                                <div className="flex items-center gap-1.5 xl:gap-2">
                                    {renderIcon(feature2Svg, Laptop, "w-3.5 h-3.5 xl:w-4 xl:h-4 text-rose-300")}
                                    <span>{feature2Text}</span>
                                </div>
                                <div className="flex items-center gap-1.5 xl:gap-2">
                                    {renderIcon(feature3Svg, MapPin, "w-3.5 h-3.5 xl:w-4 xl:h-4 text-rose-300")}
                                    <span>{feature3Text}</span>
                                </div>
                            </motion.div>

                        </div>

                        {/* Right Hero Image Column (Sculpted Asymmetric Organic Bento / Pop-Out Portrait Aesthetic) */}
                        <div className="lg:col-span-6 relative flex justify-center items-center h-full">
                            
                            {/* Ambient Soft Glows */}
                            <div className="absolute bottom-12 right-1/2 translate-x-1/2 w-72 h-72 xl:w-[400px] xl:h-[400px] 2xl:w-[500px] 2xl:h-[500px] bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />

                            {/* Outer Layered Canvas Container (Compact & Refined Proportion) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.94, y: 25 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                                style={{ y: y1, opacity }}
                                className="relative z-10 w-full max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] 2xl:max-w-[500px] flex items-end justify-center"
                            >
                                
                                {/* Layer 1: Outer Offset Glowing Aura Frame */}
                                <div className="absolute -inset-2.5 bottom-0 top-12 sm:top-14 xl:top-16 rounded-tl-[80px] xl:rounded-tl-[96px] rounded-tr-[32px] xl:rounded-tr-[40px] rounded-br-[70px] xl:rounded-br-[88px] rounded-bl-[28px] xl:rounded-bl-[36px] bg-gradient-to-br from-amber-400/20 via-rose-500/10 to-transparent border border-white/15 pointer-events-none z-0" />

                                {/* Layer 2: Main Asymmetrical Sculpted Glass Canvas */}
                                <div className="absolute inset-x-2.5 bottom-0 top-14 sm:top-16 xl:top-18 rounded-tl-[72px] xl:rounded-tl-[88px] rounded-tr-[28px] xl:rounded-tr-[34px] rounded-br-[64px] xl:rounded-br-[80px] rounded-bl-[24px] xl:rounded-bl-[30px] bg-gradient-to-b from-white/20 via-white/10 to-white/5 backdrop-blur-2xl border border-white/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] z-0 overflow-hidden">
                                    {/* Abstract Radiant Light Beams inside canvas */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-300/25 blur-2xl pointer-events-none" />
                                    <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-rose-500/20 blur-2xl pointer-events-none" />
                                    {/* High-end Subtle Dot Grid Pattern */}
                                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:16px_16px] pointer-events-none" />
                                </div>

                                {/* Floating Decorative Dark Velvet Dot (Top Left Shape Accent) */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.35 }}
                                    className="absolute left-0 top-16 xl:top-20 w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-[#7e021f] border-2 border-white/50 shadow-xl z-20 hidden sm:block" 
                                />

                                {/* Floating Decorative Warm Amber Orb (Top Right Shape Accent) */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="absolute -right-1 top-6 xl:top-8 w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-gradient-to-tr from-amber-500/40 to-amber-300/50 border border-amber-200/50 backdrop-blur-md shadow-lg z-0 hidden sm:block pointer-events-none" 
                                />

                                {/* Compact Pop-Out Ambassador Portrait (Firmly Anchored to Frame) */}
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                                    src={heroImageSrc}
                                    alt="Tim Pelayanan Dancell"
                                    width={1200}
                                    height={1277}
                                    fetchpriority="high"
                                    decoding="async"
                                    className="relative z-10 h-[360px] lg:h-[390px] xl:h-[430px] 2xl:h-[500px] max-h-[50vh] 2xl:max-h-[58vh] w-auto object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:scale-[1.01]"
                                />

                                {/* ========================================================== */}
                                {/* FLOATING MICRO-WIDGETS (Interactive Glass Cards)          */}
                                {/* ========================================================== */}

                                {/* Widget 1 (Mid-Left): 100% Garansi Resmi */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, x: -15 }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: 1, 
                                        x: 0,
                                        y: [-4, 4, -4]
                                    }}
                                    transition={{
                                        opacity: { duration: 0.5, delay: 0.45 },
                                        scale: { duration: 0.5, delay: 0.45 },
                                        x: { duration: 0.5, delay: 0.45 },
                                        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.95 }
                                    }}
                                    className="absolute -left-5 xl:-left-8 top-[52%] -translate-y-1/2 bg-white/95 backdrop-blur-md py-2 px-3 xl:py-2.5 xl:px-3.5 rounded-xl shadow-2xl border border-white flex items-center gap-2 xl:gap-2.5 text-slate-800 z-30 hover:scale-105 transition-transform cursor-default"
                                >
                                    <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-lg bg-rose-50 text-[#800020] flex items-center justify-center font-bold shrink-0 border border-rose-100 shadow-2xs">
                                        {renderIcon(feature1Svg, ShieldCheck, "w-3.5 h-3.5 xl:w-4 xl:h-4 text-[#800020]")}
                                    </div>
                                    <div>
                                        <span className="text-[8.5px] xl:text-[9.5px] uppercase font-bold tracking-wider text-slate-400 block leading-tight">
                                            Jaminan Mutu
                                        </span>
                                        <span className="text-[11px] xl:text-xs font-bold text-slate-900 leading-tight">
                                            100% Garansi Resmi
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Widget 2 (Top-Right): 58 Outlet Jatim */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, x: 15 }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: 1, 
                                        x: 0,
                                        y: [4, -4, 4]
                                    }}
                                    transition={{
                                        opacity: { duration: 0.5, delay: 0.55 },
                                        scale: { duration: 0.5, delay: 0.55 },
                                        x: { duration: 0.5, delay: 0.55 },
                                        y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.05 }
                                    }}
                                    className="absolute -right-6 xl:-right-10 top-10 xl:top-12 bg-white/95 backdrop-blur-md py-1.5 px-3 xl:py-2 xl:px-3.5 rounded-xl shadow-xl border border-white flex items-center gap-1.5 text-slate-800 z-30 hover:scale-105 transition-transform cursor-default"
                                >
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                                    <span className="text-[11px] xl:text-xs font-bold text-slate-900">58 Outlet Jatim</span>
                                </motion.div>

                                {/* Widget 3 (Bottom-Right / Insights Card): Dancell Care */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: 1,
                                        y: [-3, 3, -3]
                                    }}
                                    transition={{
                                        opacity: { duration: 0.5, delay: 0.65 },
                                        scale: { duration: 0.5, delay: 0.65 },
                                        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.15 }
                                    }}
                                    className="absolute -right-3 xl:-right-6 bottom-0 xl:bottom-2 bg-white/95 backdrop-blur-md p-3 xl:p-3.5 rounded-2xl shadow-2xl border border-white max-w-[180px] xl:max-w-[200px] text-slate-800 z-30 space-y-1 text-left hover:scale-105 transition-transform hidden sm:block cursor-default"
                                >
                                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                                        <span className="text-xs font-black uppercase tracking-wider text-[#800020]">
                                            DANCELL CARE
                                        </span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#800020]"></span>
                                    </div>
                                    <p className="text-[9.5px] xl:text-[10px] text-slate-600 leading-relaxed font-medium">
                                        Tukar tambah mudah &amp; garansi terpercaya sejak 2008.
                                    </p>
                                </motion.div>

                            </motion.div>
                        </div>

                    </div>

                </div>

                {/* Interactive Scroll Down Indicator (Mouse Pill & Bouncing Dot) */}
                <motion.button
                    type="button"
                    onClick={handleScrollDown}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="absolute bottom-2 sm:bottom-3 lg:bottom-4 w-full z-30 flex flex-col items-center gap-1.5 text-rose-200/75 hover:text-white transition-colors cursor-pointer group focus:outline-none"
                    aria-label="Scroll untuk jelajahi"
                >
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-[9.5px] sm:text-[10.5px] xl:text-[11px] font-medium tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                            Scroll untuk Jelajahi
                        </span>
                        <div className="w-5 h-8 sm:w-5.5 sm:h-9 rounded-full border border-white/30 group-hover:border-white/60 flex items-start justify-center p-1 backdrop-blur-xs transition-colors">
                            <motion.div
                                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                className="w-1.5 h-1.5 rounded-full bg-rose-200 group-hover:bg-white"
                            />
                        </div>
                    </div>
                </motion.button>

            </motion.div>
        </section>
    );
}
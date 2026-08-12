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
                className="sticky top-0 left-0 h-screen w-full flex flex-col justify-between pt-16 sm:pt-24 lg:pt-32 pb-4 lg:pb-0 overflow-hidden origin-center transform-gpu"
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
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 relative z-10 w-full flex-1 flex flex-col justify-center">
                    
                    {/* ========================================================== */}
                    {/* MOBILE SIMKOPDES-STYLE OVERLAY LAYOUT (Visible on Mobile)  */}
                    {/* ========================================================== */}
                    <div className="block lg:hidden w-full space-y-4 pt-2 pb-6 text-center">
                        
                        {/* Compact Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-rose-100 text-[11px] font-normal backdrop-blur-xs max-w-full truncate hidden"
                        >
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                            {renderIcon(badgeSvg, Store, "w-3 h-3 text-rose-200 shrink-0")}
                            <span className="truncate">{badgeText}</span>
                        </motion.div>

                        {/* Ambassador Image & Title Overlay Container */}
                        <div className="relative flex flex-col items-center justify-end pt-2 pb-2">
                            {/* Centered Ambassador Image */}
                            <motion.img
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                src={heroImageSrc}
                                alt="Tim Pelayanan Dancell"
                                width={1200}
                                height={1277}
                                fetchPriority="high"
                                decoding="async"
                                className="h-[260px] sm:h-[380px] w-auto object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] relative z-0 -mb-6"
                            />

                            {/* Main Title Overlaying Lower Image (Clean without box boundaries) */}
                            <motion.h1
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="relative z-10 text-2xl sm:text-3xl font-semibold text-white leading-snug tracking-tight font-['Raleway'] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] px-2 text-center"
                            >
                                {titleText}
                            </motion.h1>
                        </div>

                        {/* Floating Glass Card Box for Description & Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4 text-left relative z-20"
                        >
                            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-normal text-center whitespace-pre-line [@media(max-height:699px)]:hidden">
                                {descText}
                            </p>

                            <div className="flex sm:flex-row flex-col gap-2.5 pt-1">
                                <a
                                    href={primaryBtnLink}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white text-[#800020] font-semibold text-xs shadow-md active:scale-[0.98] transition-transform"
                                >
                                    {renderIcon(primaryBtnSvg, MapPin, "w-4 h-4 text-[#800020]")}
                                    <span>{primaryBtnText}</span>
                                    <ChevronRight className="w-4 h-4 ml-auto text-[#800020]" />
                                </a>
                                <a
                                    href={secondaryBtnLink}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white/10 border border-white/20 text-white font-medium text-xs hover:bg-white/20 transition-colors"
                                >
                                    {renderIcon(secondaryBtnSvg, ShoppingBag, "w-4 h-4 text-rose-300")}
                                    <span>{secondaryBtnText}</span>
                                </a>
                            </div>

                            {/* Trust Badge Highlights */}
                            <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-1 text-[10px] text-center text-rose-100/80 font-normal">
                                <div className="flex flex-col items-center gap-1">
                                    {renderIcon(feature1Svg, ShieldCheck, "w-3.5 h-3.5 text-rose-300")}
                                    <span>100% Garansi</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    {renderIcon(feature2Svg, Laptop, "w-3.5 h-3.5 text-rose-300")}
                                    <span>Lengkap</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    {renderIcon(feature3Svg, MapPin, "w-3.5 h-3.5 text-rose-300")}
                                    <span>{feature3Text}</span>
                                </div>
                            </div>
                        </motion.div>

                    </div>


                    {/* ========================================================== */}
                    {/* DESKTOP 2-COLUMN LAYOUT (Visible on Desktop lg:grid)       */}
                    {/* ========================================================== */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-12 2xl:gap-16 items-end">
                        
                        {/* Left Hero Text Column */}
                        <div className="lg:col-span-6 space-y-6 xl:space-y-8 2xl:space-y-10 text-left pb-16 lg:pb-24 xl:pb-16 2xl:pb-20">
                            
                            {/* Pill Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 xl:px-5 xl:py-2 rounded-full bg-white/10 border border-white/20 text-rose-100 text-xs xl:text-sm 2xl:text-base font-normal tracking-wide backdrop-blur-xs"
                            >
                                <span className="flex h-1.5 w-1.5 xl:h-2 xl:w-2 rounded-full bg-emerald-400 animate-ping" />
                                {renderIcon(badgeSvg, Store, "w-3.5 h-3.5 xl:w-4 xl:h-4 text-rose-200")}
                                <span>{badgeText}</span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-[5rem] font-normal text-white leading-[1.14] tracking-tight font-['Raleway']"
                            >
                                {titleText}
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-base xl:text-lg 2xl:text-xl 3xl:text-2xl text-rose-100/90 font-normal leading-relaxed max-w-2xl xl:max-w-3xl 2xl:max-w-4xl whitespace-pre-line"
                            >
                                {descText}
                            </motion.p>

                            {/* CTA Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex items-center justify-start gap-4 xl:gap-6 pt-2"
                            >
                                <a
                                    href={primaryBtnLink}
                                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 xl:px-9 xl:py-4 2xl:px-11 2xl:py-5 rounded-xl 2xl:rounded-2xl bg-white text-[#800020] font-semibold text-sm xl:text-base 2xl:text-lg shadow-lg hover:bg-rose-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {renderIcon(primaryBtnSvg, MapPin, "w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-[#800020]")}
                                    <span>{primaryBtnText}</span>
                                </a>
                                <a
                                    href={secondaryBtnLink}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 xl:px-8 xl:py-4 2xl:px-10 2xl:py-5 rounded-xl 2xl:rounded-2xl bg-white/10 border border-white/25 text-white font-medium text-sm xl:text-base 2xl:text-lg hover:bg-white/20 backdrop-blur-xs transition-all duration-200"
                                >
                                    {renderIcon(secondaryBtnSvg, ShoppingBag, "w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-rose-300")}
                                    <span>{secondaryBtnText}</span>
                                </a>
                            </motion.div>

                            {/* Quick Trust Highlights */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="pt-6 xl:pt-8 border-t border-white/15 flex flex-wrap items-center justify-start gap-6 xl:gap-10 2xl:gap-12 text-xs xl:text-sm 2xl:text-base font-normal text-rose-100/90"
                            >
                                <div className="flex items-center gap-2 xl:gap-3">
                                    {renderIcon(feature1Svg, ShieldCheck, "w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-rose-300")}
                                    <span>{feature1Text}</span>
                                </div>
                                <div className="flex items-center gap-2 xl:gap-3">
                                    {renderIcon(feature2Svg, Laptop, "w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-rose-300")}
                                    <span>{feature2Text}</span>
                                </div>
                                <div className="flex items-center gap-2 xl:gap-3">
                                    {renderIcon(feature3Svg, MapPin, "w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-rose-300")}
                                    <span>{feature3Text}</span>
                                </div>
                            </motion.div>

                        </div>

                        {/* Right Hero Image Column */}
                        <div className="lg:col-span-6 relative flex justify-end items-end h-full">
                            <div className="absolute bottom-0 right-10 w-96 h-96 xl:w-[500px] xl:h-[500px] 2xl:w-[680px] 2xl:h-[680px] bg-rose-400/25 rounded-full blur-3xl pointer-events-none" />

                            <motion.div
                                style={{ y: y1, opacity }}
                                className="relative z-10 flex items-end justify-end w-full"
                            >
                                <motion.img
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    src={heroImageSrc}
                                    alt="Tim Pelayanan Dancell"
                                    width={1200}
                                    height={1277}
                                    fetchPriority="high"
                                    decoding="async"
                                    className="h-[540px] lg:h-[600px] xl:h-[680px] 2xl:h-[780px] 3xl:h-[880px] w-auto object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-[1.01]"
                                />
                            </motion.div>
                        </div>

                    </div>

                </div>

            </motion.div>
        </section>
    );
}

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    MapPin,
    ShieldCheck,
    Store,
    ShoppingBag,
    Laptop
} from "lucide-react";

export default function HeroSection({ hero, heroImageSrc = "/images/hero.png" }) {
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
    const badgeText = hero?.badge_text || "Pusat Ritel Gadget, Laptop & Aksesori — 56 Outlet Jawa Timur";
    const badgeSvg = hero?.badge_icon_svg;
    const titleText = hero?.title || "Pusat Ritel Gadget & Laptop, Terlengkap & Bergaransi Resmi";
    const descText = hero?.description || "Dancell (Dan Group) adalah jaringan ritel gadget, smartphone, laptop, hingga aksesori terlengkap di Jawa Timur. Berdiri sejak 2008, kini siap melayani Anda di 56 outlet resmi dengan jaminan 100% original, garansi resmi, dan tukar tambah tepercaya.";
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
    const feature3Text = hero?.feature_3_text || "56 Outlet Jawa Timur";
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
                }}
                className="sticky top-0 left-0 h-screen w-full flex flex-col justify-between pt-32 pb-0 overflow-hidden origin-center"
            >
                {/* Animated Ambient Background Glows */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-500/20 rounded-full blur-3xl pointer-events-none"
                />
                <motion.div
                    animate={{
                        y: [0, -25, 0],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
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
                                {renderIcon(badgeSvg, Store, "w-3.5 h-3.5 text-rose-200")}
                                <span>{badgeText}</span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl sm:text-5xl lg:text-4xl font-normal text-white leading-[1.16] tracking-tight font-['Raleway']"
                            >
                                {titleText}
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-base sm:text-md text-rose-100/90 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0 whitespace-pre-line"
                            >
                                {descText}
                            </motion.p>

                            {/* CTA Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
                            >
                                <a
                                    href={primaryBtnLink}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white text-[#800020] font-medium text-sm shadow-lg hover:bg-rose-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {renderIcon(primaryBtnSvg, MapPin, "w-4 h-4 text-[#800020]")}
                                    <span>{primaryBtnText}</span>
                                </a>
                                <a
                                    href={secondaryBtnLink}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/25 text-white font-medium text-sm hover:bg-white/20 backdrop-blur-xs transition-all duration-200"
                                >
                                    {renderIcon(secondaryBtnSvg, ShoppingBag, "w-4 h-4 text-rose-300")}
                                    <span>{secondaryBtnText}</span>
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
                                    {renderIcon(feature1Svg, ShieldCheck, "w-4 h-4 text-rose-300")}
                                    <span>{feature1Text}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {renderIcon(feature2Svg, Laptop, "w-4 h-4 text-rose-300")}
                                    <span>{feature2Text}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {renderIcon(feature3Svg, MapPin, "w-4 h-4 text-rose-300")}
                                    <span>{feature3Text}</span>
                                </div>
                            </motion.div>

                        </div>

                        {/* Right Hero Image Column */}
                        <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-end h-full">
                            <div className="absolute bottom-0 right-10 w-96 h-96 bg-rose-400/25 rounded-full blur-3xl pointer-events-none" />

                            <motion.div
                                style={{ y: y1, opacity }}
                                className="relative z-10 flex items-end justify-center lg:justify-end w-full"
                            >
                                <motion.img
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    src={heroImageSrc}
                                    alt="Tim Pelayanan Dancell"
                                    className="h-[460px] sm:h-[540px] lg:h-[600px] w-auto object-contain object-bottom drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-[1.01]"
                                />
                            </motion.div>
                        </div>

                    </div>
                </div>

            </motion.div>
        </section>
    );
}

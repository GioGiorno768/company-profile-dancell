import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, MoveHorizontal } from 'lucide-react';

export default function HistoryTimeline({ historyTimeline }) {
    // 1. Dynamic Header Content from Database
    const headerBadge = historyTimeline?.header_badge || 'Perjalanan & Rekam Jejak';
    const headerTitle = historyTimeline?.header_title || 'Sejarah Pertumbuhan Dancell';
    const headerDesc = historyTimeline?.header_description || 'Dari toko pertama di Warujayeng pada tahun 2008, bertransformasi menjadi jaringan ritel 58 cabang terdepan di Jawa Timur.';

    // Default aesthetic fallback images & color accents
    const defaultVisuals = [
        { imageSrc: '/images/hero.webp', gradientColor: 'from-amber-600/15 via-[#800020]/20 to-transparent' },
        { imageSrc: '/images/smartphone_hero.png', gradientColor: 'from-rose-600/15 via-[#800020]/20 to-transparent' },
        { imageSrc: '/images/hero.webp', gradientColor: 'from-blue-600/15 via-[#800020]/20 to-transparent' },
        { imageSrc: '/images/smartphone_hero.png', gradientColor: 'from-purple-600/15 via-[#800020]/20 to-transparent' },
        { imageSrc: '/images/hero.webp', gradientColor: 'from-emerald-600/15 via-[#800020]/20 to-transparent' },
        { imageSrc: '/images/hero.webp', gradientColor: 'from-[#800020]/30 via-rose-900/20 to-transparent' },
    ];

    // Fallback static slides in case DB is empty
    const fallbackSlides = [
        {
            year: '2008',
            title: 'Kelahiran Toko Pertama di Warujayeng',
            subtitle: 'Awal Mula Perjalanan Ritel Gadget Terpercaya',
            description: 'Dancell pertama kali didirikan di Warujayeng, Nganjuk. Dimulai dari toko ritel sederhana dengan satu visi utama: menyediakan ponsel original dengan harga jujur serta pelayanan yang ramah dan bersahaja kepada masyarakat.',
            stat1Val: 'Toko Pertama',
            stat1Label: 'Warujayeng, Nganjuk',
            stat2Val: '100% Produk Original',
            stat2Label: 'Fondasi Kejujuran & Pelayanan',
            imageSrc: '/images/hero.webp',
            imageAlt: 'Toko Pertama Dancell Warujayeng',
            gradientColor: 'from-amber-600/15 via-[#800020]/20 to-transparent',
        },
        {
            year: '2012 - 2015',
            title: 'Pembukaan Dancell 2 & Penguatan Fondasi',
            subtitle: 'Ekspansi Tahap Awal & Standar Layanan Unggul',
            description: 'Tingginya antusiasme dan kepercayaan pelanggan mendorong pembukaan cabang Dancell 2. Kapasitas tim diperkuat melalui standarisasi pelayanan terstruktur, penyediaan garansi resmi, dan komitmen purnajual prima.',
            stat1Val: 'Dancell 2',
            stat1Label: 'Cabang Kedua Dibuka',
            stat2Val: 'Garansi Resmi',
            stat2Label: 'Standar Operasional Ritel',
            imageSrc: '/images/smartphone_hero.png',
            imageAlt: 'Pembukaan Dancell 2',
            gradientColor: 'from-rose-600/15 via-[#800020]/20 to-transparent',
        },
        {
            year: '2018',
            title: 'Era Transformasi & Standarisasi Modern',
            subtitle: 'Penerapan Sistem Digital & Seragam Profesional',
            description: 'Dancell berevolusi menerapkan tata kelola toko ritel modern dengan seragam profesional khas Dancell, standarisasi tata letak toko yang nyaman, serta integrasi teknologi stok untuk menyambut lonjakan tren smartphone di Jawa Timur.',
            stat1Val: 'Ritel Modern',
            stat1Label: 'Sistem Manajemen Digital',
            stat2Val: 'Tim Terlatih',
            stat2Label: 'Standar Pelayanan Konsisten',
            imageSrc: '/images/hero.webp',
            imageAlt: 'Era Ritel Modern Dancell',
            gradientColor: 'from-blue-600/15 via-[#800020]/20 to-transparent',
        },
        {
            year: '2020 - 2022',
            title: 'Ekspansi Masif Kediri Raya & Mataraman',
            subtitle: 'Menembus 34 Outlet di Berbagai Wilayah Strategis',
            description: 'Strategi ekspansi multi-cabang terstruktur menjangkau Kediri, Mojoroto, Srengat Blitar, hingga Magetan. Dancell resmi menjadi rujukan utama masyarakat dengan ketersediaan produk brand global terlengkap.',
            stat1Val: '34 Cabang',
            stat1Label: 'Kediri, Blitar, Magetan',
            stat2Val: 'Mitra Resmi',
            stat2Label: 'Apple, Samsung, Xiaomi, Oppo, Vivo',
            imageSrc: '/images/smartphone_hero.png',
            imageAlt: 'Ekspansi Multi Cabang Dancell',
            gradientColor: 'from-purple-600/15 via-[#800020]/20 to-transparent',
        },
        {
            year: '2023 - 2025',
            title: 'Penetrasi Jaringan Menyeluruh Jawa Timur',
            subtitle: 'Jangkauan Menembus 53 Outlet Aktif',
            description: 'Dancell memperluas penetrasi ke kawasan Uteran, Mojosari, Jombang, hingga Sidoarjo. Penguatan rantai pasok dan sinergi promosi digital menjadikan Dancell destinasi belanja gadget nomor satu di Jawa Timur.',
            stat1Val: '53 Cabang',
            stat1Label: 'Jangkauan Luas Jawa Timur',
            stat2Val: 'Distribusi Cepat',
            stat2Label: 'Ready Stock Semua Tipe',
            imageSrc: '/images/hero.webp',
            imageAlt: 'Penetrasi Jawa Timur',
            gradientColor: 'from-emerald-600/15 via-[#800020]/20 to-transparent',
        },
        {
            year: '2026',
            title: '58 Outlet Aktif — Pemimpin Ritel Jatim',
            subtitle: 'Jaringan Outlet Gadget Terbesar di Jawa Timur',
            description: 'Kondisi terkini dengan 58 outlet aktif yang tersebar di Nganjuk, Kediri, Blitar, Jombang, Mojokerto, Sidoarjo, dan sekitarnya. Terus melangkah maju memberikan pengalaman belanja gadget terbaik bergaransi resmi.',
            stat1Val: '58 Outlet Aktif',
            stat1Label: 'Kondisi Terkini di Jawa Timur',
            stat2Val: '100% Bergaransi',
            stat2Label: 'Garansi Resmi Indonesia',
            imageSrc: '/images/hero.webp',
            imageAlt: '58 Outlet Dancell Terkini',
            gradientColor: 'from-[#800020]/30 via-rose-900/20 to-transparent',
        },
    ];

    // 2. Dynamic Database Binding
    let slides = fallbackSlides;
    const dbMilestones = historyTimeline?.milestones;

    if (Array.isArray(dbMilestones) && dbMilestones.length > 0) {
        slides = dbMilestones.map((ms, idx) => {
            const visual = defaultVisuals[idx % defaultVisuals.length];
            return {
                year: ms.year || ('200' + (8 + idx * 2)),
                title: ms.title || 'Momen Bersejarah',
                subtitle: ms.subtitle || 'Perjalanan & Pertumbuhan Dancell',
                description: ms.desc || 'Dedikasi terbaik dalam menghadirkan produk original dan layanan terpercaya.',
                stat1Val: ms.stat_badge || 'Toko Utama',
                stat1Label: ms.stat_label || 'Jawa Timur',
                stat2Val: ms.highlight_tag || (ms.current ? 'Kondisi Terkini' : '100% Resmi'),
                stat2Label: 'Garansi Resmi Indonesia',
                imageSrc: ms.image || visual.imageSrc,
                imageAlt: ms.title || 'Sejarah Dancell',
                gradientColor: visual.gradientColor,
            };
        });
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    // Interactive Grab / Touch Swipe states
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef(0);
    const dragThreshold = 40; // minimum pixels dragged to trigger slide transition

    const SLIDE_DURATION = 6000;

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleJumpTo = (idx) => {
        setDirection(idx > currentIndex ? 1 : -1);
        setCurrentIndex(idx);
    };

    // Grab & Touch Gesture Handlers
    const handleDragStart = (clientX) => {
        setIsDragging(true);
        setIsPaused(true);
        dragStartX.current = clientX;
    };

    const handleDragEnd = (clientX) => {
        if (!isDragging) return;
        setIsDragging(false);
        const distance = clientX - dragStartX.current;
        if (distance < -dragThreshold) {
            handleNext();
        } else if (distance > dragThreshold) {
            handlePrev();
        }
    };

    // Mouse Events
    const onMouseDown = (e) => {
        handleDragStart(e.clientX);
    };

    const onMouseUp = (e) => {
        handleDragEnd(e.clientX);
    };

    // Touch Events for Mobile
    const onTouchStart = (e) => {
        if (e.touches && e.touches[0]) {
            handleDragStart(e.touches[0].clientX);
        }
    };

    const onTouchEnd = (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
            handleDragEnd(e.changedTouches[0].clientX);
        }
    };

    useEffect(() => {
        if (isPaused || isDragging) return;

        const timer = setInterval(() => {
            handleNext();
        }, SLIDE_DURATION);

        return () => clearInterval(timer);
    }, [currentIndex, isPaused, isDragging, slides.length]);

    const activeSlide = slides[currentIndex] || slides[0];

    // Smooth subtle typography transition
    const textVariants = {
        enter: (dir) => ({
            x: dir > 0 ? 25 : -25,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.45,
                ease: [0.25, 1, 0.5, 1],
            },
        },
        exit: (dir) => ({
            x: dir > 0 ? -25 : 25,
            opacity: 0,
            transition: {
                duration: 0.25,
                ease: [0.25, 1, 0.5, 1],
            },
        }),
    };

    const imageVariants = {
        enter: {
            opacity: 0,
            scale: 1.04,
        },
        center: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            scale: 0.98,
            transition: {
                duration: 0.4,
                ease: "easeIn",
            },
        },
    };

    return (
        <section 
            id="history" 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
                if (isDragging) setIsDragging(false);
                setIsPaused(false);
            }}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className={'relative w-full bg-slate-950 overflow-hidden font-sans py-16 sm:py-20 lg:py-28 select-none transition-colors duration-300 ' + (
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
            )}
            title="Tarik / Geser ke kiri atau kanan untuk beralih era sejarah"
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#800020]/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

            {/* SEAMLESS BACKGROUND PICTURE WITH ELEGANT ANGLED DIAGONAL GRADIENT BLEND */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={'angled-img-' + currentIndex}
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="relative w-full h-full"
                    >
                        <img 
                            src={activeSlide.imageSrc} 
                            alt={activeSlide.imageAlt}
                            className="w-full h-full object-cover object-center lg:object-right filter brightness-95 contrast-105"
                        />
                        <div className={'absolute inset-0 bg-gradient-to-br ' + activeSlide.gradientColor} />
                    </motion.div>
                </AnimatePresence>

                {/* 1. MOBILE GRADIENT OVERLAY (Subtle, Clean & Deep) */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/92 via-slate-950/85 to-slate-950/75 z-10 lg:hidden" />

                {/* 2. DESKTOP ELEGANT ANGLED / DIAGONAL GRADIENT (115deg sweep from dark slate left to transparent right) */}
                <div 
                    className="absolute inset-0 z-10 hidden lg:block"
                    style={{
                        background: 'linear-gradient(115deg, #020617 0%, #020617 38%, rgba(2,6,23,0.95) 48%, rgba(2,6,23,0.7) 62%, rgba(2,6,23,0.2) 80%, transparent 100%)'
                    }}
                />

                {/* Desktop Top & Bottom Smooth Edge Vignettes */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent z-10 hidden lg:block" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-10 hidden lg:block" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950/80 to-transparent z-10 hidden lg:block" />
            </div>

            {/* FOREGROUND MAIN CONTENT (Aligned to standard max-w-7xl) */}
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 w-full relative z-20 pointer-events-auto">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[380px] sm:min-h-[420px] lg:min-h-[460px]">
                    
                    {/* LEFT COLUMN: ELEGANT THIN TYPOGRAPHY & NARRATIVE (7 Cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                        
                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={'clean-text-' + currentIndex}
                                custom={direction}
                                variants={textVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="space-y-4 sm:space-y-5"
                            >
                                {/* 1. Header Badge & Era Pill */}
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-rose-200 text-xs font-normal tracking-wide backdrop-blur-xs">
                                        <Award className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                                        <span>{headerBadge}</span>
                                    </span>

                                    <span className="px-3.5 py-1 rounded-full bg-[#800020]/30 border border-rose-400/25 text-rose-200 text-xs font-normal font-mono tracking-wider backdrop-blur-xs">
                                        ERA {activeSlide.year}
                                    </span>
                                </div>

                                {/* 2. Main Title (Thin, Clean & Elegant Typography) */}
                                <div className="space-y-1">
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-normal text-white tracking-tight font-sans leading-snug">
                                        {activeSlide.title}
                                    </h2>
                                    <p className="text-xs sm:text-sm font-light text-rose-200/80 font-sans tracking-wide">
                                        {activeSlide.subtitle}
                                    </p>
                                </div>

                                {/* 3. Narrative Description Paragraph */}
                                <p className="text-slate-300/90 text-xs sm:text-sm lg:text-base font-light leading-relaxed max-w-2xl">
                                    {activeSlide.description}
                                </p>

                                {/* 4. Clean Minimalist Key Metrics */}
                                <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-4 text-xs sm:text-sm max-w-lg">
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0 shadow-xs shadow-rose-400/50" />
                                        <div>
                                            <span className="font-normal text-white text-sm sm:text-base block font-sans tracking-tight">
                                                {activeSlide.stat1Val}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-slate-400 font-light block">
                                                {activeSlide.stat1Label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 border-l border-white/10 pl-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-xs shadow-emerald-400/50" />
                                        <div>
                                            <span className="font-normal text-white text-sm sm:text-base block font-sans tracking-tight">
                                                {activeSlide.stat2Val}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-slate-400 font-light block">
                                                {activeSlide.stat2Label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </motion.div>
                        </AnimatePresence>

                    </div>

                    {/* RIGHT COLUMN: ELEGANT MINIMALIST SLIDER DOTS ONLY (5 Cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-end items-start sm:items-end min-h-0 lg:min-h-[380px] xl:min-h-[420px] gap-2.5">
                        
                        {/* SLEEK MINIMALIST DOT INDICATORS (—— • • •) */}
                        <div className="w-full flex items-center justify-start sm:justify-end gap-2 pt-2 lg:pt-0">
                            <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 rounded-full px-4 py-2.5 backdrop-blur-md shadow-lg">
                                {slides.map((_, idx) => (
                                    <button
                                        key={'angled-dot-' + idx}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleJumpTo(idx);
                                        }}
                                        className={'transition-all duration-300 rounded-full cursor-pointer ' + (
                                            currentIndex === idx
                                                ? 'w-7 h-1.5 bg-gradient-to-r from-rose-400 to-amber-300 shadow-xs shadow-rose-500/40'
                                                : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/70'
                                        )}
                                        title={'Lompat ke Era ' + slides[idx].year}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* SUBTLE INTERACTION HINT */}
                        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-light text-slate-400/80 tracking-wider">
                            <MoveHorizontal className="w-3.5 h-3.5 text-rose-300/70" />
                            <span>Geser / Drag untuk beralih era</span>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

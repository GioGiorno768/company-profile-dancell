import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Award, 
    CheckCircle2, 
    Sparkles, 
    ShieldCheck, 
    ExternalLink,
    X,
    MapPin,
    MoveHorizontal
} from 'lucide-react';
import { Icon } from '@iconify/react';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Interactive Draggable / Auto-Scrolling Marquee Row
   - Otomatis scroll perlahan & mulus (Float accumulator)
   - Berhenti otomatis saat di-hover / di-sentuh
   - Bisa di-drag / digeser ke kiri & ke kanan dengan bebas
   - Otomatis jalan lagi dengan mulus saat kursor keluar
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function DraggableMarqueeRow({ brands, direction = 'left', speed = 1.0, onSelectBrand, onHoverBrand }) {
    const rowRef = useRef(null);
    const isHoveredRef = useRef(false);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftStartRef = useRef(0);
    const movedRef = useRef(false);
    const posRef = useRef(0); // Float accumulator to avoid DOM scrollLeft truncation
    const [cursorGrabbing, setCursorGrabbing] = useState(false);

    // Quadruple items for infinite seamless looping
    const displayBrands = useMemo(() => {
        if (!brands || brands.length === 0) return [];
        return [...brands, ...brands, ...brands, ...brands];
    }, [brands]);

    // Initial setup: for 'right' direction, start in the middle
    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;
        const half = el.scrollWidth / 2;
        if (direction === 'right' && half > 0) {
            posRef.current = half;
            el.scrollLeft = half;
        } else {
            posRef.current = 0;
            el.scrollLeft = 0;
        }
    }, [direction, displayBrands]);

    // 60FPS Continuous Animation Loop with Float Accumulator
    useEffect(() => {
        let animationFrameId;
        let lastTime = performance.now();

        const step = (now) => {
            const dt = Math.min((now - lastTime) / 16.666, 3);
            lastTime = now;

            const el = rowRef.current;
            if (el && !isHoveredRef.current && !isDraggingRef.current) {
                const halfWidth = el.scrollWidth / 2;
                if (halfWidth > 0) {
                    if (direction === 'left') {
                        posRef.current += speed * dt;
                        if (posRef.current >= halfWidth) {
                            posRef.current -= halfWidth;
                        }
                    } else {
                        posRef.current -= speed * dt;
                        if (posRef.current <= 0) {
                            posRef.current += halfWidth;
                        }
                    }
                    el.scrollLeft = posRef.current;
                }
            }

            animationFrameId = requestAnimationFrame(step);
        };

        animationFrameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrameId);
    }, [direction, speed]);

    // Mouse Handlers
    const handleMouseDown = (e) => {
        const el = rowRef.current;
        if (!el) return;
        isDraggingRef.current = true;
        movedRef.current = false;
        startXRef.current = e.pageX - el.offsetLeft;
        scrollLeftStartRef.current = el.scrollLeft;
        posRef.current = el.scrollLeft;
        setCursorGrabbing(true);
    };

    const handleMouseMove = (e) => {
        const el = rowRef.current;
        if (!isDraggingRef.current || !el) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startXRef.current) * 1.5;

        if (Math.abs(walk) > 4) {
            movedRef.current = true;
        }

        const halfWidth = el.scrollWidth / 2;
        let newScrollLeft = scrollLeftStartRef.current - walk;

        if (halfWidth > 0) {
            while (newScrollLeft >= halfWidth) {
                newScrollLeft -= halfWidth;
                scrollLeftStartRef.current -= halfWidth;
            }
            while (newScrollLeft < 0) {
                newScrollLeft += halfWidth;
                scrollLeftStartRef.current += halfWidth;
            }
        }

        posRef.current = newScrollLeft;
        el.scrollLeft = newScrollLeft;
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
        setCursorGrabbing(false);
        if (rowRef.current) {
            posRef.current = rowRef.current.scrollLeft;
        }
    };

    const handleMouseEnter = () => {
        isHoveredRef.current = true;
        if (rowRef.current) {
            posRef.current = rowRef.current.scrollLeft;
        }
    };

    const handleMouseLeave = () => {
        isHoveredRef.current = false;
        isDraggingRef.current = false;
        setCursorGrabbing(false);
        if (rowRef.current) {
            posRef.current = rowRef.current.scrollLeft;
        }
    };

    // Touch Handlers for Mobile & Tablet
    const handleTouchStart = (e) => {
        const el = rowRef.current;
        if (!el) return;
        isHoveredRef.current = true;
        isDraggingRef.current = true;
        movedRef.current = false;
        startXRef.current = e.touches[0].pageX - el.offsetLeft;
        scrollLeftStartRef.current = el.scrollLeft;
        posRef.current = el.scrollLeft;
    };

    const handleTouchMove = (e) => {
        const el = rowRef.current;
        if (!isDraggingRef.current || !el) return;
        const x = e.touches[0].pageX - el.offsetLeft;
        const walk = (x - startXRef.current) * 1.3;

        if (Math.abs(walk) > 4) {
            movedRef.current = true;
        }

        const halfWidth = el.scrollWidth / 2;
        let newScrollLeft = scrollLeftStartRef.current - walk;

        if (halfWidth > 0) {
            while (newScrollLeft >= halfWidth) {
                newScrollLeft -= halfWidth;
                scrollLeftStartRef.current -= halfWidth;
            }
            while (newScrollLeft < 0) {
                newScrollLeft += halfWidth;
                scrollLeftStartRef.current += halfWidth;
            }
        }

        posRef.current = newScrollLeft;
        el.scrollLeft = newScrollLeft;
    };

    const handleTouchEnd = () => {
        isHoveredRef.current = false;
        isDraggingRef.current = false;
        if (rowRef.current) {
            posRef.current = rowRef.current.scrollLeft;
        }
    };

    return (
        <div
            ref={rowRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`flex items-center gap-5 overflow-x-auto no-scrollbar py-3 select-none ${
                cursorGrabbing ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
            }}
        >
            {displayBrands.map((brand, idx) => (
                <div
                    key={`${direction}-${brand.name}-${idx}`}
                    onClick={() => {
                        if (!movedRef.current) {
                            onSelectBrand(brand);
                        }
                    }}
                    onMouseEnter={() => onHoverBrand && onHoverBrand(brand)}
                    className="shrink-0 group relative bg-white/5 hover:bg-[#800020] border border-white/10 hover:border-rose-300/80 px-6 py-4 rounded-2xl backdrop-blur-md transition-all duration-300 cursor-pointer flex items-center gap-4 shadow-lg min-w-[210px] hover:scale-105 hover:-translate-y-1 transform-gpu pointer-events-auto"
                >
                    <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white text-white group-hover:text-[#800020] flex items-center justify-center shrink-0 transition-colors shadow-xs overflow-hidden p-2">
                        {brand.image && brand.image.trim() !== '' ? (
                            <img 
                                src={brand.image} 
                                alt={brand.name} 
                                className="w-full h-full object-contain filter group-hover:brightness-0 transition-all pointer-events-none" 
                                draggable={false}
                            />
                        ) : brand.icon && brand.icon.includes('<svg') ? (
                            <span dangerouslySetInnerHTML={{ __html: brand.icon }} className="w-6 h-6 flex items-center justify-center pointer-events-none" />
                        ) : (
                            <Icon icon={brand.icon || 'simple-icons:apple'} className="w-6 h-6 pointer-events-none" />
                        )}
                    </div>

                    <div className="pointer-events-none">
                        <h4 className="font-semibold text-white text-sm font-['Raleway'] tracking-wide group-hover:text-white">
                            {brand.name}
                        </h4>
                        <span className="text-[10px] text-slate-300 group-hover:text-rose-100 block font-normal">
                            {brand.tag}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function SocialImpact({ partnerBrand }) {
    const [selectedBrandModal, setSelectedBrandModal] = useState(null);

    // Fallbacks from DB partnerBrand model
    const headerBadge = partnerBrand?.header_badge || 'Brand Partner Resmi';
    const headerTitle = partnerBrand?.header_title || 'Mitra Brand Global Terkemuka';
    const headerDesc = partnerBrand?.header_desc || 'Dancell bermitra langsung dengan brand teknologi dunia untuk menghadirkan smartphone, laptop, dan aksesori 100% original bergaransi resmi.';

    const stat1Val = partnerBrand?.stat_1_val || '15+';
    const stat1Label = partnerBrand?.stat_1_label || 'Brand Global Resmi';
    const stat2Val = partnerBrand?.stat_2_val || '100%';
    const stat2Label = partnerBrand?.stat_2_label || 'Produk Original';
    const stat3Val = partnerBrand?.stat_3_val || '58';
    const stat3Label = partnerBrand?.stat_3_label || 'Outlet Ritel Aktif';
    const stat4Val = partnerBrand?.stat_4_val || 'Garansi';
    const stat4Label = partnerBrand?.stat_4_label || 'Resmi Indonesia';

    const smartphoneBrands = partnerBrand?.smartphone_brands && partnerBrand.smartphone_brands.length > 0
        ? partnerBrand.smartphone_brands
        : [
            { name: 'Apple', icon: 'simple-icons:apple', tag: 'Official Partner', desc: 'iPhone, iPad & Mac ecosystem' },
            { name: 'Samsung', icon: 'simple-icons:samsung', tag: 'Official SEIN', desc: 'Galaxy S, Z Fold & A Series' },
            { name: 'Xiaomi', icon: 'simple-icons:xiaomi', tag: 'Garansi Resmi TAM', desc: 'Xiaomi, Redmi & POCO' },
            { name: 'OPPO', icon: 'simple-icons:oppo', tag: 'Official Partner', desc: 'Find, Reno & A Series' },
            { name: 'Vivo', icon: 'simple-icons:vivo', tag: 'Official Partner', desc: 'X Series & V Series' },
            { name: 'Realme', icon: 'simple-icons:realme', tag: 'Official Partner', desc: 'GT Series & Number Series' },
            { name: 'ASUS', icon: 'simple-icons:asus', tag: 'ROG Partner', desc: 'ROG Phone & Zenfone' },
            { name: 'Google', icon: 'simple-icons:google', tag: 'Pixel Ecosystem', desc: 'Google Pixel & Nest' },
        ];

    const accessoryBrands = partnerBrand?.accessory_brands && partnerBrand.accessory_brands.length > 0
        ? partnerBrand.accessory_brands
        : [
            { name: 'Sony', icon: 'simple-icons:sony', tag: 'Official Audio', desc: 'WH-1000XM & WF Series' },
            { name: 'JBL', icon: 'simple-icons:jbl', tag: 'Official Audio', desc: 'Flip, Charge & Wave TWS' },
            { name: 'Anker', icon: 'simple-icons:anker', tag: 'Official Accessories', desc: 'GaN Prime Charger & Powerbank' },
            { name: 'SanDisk', icon: 'simple-icons:sandisk', tag: 'Official Storage', desc: 'Ultra MicroSD & Flash Drive' },
            { name: 'Lenovo', icon: 'simple-icons:lenovo', tag: 'Official Partner', desc: 'Tab & IdeaPad Series' },
            { name: 'Motorola', icon: 'simple-icons:motorola', tag: 'Official Partner', desc: 'Moto Razr & Edge' },
            { name: 'Marshall', icon: 'simple-icons:marshall', tag: 'Official Audio', desc: 'Emberton & Major Headphones' },
            { name: 'Nokia', icon: 'simple-icons:nokia', tag: 'Official Partner', desc: 'Nokia Tough & Smart Series' },
        ];

    const footerNote = partnerBrand?.footer_note || 'Seluruh produk brand di atas bergaransi resmi & tersedia di 58 outlet Dancell Jawa Timur.';
    const ctaBtnText = partnerBrand?.cta_btn_text || 'Temukan Outlet Terdekat';
    const ctaBtnLink = partnerBrand?.cta_btn_link || '#branches';

    return (
        <section id="products" className="py-24 bg-white relative overflow-hidden font-['Raleway']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-14">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-[#800020] text-xs font-semibold uppercase tracking-wider border border-rose-100 shadow-2xs"
                    >
                        <Award className="w-4 h-4 text-[#800020]" />
                        <span>{headerBadge}</span>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900 tracking-tight font-['Raleway']"
                    >
                        {headerTitle}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed"
                    >
                        {headerDesc}
                    </motion.p>
                </div>

                {/* Key Stats Bar */}
                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                        <div className="text-2xl font-semibold text-[#800020] font-['Raleway']">{stat1Val}</div>
                        <div className="text-xs text-slate-600 font-normal">{stat1Label}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                        <div className="text-2xl font-semibold text-[#800020] font-['Raleway']">{stat2Val}</div>
                        <div className="text-xs text-slate-600 font-normal">{stat2Label}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                        <div className="text-2xl font-semibold text-[#800020] font-['Raleway']">{stat3Val}</div>
                        <div className="text-xs text-slate-600 font-normal">{stat3Label}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                        <div className="text-2xl font-semibold text-[#800020] font-['Raleway']">{stat4Val}</div>
                        <div className="text-xs text-slate-600 font-normal">{stat4Label}</div>
                    </div>
                </div>

            </div>

            {/* Main Interactive Dark Card Container with Marquee */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-slate-800">
                    
                    {/* Ambient Background Glow */}
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Marquee Row Header with Drag Hint */}
                    <div className="flex items-center justify-between px-2 mb-4 relative z-10">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <MoveHorizontal className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                            <span>Hover untuk pause • Drag / Geser bebas • Klik untuk detail</span>
                        </div>
                        <span className="text-[11px] text-slate-400 hidden sm:inline-block">100% Produk Original</span>
                    </div>

                    {/* Infinite & Draggable Marquee Row 1 (Smartphone Brands) */}
                    <div className="relative overflow-hidden py-1 mb-4">
                        {/* Gradient Edge Fades */}
                        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-slate-900 to-transparent z-20" />
                        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-slate-900 to-transparent z-20" />

                        <DraggableMarqueeRow
                            brands={smartphoneBrands}
                            direction="left"
                            speed={1.0}
                            onSelectBrand={setSelectedBrandModal}
                        />
                    </div>

                    {/* Infinite & Draggable Marquee Row 2 (Accessory Brands) */}
                    <div className="relative overflow-hidden py-1 mb-4">
                        {/* Gradient Edge Fades */}
                        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-slate-900 to-transparent z-20" />
                        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-slate-900 to-transparent z-20" />

                        <DraggableMarqueeRow
                            brands={accessoryBrands}
                            direction="right"
                            speed={1.0}
                            onSelectBrand={setSelectedBrandModal}
                        />
                    </div>

                    {/* Active Brand Highlight Footer Bar */}
                    <div className="mt-4 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{footerNote}</span>
                        </div>

                        <a
                            href={ctaBtnLink}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-[#800020] hover:bg-rose-50 font-medium text-xs shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
                        >
                            <span>{ctaBtnText}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#800020]" />
                        </a>
                    </div>

                </div>
            </div>
        
            {/* BRAND DETAIL MODAL LIGHTBOX */}
            <AnimatePresence>
                {selectedBrandModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBrandModal(null)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
                        />

                        {/* Modal Dialog Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-900 to-[#36000d] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10 overflow-hidden"
                        >
                            {/* Ambient Glows */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedBrandModal(null)}
                                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors border border-white/10 z-20"
                                title="Tutup Modal"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Content Layout */}
                            <div className="space-y-6 relative z-10 text-center sm:text-left">
                                
                                {/* Badge Tag Top Header */}
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs font-semibold tracking-wide">
                                    <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                                    <span>{selectedBrandModal.tag || 'Official Brand Partner'}</span>
                                </div>

                                {/* Logo Presentation Showcase Box */}
                                <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-4 flex items-center justify-center shrink-0 shadow-xl border border-white/20 overflow-hidden group">
                                        {selectedBrandModal.image && selectedBrandModal.image.trim() !== '' ? (
                                            <img 
                                                src={selectedBrandModal.image} 
                                                alt={selectedBrandModal.name} 
                                                className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300" 
                                            />
                                        ) : selectedBrandModal.icon && selectedBrandModal.icon.includes('<svg') ? (
                                            <span dangerouslySetInnerHTML={{ __html: selectedBrandModal.icon }} className="w-12 h-12 flex items-center justify-center text-slate-900" />
                                        ) : (
                                            <Icon icon={selectedBrandModal.icon || 'simple-icons:apple'} className="w-12 h-12 text-slate-900" />
                                        )}
                                    </div>

                                    <div className="space-y-1.5 text-center sm:text-left">
                                        <h3 className="text-2xl sm:text-3xl font-bold font-['Raleway'] tracking-tight text-white">
                                            {selectedBrandModal.name}
                                        </h3>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-rose-200/90 font-medium">
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                100% Produk Original
                                            </span>
                                            <span className="text-white/30">•</span>
                                            <span>Garansi Resmi</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ecosystem & Product Description Box */}
                                {selectedBrandModal.desc && (
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                        <span className="text-[11px] font-semibold text-rose-200 uppercase tracking-wider block">
                                            Lini Produk & Ekosistem
                                        </span>
                                        <p className="text-sm text-slate-200 leading-relaxed font-normal">
                                            {selectedBrandModal.desc}
                                        </p>
                                    </div>
                                )}

                                {/* Trust Highlight */}
                                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Tersedia lengkap dengan promo spesial & garansi resmi di 58 outlet Dancell Jawa Timur.</span>
                                </div>

                                {/* Modal Action Buttons */}
                                <div className="flex sm:flex-row flex-col gap-3 pt-2">
                                    <a
                                        href={ctaBtnLink}
                                        onClick={() => setSelectedBrandModal(null)}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white text-[#800020] hover:bg-rose-50 font-semibold text-xs shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <MapPin className="w-4 h-4 text-[#800020]" />
                                        <span>Temukan Outlet Dancell Terdekat</span>
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedBrandModal(null)}
                                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium text-xs hover:bg-white/20 transition-colors"
                                    >
                                        Tutup
                                    </button>
                                </div>

                            </div>
                        </motion.div>

                    </div>
                )}
            </AnimatePresence>

        </section>

    );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { 
    Award, 
    ShieldCheck, 
    ExternalLink
} from 'lucide-react';

export default function SocialImpact({ partnerBrand }) {
    const [activeBrand, setActiveBrand] = useState(null);

    const headerBadge = partnerBrand?.header_badge || 'Mitra Resmi Brand Dunia';
    const headerTitle = partnerBrand?.header_title || 'Official Brand Partner & Distributor Ritel';
    const headerDesc = partnerBrand?.header_description || 'Dancell bekerja sama langsung dengan produsen smartphone dan aksesori teknologi terkemuka dunia untuk menjamin keaslian 100% & garansi resmi di 56 cabang.';

    const stat1Val = partnerBrand?.stat_1_val || '15+';
    const stat1Label = partnerBrand?.stat_1_label || 'Brand Global Resmi';
    const stat2Val = partnerBrand?.stat_2_val || '100%';
    const stat2Label = partnerBrand?.stat_2_label || 'Produk Original';
    const stat3Val = partnerBrand?.stat_3_val || '56';
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

    const footerNote = partnerBrand?.footer_note || 'Seluruh produk brand di atas bergaransi resmi & tersedia di 56 outlet Dancell Jawa Timur.';
    const ctaBtnText = partnerBrand?.cta_btn_text || 'Temukan Outlet Terdekat';
    const ctaBtnLink = partnerBrand?.cta_btn_link || '#branches';

    // Double lists for seamless infinite marquee scrolling
    const marqueeRow1 = [...smartphoneBrands, ...smartphoneBrands];
    const marqueeRow2 = [...accessoryBrands, ...accessoryBrands];

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

                    {/* Marquee Row 1 Header */}
                    <div className="flex items-center justify-between px-2 mb-6 relative z-10">
                        <span className="text-[11px] text-slate-400 hidden sm:inline-block">Hover / Sentuh logo untuk detail</span>
                        <span className="text-[11px] text-slate-400 hidden sm:inline-block">100% Produk Original</span>
                    </div>

                    {/* Infinite Marquee Row 1 (Moving Left) */}
                    <div className="relative overflow-hidden py-3 marquee-container mb-8">
                        {/* Gradient Edge Fades */}
                        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-slate-900 to-transparent z-20" />
                        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-slate-900 to-transparent z-20" />

                        <div className="animate-marquee gap-5 flex items-center">
                            {marqueeRow1.map((brand, idx) => (
                                <motion.div
                                    key={`r1-${idx}`}
                                    onMouseEnter={() => setActiveBrand(brand)}
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    className="shrink-0 group relative bg-white/5 hover:bg-[#800020] border border-white/10 hover:border-rose-300/80 px-6 py-4 rounded-2xl backdrop-blur-md transition-all duration-300 cursor-pointer flex items-center gap-4 shadow-lg min-w-[210px]"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white text-white group-hover:text-[#800020] flex items-center justify-center shrink-0 transition-colors shadow-xs overflow-hidden p-2">
                                        {brand.image && brand.image.trim() !== '' ? (
                                            <img 
                                                src={brand.image} 
                                                alt={brand.name} 
                                                className="w-full h-full object-contain filter group-hover:brightness-0 transition-all" 
                                            />
                                        ) : brand.icon && brand.icon.includes('<svg') ? (
                                            <span dangerouslySetInnerHTML={{ __html: brand.icon }} className="w-6 h-6 flex items-center justify-center" />
                                        ) : (
                                            <Icon icon={brand.icon || 'simple-icons:apple'} className="w-6 h-6" />
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-white text-sm font-['Raleway'] tracking-wide group-hover:text-white">
                                            {brand.name}
                                        </h4>
                                        <span className="text-[10px] text-slate-300 group-hover:text-rose-100 block font-normal">
                                            {brand.tag}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Infinite Marquee Row 2 (Moving Right / Reverse) */}
                    <div className="relative overflow-hidden py-3 marquee-container mb-6">
                        {/* Gradient Edge Fades */}
                        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-slate-900 to-transparent z-20" />
                        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-slate-900 to-transparent z-20" />

                        <div className="animate-marquee-reverse gap-5 flex items-center">
                            {marqueeRow2.map((brand, idx) => (
                                <motion.div
                                    key={`r2-${idx}`}
                                    onMouseEnter={() => setActiveBrand(brand)}
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    className="shrink-0 group relative bg-white/5 hover:bg-[#800020] border border-white/10 hover:border-rose-300/80 px-6 py-4 rounded-2xl backdrop-blur-md transition-all duration-300 cursor-pointer flex items-center gap-4 shadow-lg min-w-[210px]"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white text-white group-hover:text-[#800020] flex items-center justify-center shrink-0 transition-colors shadow-xs overflow-hidden p-2">
                                        {brand.image && brand.image.trim() !== '' ? (
                                            <img 
                                                src={brand.image} 
                                                alt={brand.name} 
                                                className="w-full h-full object-contain filter group-hover:brightness-0 transition-all" 
                                            />
                                        ) : brand.icon && brand.icon.includes('<svg') ? (
                                            <span dangerouslySetInnerHTML={{ __html: brand.icon }} className="w-6 h-6 flex items-center justify-center" />
                                        ) : (
                                            <Icon icon={brand.icon || 'simple-icons:sony'} className="w-6 h-6" />
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-white text-sm font-['Raleway'] tracking-wide group-hover:text-white">
                                            {brand.name}
                                        </h4>
                                        <span className="text-[10px] text-slate-300 group-hover:text-rose-100 block font-normal">
                                            {brand.tag}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
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
        </section>
    );
}

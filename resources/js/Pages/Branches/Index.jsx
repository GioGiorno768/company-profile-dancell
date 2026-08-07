import React, { useState, useRef, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { ReactLenis } from 'lenis/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Landing/Navbar';
import ContactFooter from '@/Components/Landing/ContactFooter';
import {
    Store,
    MapPin,
    Phone,
    MessageCircle,
    Clock,
    ExternalLink,
    Search,
    RotateCcw,
    Building2,
    Crown,
    Check,
    ChevronDown,
    X,
    Sparkles,
    Navigation,
    Info,
    ArrowRight
} from 'lucide-react';

export default function PublicBranchIndex({ branches = [], cities = [], branchSection = null, seo = null, filters = {}, footer = null }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCity, setSelectedCity] = useState(filters.city || 'all');
    const [selectedBranchModal, setSelectedBranchModal] = useState(null);

    // Auto-detect distinct cities directly from branch list so new cities appear instantly
    const availableCities = React.useMemo(() => {
        const fromBranches = branches.map(b => b.city).filter(Boolean);
        return Array.from(new Set([...(cities || []), ...fromBranches])).sort();
    }, [cities, branches]);

    // Hero Sticky Scroll Transforms
    const containerRef = useRef(null);
    const gridRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.68]);
    const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.95, 0.5]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], [0, 44]);

    // Live Filter Handler
    const handleCitySelect = (cityVal) => {
        setSelectedCity(cityVal);
        // Scroll smoothly to branch grid section
        if (gridRef.current) {
            gridRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Filter branches in memory for instant zero-lag response
    const filteredBranches = branches.filter((branch) => {
        const matchesSearch =
            searchQuery === '' ||
            branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            branch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (branch.area && branch.area.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (branch.address && branch.address.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCity = selectedCity === 'all' || branch.city.toLowerCase() === selectedCity.toLowerCase();

        return matchesSearch && matchesCity;
    });

    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
            <Head>
                {/* Core Meta */}
                <title>{`Daftar Cabang Outlet Dancell (${branches.length} Toko) — Jaringan Ritel Jawa Timur`}</title>
                <meta name="description" content="Temukan lokasi outlet cabang Dancell terdekat di Nganjuk, Kediri, Blitar, Magetan, Madiun, & Mojokerto. Jaringan toko ritel gadget & HP garansi resmi terpercaya." />
                <meta name="keywords" content="cabang Dancell, toko HP Nganjuk, toko HP Kediri, toko HP Blitar, toko HP Magetan, toko HP Madiun, outlet Dancell Jatim" />
                <meta name="robots" content="index, follow, max-image-preview:large" />
                <link rel="canonical" href="https://dancell-official.com/cabang" />

                {/* Open Graph */}
                <meta property="og:site_name" content="Dancell Indonesia" />
                <meta property="og:title" content={`Daftar ${branches.length} Outlet Cabang Dancell — Ritel Gadget Jawa Timur`} />
                <meta property="og:description" content="Temukan lokasi outlet cabang Dancell terdekat. Jaringan toko ritel gadget, HP, smartphone & aksesori garansi resmi terpercaya di Jawa Timur." />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="id_ID" />
                <meta property="og:url" content="https://dancell-official.com/cabang" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Daftar ${branches.length} Outlet Cabang Dancell — Ritel Gadget Jawa Timur`} />
                <meta name="twitter:description" content="Temukan lokasi outlet cabang Dancell terdekat. Jaringan toko ritel gadget & HP garansi resmi terpercaya di Jawa Timur." />

                {/* JSON-LD Structured Data: ItemList */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "name": "Daftar Cabang Outlet Dancell",
                        "description": "Jaringan outlet ritel gadget & smartphone Dancell di Jawa Timur",
                        "numberOfItems": branches.length,
                        "itemListElement": branches.slice(0, 20).map((branch, idx) => ({
                            "@type": "ListItem",
                            "position": idx + 1,
                            "item": {
                                "@type": "ElectronicsStore",
                                "name": branch.name,
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressLocality": branch.city,
                                    "addressRegion": "Jawa Timur",
                                    "addressCountry": "ID",
                                    ...(branch.address && { "streetAddress": branch.address }),
                                },
                                ...(branch.phone && { "telephone": branch.phone }),
                                ...(branch.google_maps_url && { "hasMap": branch.google_maps_url }),
                            }
                        }))
                    })}
                </script>
            </Head>

            <div className="min-h-screen bg-slate-50 font-['Raleway'] text-slate-900 selection:bg-[#800020] selection:text-white antialiased">
                
                {/* Fixed Top Navbar */}
                <Navbar />

                {/* STICKY ANIMATED HERO SECTION */}
                <section
                    ref={containerRef}
                    className="relative bg-gradient-to-br from-[#4a0012] via-[#800020] to-[#5c0017] text-white overflow-x-clip h-[180vh]"
                >
                    <motion.div
                        style={{
                            scale,
                            opacity,
                            borderRadius,
                        }}
                        className="sticky top-0 left-0 h-screen w-full flex flex-col justify-between pt-28 pb-12 overflow-hidden origin-center"
                    >
                        {/* Ambient Glow Effects */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: 'easeInOut',
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
                                ease: 'easeInOut',
                            }}
                            className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-3xl pointer-events-none"
                        />

                        {/* Subtle Texture Grid */}
                        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

                        {/* Hero Content Area */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-center text-center items-center">
                            
                            {/* Tagline Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-rose-100 text-xs font-medium backdrop-blur-xs mb-5 shadow-xs"
                            >
                                <Store className="w-4 h-4 text-rose-300" />
                                <span>{branchSection?.header_badge || 'Jaringan Outlet Ritel Dancell — Jawa Timur'}</span>
                            </motion.div>

                            {/* Hero Main Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight max-w-4xl font-['Raleway']"
                            >
                                {branchSection?.header_title || 'Temukan 56 Outlet Cabang Dancell Terdekat'}
                            </motion.h1>

                            {/* Hero Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xs sm:text-base text-rose-100/90 max-w-2xl mt-4 leading-relaxed font-normal"
                            >
                                {branchSection?.header_description || 'Dancell melayani pembelian gadget original, laptop, & aksesori bergaransi resmi di 56 cabang terpercaya. Cari lokasi outlet terdekat dan hubungi tim CS kami.'}
                            </motion.p>

                            {/* Interactive Quick City Pills */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-wrap items-center justify-center gap-2.5 mt-8 max-w-3xl"
                            >
                                <button
                                    onClick={() => handleCitySelect('all')}
                                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                        selectedCity === 'all'
                                            ? 'bg-white text-[#800020] shadow-md scale-105'
                                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs'
                                    }`}
                                >
                                    Semua Kota ({branches.length})
                                </button>

                                {availableCities.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => handleCitySelect(c)}
                                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                            selectedCity.toLowerCase() === c.toLowerCase()
                                                ? 'bg-white text-[#800020] shadow-md scale-105'
                                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs'
                                        }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </motion.div>

                            {/* Scroll Indicator Arrow */}
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                                className="mt-10 text-rose-200/80 text-xs flex items-center gap-1 cursor-pointer"
                                onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <span>Gulir ke bawah untuk daftar cabang</span>
                                <ChevronDown className="w-4 h-4" />
                            </motion.div>

                        </div>
                    </motion.div>
                </section>

                {/* MAIN BRANCHES SHOWCASE GRID SECTION */}
                <main ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 relative z-20">
                    
                    {/* Filter & Live Search Bar Container */}
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight font-['Raleway']">
                                    Daftar Outlet Ritel Cabang
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Menampilkan <span className="font-bold text-[#800020]">{filteredBranches.length}</span> outlet cabang aktif Dancell di Jawa Timur.
                                </p>
                            </div>

                            {/* Live Search Input */}
                            <div className="relative w-full md:w-80">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Cari nama toko, kota, area, alamat..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* City Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Filter Kota:</span>
                            <button
                                onClick={() => setSelectedCity('all')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    selectedCity === 'all'
                                        ? 'bg-[#800020] text-white shadow-2xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                            >
                                Semua Kota ({branches.length})
                            </button>

                            {availableCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => setSelectedCity(city)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                        selectedCity.toLowerCase() === city.toLowerCase()
                                            ? 'bg-[#800020] text-white shadow-2xs'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                                >
                                    {city}
                                </button>
                            ))}

                            {(searchQuery !== '' || selectedCity !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCity('all');
                                    }}
                                    className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-[#800020] text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reset Filter</span>
                                </button>
                            )}
                        </div>

                    </div>

                    {/* Branch Grid Showcase */}
                    {filteredBranches.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-4 shadow-2xs">
                            <Store className="w-12 h-12 text-slate-300 mx-auto" />
                            <h3 className="text-base font-bold text-slate-800">Tidak ada outlet cabang ditemukan</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                Coba sesuaikan kata kunci pencarian atau ubah filter kota untuk menemukan cabang Dancell.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCity('all');
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-semibold hover:bg-[#600018] transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Tampilkan Semua Cabang</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBranches.map((branch) => (
                                <div
                                    key={branch.id}
                                    className={`bg-white rounded-3xl border ${
                                        branch.is_hq
                                            ? 'border-2 border-[#800020] ring-4 ring-rose-500/10 shadow-md'
                                            : 'border-slate-200/80 hover:border-rose-300 shadow-2xs hover:shadow-md'
                                    } p-6 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
                                >
                                    <div className="space-y-4">
                                        
                                        {/* Card Top Badges */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="px-3 py-1 rounded-xl bg-rose-50 text-[#800020] text-[11px] font-semibold tracking-wider uppercase border border-rose-100">
                                                    {branch.city}
                                                </span>
                                                {branch.is_hq && (
                                                    <span className="px-3 py-1 rounded-xl bg-[#800020] text-white text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-2xs">
                                                        <Crown className="w-3.5 h-3.5 text-rose-200" />
                                                        <span>Pusat (HQ)</span>
                                                    </span>
                                                )}
                                            </div>

                                            <span className="text-[11px] text-slate-400 font-medium">
                                                {branch.year ? `Est. ${branch.year}` : ''}
                                            </span>
                                        </div>

                                        {/* Branch Name & Area */}
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#800020] transition-colors leading-snug">
                                                {branch.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                                Area: {branch.area || branch.city}
                                            </p>
                                        </div>

                                        {/* Full Address */}
                                        <div className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed pt-1">
                                            <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                            <p>{branch.address}</p>
                                        </div>

                                        {/* Operating Hours & Contact */}
                                        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                                            <div className="flex items-center justify-between text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{branch.opening_hours || 'Buka Setiap Hari'}</span>
                                                </div>
                                                {branch.whatsapp && (
                                                    <a
                                                        href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:underline text-[11px]"
                                                    >
                                                        <MessageCircle className="w-3.5 h-3.5" />
                                                        <span>WA CS</span>
                                                    </a>
                                                )}
                                            </div>

                                            {branch.phone && (
                                                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{branch.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    {/* Card Footer Action Buttons */}
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                                        
                                        {branch.google_maps_url ? (
                                            <a
                                                href={branch.google_maps_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                                            >
                                                <Navigation className="w-3.5 h-3.5 text-[#800020]" />
                                                <span>Google Maps</span>
                                            </a>
                                        ) : (
                                            <span className="text-[11px] text-slate-400 italic">No Map</span>
                                        )}

                                        <button
                                            onClick={() => setSelectedBranchModal(branch)}
                                            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                                        >
                                            <span>Detail Toko</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </button>

                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                </main>

                {/* MODAL DETAIL OUTLET CABANG */}
                <AnimatePresence>
                    {selectedBranchModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
                            onClick={() => setSelectedBranchModal(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-lg w-full p-7 space-y-6 relative overflow-hidden font-['Raleway']"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedBranchModal(null)}
                                    className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Modal Header */}
                                <div className="space-y-2 pr-8">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-xl bg-rose-50 text-[#800020] text-xs font-bold uppercase border border-rose-100">
                                            {selectedBranchModal.city}
                                        </span>
                                        {selectedBranchModal.is_hq && (
                                            <span className="px-3 py-1 rounded-xl bg-[#800020] text-white text-xs font-bold uppercase flex items-center gap-1">
                                                <Crown className="w-3.5 h-3.5 text-rose-200" />
                                                <span>Kantor Pusat (HQ)</span>
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 leading-snug">
                                        {selectedBranchModal.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Area: {selectedBranchModal.area || selectedBranchModal.city} {selectedBranchModal.year ? `• Berdiri Tahun ${selectedBranchModal.year}` : ''}
                                    </p>
                                </div>

                                {/* Modal Details List */}
                                <div className="space-y-4 pt-2 border-t border-slate-100 text-xs text-slate-700">
                                    
                                    {/* Address */}
                                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                                        <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block font-bold text-slate-900 text-xs mb-0.5">Alamat Lengkap Outlet</span>
                                            <p className="text-slate-600 leading-relaxed">{selectedBranchModal.address}</p>
                                        </div>
                                    </div>

                                    {/* Hours */}
                                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                                        <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                                        <div>
                                            <span className="block font-bold text-slate-900 text-xs mb-0.5">Jam Operasional</span>
                                            <p className="text-slate-600">{selectedBranchModal.opening_hours || 'Buka Setiap Hari (08.00 - 21.00 WIB)'}</p>
                                        </div>
                                    </div>

                                    {/* Contact */}
                                    {(selectedBranchModal.whatsapp || selectedBranchModal.phone) && (
                                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                                            <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                                            <div className="space-y-1">
                                                <span className="block font-bold text-slate-900 text-xs">Kontak Layanan Toko</span>
                                                {selectedBranchModal.whatsapp && (
                                                    <a
                                                        href={`https://wa.me/${selectedBranchModal.whatsapp.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold hover:underline"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        <span>WhatsApp CS: {selectedBranchModal.whatsapp}</span>
                                                    </a>
                                                )}
                                                {selectedBranchModal.phone && (
                                                    <div className="text-slate-600">Telepon: {selectedBranchModal.phone}</div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* Modal Actions */}
                                <div className="pt-2 flex items-center justify-end gap-3">
                                    {selectedBranchModal.google_maps_url && (
                                        <a
                                            href={selectedBranchModal.google_maps_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-3 px-5 rounded-2xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                                        >
                                            <Navigation className="w-4 h-4" />
                                            <span>Buka di Google Maps</span>
                                        </a>
                                    )}
                                </div>

                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Section */}
                <ContactFooter footer={footer} />

            </div>
        </ReactLenis>
    );
}

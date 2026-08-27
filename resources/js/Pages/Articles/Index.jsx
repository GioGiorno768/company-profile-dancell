import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ReactLenis } from 'lenis/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Landing/Navbar';
import ContactFooter from '@/Components/Landing/ContactFooter';
import { 
    Search, 
    BookOpen, 
    Clock, 
    Eye, 
    ArrowRight, 
    ArrowLeft,
    Sparkles, 
    ChevronRight,
    ChevronDown,
    Flame,
    Tag,
    Star,
    Newspaper
} from 'lucide-react';

export default function ArticlesIndex({ seo, footer, settings, articles = [], categories = [], selectedCategory = 'semua', searchQuery = '', selectedPage = 1 }) {
    const [search, setSearch] = useState(searchQuery || '');
    const [activeCategory, setActiveCategory] = useState(selectedCategory || 'semua');
    const [currentPage, setCurrentPage] = useState(Number(selectedPage) || 1);
    const ITEMS_PER_PAGE = 6;

    // Helper function to build pretty / query URL
    const getPageUrl = (pg, cat = activeCategory, q = search) => {
        const params = new URLSearchParams();
        if (cat && cat !== 'semua') params.set('kategori', cat);
        if (q && q.trim()) params.set('q', q.trim());
        
        let path = pg > 1 ? '/artikel/page/' + pg : '/artikel';
        const queryString = params.toString();
        return queryString ? path + '?' + queryString : path;
    };

    // Smooth scroll to top of articles grid
    const scrollToArticlesTop = () => {
        const gridEl = document.getElementById('articles-main-grid');
        if (gridEl) {
            const offset = 120; // clearance for navbar
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = gridEl.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Instant pure SPA URL update without server loading lag
    const updateUrlAndState = (cat, q, pg) => {
        const url = getPageUrl(pg, cat, q);
        window.history.pushState({ page: pg, category: cat, search: q }, '', url);
    };

    // Handle Category change
    const handleCategoryClick = (catSlug) => {
        setActiveCategory(catSlug);
        setCurrentPage(1);
        updateUrlAndState(catSlug, search, 1);
        scrollToArticlesTop();
    };

    // Handle Search input
    const handleSearchInput = (val) => {
        setSearch(val);
        setCurrentPage(1);
        updateUrlAndState(activeCategory, val, 1);
    };

    // Handle Search reset
    const handleResetSearch = () => {
        setSearch('');
        setCurrentPage(1);
        updateUrlAndState(activeCategory, '', 1);
        scrollToArticlesTop();
    };

    // Handle Page change
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        updateUrlAndState(activeCategory, search, newPage);
        scrollToArticlesTop();
    };

    // Listen to browser Back / Forward history buttons
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            const match = path.match(/\/artikel\/page\/(\d+)/);
            if (match) {
                setCurrentPage(parseInt(match[1], 10));
            } else {
                setCurrentPage(1);
            }

            const urlParams = new URLSearchParams(window.location.search);
            const cat = urlParams.get('kategori') || 'semua';
            const q = urlParams.get('q') || '';
            setActiveCategory(cat);
            setSearch(q);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Sticky Scroll Animation Transforms
    const containerRef = useRef(null);
    const contentSheetRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.68]);
    const opacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.95, 0.5]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], [0, 44]);

    // Top Highlighted Featured Articles for Slide Carousel (take up to 4 articles)
    const featuredSlides = articles.length > 0 ? articles.slice(0, 4) : [];
    
    // Slider State & Drag/Touch Gesture
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartX = useRef(0);
    const dragThreshold = 45;

    const SLIDE_DURATION = 6500;

    const handleNext = () => {
        if (featuredSlides.length <= 1) return;
        setDirection(1);
        setCurrentSlideIndex((prev) => (prev + 1) % featuredSlides.length);
    };

    const handlePrev = () => {
        if (featuredSlides.length <= 1) return;
        setDirection(-1);
        setCurrentSlideIndex((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length);
    };

    const handleJumpTo = (idx) => {
        if (idx === currentSlideIndex) return;
        setDirection(idx > currentSlideIndex ? 1 : -1);
        setCurrentSlideIndex(idx);
    };

    // Auto Play Slider (pauses on hover or during drag)
    useEffect(() => {
        if (isPaused || isDragging || featuredSlides.length <= 1) return;
        const timer = setInterval(handleNext, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, [currentSlideIndex, isPaused, isDragging, featuredSlides.length]);

    // Mouse Drag Gesture Handlers
    const handleMouseDown = (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        setIsDragging(true);
        dragStartX.current = e.clientX;
    };

    const handleMouseUp = (e) => {
        if (!isDragging) return;
        setIsDragging(false);
        const diff = dragStartX.current - e.clientX;
        if (diff > dragThreshold) {
            handleNext();
        } else if (diff < -dragThreshold) {
            handlePrev();
        }
    };

    const handleMouseLeave = () => {
        setIsPaused(false);
        setIsDragging(false);
    };

    // Touch Swipe Gesture Handlers for Mobile
    const handleTouchStart = (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        dragStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const diff = dragStartX.current - e.changedTouches[0].clientX;
        if (diff > dragThreshold) {
            handleNext();
        } else if (diff < -dragThreshold) {
            handlePrev();
        }
    };

    // Active Slide Data
    const activeSlide = featuredSlides[currentSlideIndex] || articles[0];

    // Filter articles based on category and search query
    const filteredArticles = articles.filter((article) => {
        const matchesCategory = activeCategory === 'semua' || article.category_slug === activeCategory;
        const matchesSearch = search.trim() === '' || 
            article.title.toLowerCase().includes(search.toLowerCase()) || 
            article.excerpt.toLowerCase().includes(search.toLowerCase()) ||
            article.category.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE) || 1;
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // 1. Popular Articles (Sorted by views, Max 7 items)
    const popularArticles = [...articles]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 7);

    // 2. Latest Articles (Sorted by recency, Max 7 items)
    const latestArticles = [...articles]
        .slice(0, 7);

    // Slide animation variants
    const slideVariants = {
        enter: (dir) => ({
            x: dir > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
            },
        },
        exit: (dir) => ({
            x: dir > 0 ? '-100%' : '100%',
            opacity: 0,
            transition: {
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
            },
        }),
    };

    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
            <div className="min-h-screen bg-slate-50 font-['Raleway'] text-slate-900 selection:bg-[#800020] selection:text-white flex flex-col justify-between antialiased">
                <Head>
                    <title>Artikel, Edukasi & Berita Gadget Terlengkap | Dancell Indonesia</title>
                    <meta name="description" content="Pusat edukasi gadget terpercaya di Jawa Timur. Simak tips memilih smartphone garansi resmi, rekomendasi laptop kuliah, dan promo Dancell terbaru." />
                </Head>

                {/* Navbar */}
                <Navbar />

                {/* 1. STICKY INTERACTIVE HERO CAROUSEL (Grab & Slide Support) */}
                {activeSlide && (
                    <section
                        ref={containerRef}
                        className="relative bg-slate-950 text-white overflow-x-clip h-[200vh]"
                    >
                        <motion.div
                            style={{
                                scale,
                                opacity,
                                borderRadius,
                            }}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={handleMouseLeave}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            className={`sticky top-0 left-0 h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12 overflow-hidden origin-center transform-gpu select-none ${
                                isDragging ? 'cursor-grabbing' : 'cursor-grab'
                            }`}
                        >
                            {/* Slide Dynamic Background Image with Smooth Fade */}
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={'bg-' + activeSlide.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0 pointer-events-none overflow-hidden"
                                >
                                    <img
                                        src={activeSlide.image || '/images/hero.webp'}
                                        alt={activeSlide.title}
                                        className="w-full h-full object-cover object-center lg:object-right filter brightness-90 contrast-105"
                                    />
                                    {/* Mobile Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/92 via-slate-950/85 to-slate-950/75 lg:hidden" />
                                    {/* Desktop 115deg Angled Gradient */}
                                    <div 
                                        className="absolute inset-0 hidden lg:block"
                                        style={{
                                            background: 'linear-gradient(115deg, #020617 0%, #020617 38%, rgba(2,6,23,0.95) 48%, rgba(2,6,23,0.7) 64%, rgba(2,6,23,0.2) 82%, transparent 100%)'
                                        }}
                                    />
                                    {/* Vignettes */}
                                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent hidden lg:block" />
                                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent hidden lg:block" />
                                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950/80 to-transparent hidden lg:block" />
                                </motion.div>
                            </AnimatePresence>

                            {/* Ambient Glows */}
                            <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#800020]/25 rounded-full blur-[140px] pointer-events-none" />
                            <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-rose-600/15 rounded-full blur-[160px] pointer-events-none" />

                            {/* Hero Content Area with Sliding Animation */}
                            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 relative z-20 w-full flex-1 flex flex-col justify-center">
                                
                                <AnimatePresence mode="wait" custom={direction}>
                                    <motion.div
                                        key={'slide-' + activeSlide.id}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="max-w-3xl xl:max-w-4xl space-y-4 sm:space-y-6"
                                    >
                                        {/* Badges */}
                                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#800020]/90 text-white text-xs font-normal shadow-sm backdrop-blur-xs">
                                                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                                                <span>Sorotan {currentSlideIndex + 1}/{featuredSlides.length}</span>
                                            </span>
                                            <span className="px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-rose-200 text-xs font-normal tracking-wide backdrop-blur-xs">
                                                {activeSlide.category}
                                            </span>
                                            <span className="text-xs text-slate-300 font-light flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{activeSlide.reading_time}</span>
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal text-white tracking-tight leading-snug">
                                            <Link href={'/artikel/' + activeSlide.slug} className="hover:text-rose-200 transition-colors">
                                                {activeSlide.title}
                                            </Link>
                                        </h1>

                                        {/* Excerpt */}
                                        <p className="text-slate-300/90 text-sm sm:text-base lg:text-lg font-light leading-relaxed max-w-2xl">
                                            {activeSlide.excerpt}
                                        </p>

                                        {/* Author & CTA Button */}
                                        <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-normal text-rose-300 shadow-xs">
                                                    D
                                                </div>
                                                <div>
                                                    <span className="text-xs font-normal text-white block">
                                                        {activeSlide.author.name}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-light block">
                                                        {activeSlide.published_at}
                                                    </span>
                                                </div>
                                            </div>

                                            <Link
                                                href={'/artikel/' + activeSlide.slug}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-rose-100 text-slate-950 font-normal text-xs sm:text-sm transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 self-start sm:self-auto"
                                            >
                                                <span>Baca Artikel</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>

                                    </motion.div>
                                </AnimatePresence>

                            </div>

                            {/* Bottom Navigation Controls & Scroll Indicator */}
                            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 relative z-20 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                
                                {/* Slide Indicator Dots Only (Ultra-Clean) */}
                                <div className="flex items-center gap-2">
                                    {featuredSlides.map((slide, idx) => (
                                        <button
                                            key={'dot-' + slide.id}
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleJumpTo(idx); }}
                                            className={`transition-all duration-300 rounded-full cursor-pointer ${
                                                idx === currentSlideIndex
                                                    ? 'w-8 h-2 bg-[#800020] border border-rose-400/50'
                                                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                                            }`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>

                                {/* Scroll Down Indicator */}
                                <div 
                                    onClick={() => contentSheetRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex items-center gap-2 text-rose-200/80 hover:text-white text-xs font-light cursor-pointer transition-colors"
                                >
                                    <span>Gulir ke bawah untuk semua artikel</span>
                                    <ChevronDown className="w-4 h-4 animate-bounce" />
                                </div>

                            </div>

                        </motion.div>
                    </section>
                )}

                {/* 2. OVERLAPPING WHITE CONTENT SHEET (Smooth Slide-Up Curtain Effect) */}
                <div ref={contentSheetRef} className="-mt-[80vh] relative z-20">
                    <div className="w-full h-8 sm:h-12 bg-slate-50 rounded-t-[3rem] -mt-10 relative z-20 shadow-xs pointer-events-none" />

                    {/* Main Content Area */}
                    <main className="bg-slate-50 pt-4 pb-24 relative z-20">
                        
                        {/* Header, Search & Category Filter */}
                        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 mb-10 sm:mb-12">
                            
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/80">
                                <div className="max-w-xl space-y-2">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-100 text-xs font-normal">
                                        <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
                                        <span>{settings?.badge_text || 'Pusat Informasi & Edukasi Teknologi'}</span>
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal text-slate-900 tracking-tight">
                                        {settings?.header_title || 'Jelajahi Artikel & Wawasan Gadget'}
                                    </h2>
                                    <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
                                        {settings?.header_subtitle || 'Tips memilih smartphone, panduan garansi resmi, dan berita seputar jaringan toko Dancell.'}
                                    </p>
                                </div>

                                {/* Search Bar */}
                                <div className="w-full md:w-80 lg:w-96 shrink-0">
                                    <div className="relative">
                                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => handleSearchInput(e.target.value)}
                                            placeholder="Cari topik artikel..."
                                            className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs sm:text-sm font-light focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all"
                                        />
                                        {search && (
                                            <button 
                                                onClick={handleResetSearch}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-normal text-slate-400 hover:text-slate-600"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Category Filter Pills */}
                            <div className="mt-6 flex items-center justify-start gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.slug}
                                        onClick={() => handleCategoryClick(cat.slug)}
                                        className={`px-4 py-2 rounded-xl text-xs font-normal transition-all min-w-max cursor-pointer ${
                                            activeCategory === cat.slug
                                                ? 'bg-[#800020] text-white shadow-xs'
                                                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-100/60'
                                        }`}
                                    >
                                        <span>{cat.name}</span>
                                        <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                                            activeCategory === cat.slug ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {cat.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                        </div>

                        {/* Two-Column Main Grid + Ultra-Clean Editorial Sidebar */}
                        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                                
                                {/* Left Column (8 Cols) - Article Grid */}
                                <div id="articles-main-grid" className="lg:col-span-8 space-y-8 scroll-mt-28">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base sm:text-lg font-normal text-slate-900 flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-[#800020]" />
                                            <span>
                                                {activeCategory === 'semua' ? 'Semua Artikel' : categories.find(c => c.slug === activeCategory)?.name || 'Daftar Artikel'} 
                                                {' '}({filteredArticles.length})
                                            </span>
                                        </h3>
                                    </div>

                                    {filteredArticles.length === 0 ? (
                                        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
                                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                                            <h4 className="text-base font-normal text-slate-800">Tidak ada artikel yang sesuai</h4>
                                            <p className="text-xs text-slate-500 max-w-sm mx-auto font-light">
                                                Coba gunakan kata kunci pencarian lain atau klik tombol reset filter di bawah.
                                            </p>
                                            <button
                                                onClick={() => { handleResetSearch(); setActiveCategory('semua'); updateUrlAndState('semua', '', 1); }}
                                                className="px-4 py-2 rounded-xl bg-[#800020] text-white text-xs font-normal cursor-pointer"
                                            >
                                                Reset Filter
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
                                                {paginatedArticles.map((article) => (
                                                    <article
                                                        key={article.id}
                                                        className="group flex flex-col bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-rose-200/80 transition-all duration-300"
                                                    >
                                                        <Link href={'/artikel/' + article.slug} className="relative aspect-[16/10] overflow-hidden bg-slate-900 block">
                                                            <img
                                                                src={article.image || '/images/hero.webp'}
                                                                alt={article.title}
                                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                            <div className="absolute top-4 left-4 z-10">
                                                                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-normal tracking-wide shadow-sm">
                                                                    {article.category}
                                                                </span>
                                                            </div>
                                                        </Link>

                                                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2.5 text-xs text-slate-400 font-light">
                                                                    <span>{article.published_at}</span>
                                                                    <span>•</span>
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                                        <span>{article.reading_time}</span>
                                                                    </span>
                                                                </div>

                                                                <h4 className="text-base sm:text-lg font-normal text-slate-900 group-hover:text-[#800020] transition-colors leading-snug line-clamp-2">
                                                                    <Link href={'/artikel/' + article.slug}>
                                                                        {article.title}
                                                                    </Link>
                                                                </h4>

                                                                <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed line-clamp-2">
                                                                    {article.excerpt}
                                                                </p>
                                                            </div>

                                                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full bg-rose-50 text-[#800020] text-[10px] font-normal flex items-center justify-center border border-rose-200">
                                                                        D
                                                                    </div>
                                                                    <span className="text-xs text-slate-600 font-light truncate max-w-[120px]">
                                                                        {article.author.name}
                                                                    </span>
                                                                </div>

                                                                <Link
                                                                    href={'/artikel/' + article.slug}
                                                                    className="inline-flex items-center gap-1 text-xs font-normal text-[#800020] group-hover:text-[#5c0017] transition-colors cursor-pointer"
                                                                >
                                                                    <span>Baca</span>
                                                                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>

                                            {/* Elegant Instant SPA Pagination Controls */}
                                            {totalPages > 1 && (
                                                <div className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    
                                                    {/* Range Info */}
                                                    <span className="text-xs text-slate-500 font-light">
                                                        Menampilkan <span className="font-normal text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-normal text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredArticles.length)}</span> dari <span className="font-normal text-slate-900">{filteredArticles.length}</span> artikel
                                                    </span>

                                                    {/* Page Buttons */}
                                                    <div className="flex items-center gap-1.5">
                                                        
                                                        {/* Prev Link */}
                                                        <a
                                                            href={getPageUrl(Math.max(1, currentPage - 1))}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (currentPage > 1) handlePageChange(currentPage - 1);
                                                            }}
                                                            className={`px-3 py-1.5 rounded-xl text-xs font-normal transition-all flex items-center gap-1 ${
                                                                currentPage === 1
                                                                    ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                                                                    : 'hover:bg-rose-50 text-slate-700 hover:text-[#800020] bg-white border border-slate-200 cursor-pointer shadow-xs'
                                                            }`}
                                                        >
                                                            <ArrowLeft className="w-3 h-3" />
                                                            <span className="hidden sm:inline">Sebelumnya</span>
                                                        </a>

                                                        {/* Numbered Pills */}
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                                            <a
                                                                key={'page-' + pageNum}
                                                                href={getPageUrl(pageNum)}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handlePageChange(pageNum);
                                                                }}
                                                                className={`w-8 h-8 rounded-xl text-xs font-normal flex items-center justify-center transition-all cursor-pointer ${
                                                                    currentPage === pageNum
                                                                        ? 'bg-[#800020] text-white shadow-xs'
                                                                        : 'bg-white text-slate-700 hover:text-[#800020] hover:bg-rose-50 border border-slate-200'
                                                                }`}
                                                            >
                                                                {pageNum}
                                                            </a>
                                                        ))}

                                                        {/* Next Link */}
                                                        <a
                                                            href={getPageUrl(Math.min(totalPages, currentPage + 1))}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                                            }}
                                                            className={`px-3 py-1.5 rounded-xl text-xs font-normal transition-all flex items-center gap-1 ${
                                                                currentPage === totalPages
                                                                    ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                                                                    : 'hover:bg-rose-50 text-slate-700 hover:text-[#800020] bg-white border border-slate-200 cursor-pointer shadow-xs'
                                                            }`}
                                                        >
                                                            <span className="hidden sm:inline">Selanjutnya</span>
                                                            <ArrowRight className="w-3 h-3" />
                                                        </a>

                                                    </div>

                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Right Column (4 Cols) - Ultra-Clean Editorial Sidebar */}
                                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                                    
                                    {/* 1. CARD ARTIKEL TERPOPULER (Clean Editorial Row List) */}
                                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                            <h4 className="text-sm font-normal text-slate-900 flex items-center gap-2">
                                                <Flame className="w-4 h-4 text-[#800020]" />
                                                <span>Artikel Terpopuler</span>
                                            </h4>
                                            <span className="text-[11px] font-normal text-rose-700 bg-rose-50/80 px-2.5 py-0.5 rounded-full border border-rose-100/80">
                                                Top {popularArticles.length}
                                            </span>
                                        </div>

                                        {/* Scrollable Clean List */}
                                        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} className="max-h-[380px] sm:max-h-[400px] overflow-y-auto pr-2 sidebar-scroll overscroll-contain">
                                            <div className="divide-y divide-slate-100/90">
                                                {popularArticles.map((pop, idx) => (
                                                    <Link
                                                        key={'pop-' + pop.id}
                                                        href={'/artikel/' + pop.slug}
                                                        className="group flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0 transition-all duration-200"
                                                    >
                                                        {/* Numbered Index */}
                                                        <span className="text-sm font-mono font-light text-slate-300 group-hover:text-[#800020] shrink-0 mt-0.5 transition-colors w-5">
                                                            0{idx + 1}
                                                        </span>

                                                        <div className="space-y-1 min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-normal text-[#800020]">
                                                                    {pop.category}
                                                                </span>
                                                                <span className="text-[10px] text-slate-300">•</span>
                                                                <span className="text-[10px] text-slate-400 flex items-center gap-0.5 font-light">
                                                                    <Eye className="w-3 h-3 text-slate-400" />
                                                                    <span>{pop.views.toLocaleString()}</span>
                                                                </span>
                                                            </div>
                                                            <h5 className="text-xs sm:text-sm font-normal text-slate-800 group-hover:text-[#800020] transition-colors leading-snug line-clamp-2">
                                                                {pop.title}
                                                            </h5>
                                                            <span className="text-[10px] text-slate-400 font-light block">
                                                                {pop.published_at}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. CARD ARTIKEL TERBARU (Clean Minimalist Micro Thumbnail) */}
                                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                                            <h4 className="text-sm font-normal text-slate-900 flex items-center gap-2">
                                                <Newspaper className="w-4 h-4 text-[#800020]" />
                                                <span>Artikel Terbaru</span>
                                            </h4>
                                            <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-100/80">
                                                Update Terkini
                                            </span>
                                        </div>

                                        {/* Scrollable Clean List */}
                                        <div data-lenis-prevent onWheel={(e) => e.stopPropagation()} className="max-h-[380px] sm:max-h-[400px] overflow-y-auto pr-2 sidebar-scroll overscroll-contain">
                                            <div className="divide-y divide-slate-100/90">
                                                {latestArticles.map((latest) => (
                                                    <Link
                                                        key={'latest-' + latest.id}
                                                        href={'/artikel/' + latest.slug}
                                                        className="group flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0 transition-all duration-200"
                                                    >
                                                        {/* Thumbnail */}
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 mt-0.5 border border-slate-100">
                                                            <img
                                                                src={latest.image || '/images/hero.webp'}
                                                                alt={latest.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>

                                                        <div className="space-y-1 min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-normal text-[#800020]">
                                                                    {latest.category}
                                                                </span>
                                                                <span className="text-[10px] text-slate-300">•</span>
                                                                <span className="text-[10px] text-slate-400 font-light">
                                                                    {latest.published_at}
                                                                </span>
                                                            </div>
                                                            <h5 className="text-xs sm:text-sm font-normal text-slate-800 group-hover:text-[#800020] transition-colors leading-snug line-clamp-2">
                                                                {latest.title}
                                                            </h5>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. CARD TOPIK POPULER */}
                                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                                        <h4 className="text-sm font-normal text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3.5">
                                            <Tag className="w-4 h-4 text-[#800020]" />
                                            <span>Topik Populer</span>
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(settings?.global_tags || ['Garansi Resmi', 'iPhone vs Android', 'Laptop Kuliah', 'Battery Health', 'Tukar Tambah', 'Promo Jatim', 'Kamera Flagship', 'Service Center']).map((tag, idx) => (
                                                <button
                                                    key={'tag-' + idx}
                                                    onClick={() => handleSearchInput(tag)}
                                                    className="px-3 py-1.5 rounded-full bg-slate-100/70 hover:bg-rose-50 text-slate-600 hover:text-[#800020] text-xs font-light transition-colors border border-slate-200/60 cursor-pointer"
                                                >
                                                    #{tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </main>
                </div>

                {/* Footer */}
                <ContactFooter footer={footer} />
            </div>
        </ReactLenis>
    );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { 
    Menu, 
    X, 
    ChevronRight, 
    MapPin, 
    ArrowUpRight
} from 'lucide-react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock background scroll when mobile menu is active
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const navLinks = [
        { name: 'Visi & Misi', href: '/#visimisi' },
        { name: 'Sejarah Dancell', href: '/#history' },
        { name: 'Cabang Ritel', href: '#branches' },
    ];

    return (
        <>
            <header 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled 
                        ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100 py-3.5' 
                        : 'bg-transparent py-5 border-b border-white/10'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        
                        {/* Brand Typography Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="flex flex-col leading-tight">
                                <div className="flex items-center gap-1.5">
                                    <span className={`font-semibold text-xl tracking-tight font-['Raleway'] transition-colors duration-300 ${
                                        scrolled ? 'text-slate-900' : 'text-white'
                                    }`}>
                                        DANCELL
                                    </span>
                                    <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded-md tracking-wider uppercase transition-colors duration-300 ${
                                        scrolled ? 'bg-[#800020] text-white' : 'bg-white/20 text-white backdrop-blur-xs'
                                    }`}>
                                        Official
                                    </span>
                                </div>
                                <span className={`text-[10px] font-normal tracking-wider transition-colors duration-300 ${
                                    scrolled ? 'text-slate-500' : 'text-rose-100/80'
                                }`}>
                                    Retail Gadget Jawa Timur
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav Links (Tentang Kami | Visi & Misi | Sejarah Dancell | Cabang Ritel) */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => {
                                const isExternalOrAnchor = link.href.includes('#');
                                if (isExternalOrAnchor) {
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={`text-sm font-medium transition-colors relative py-1 group ${
                                                scrolled 
                                                    ? 'text-slate-600 hover:text-[#800020]' 
                                                    : 'text-white/90 hover:text-white'
                                            }`}
                                        >
                                            {link.name}
                                            <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 rounded-full ${
                                                scrolled ? 'bg-[#800020] group-hover:w-full' : 'bg-white group-hover:w-full'
                                            }`} />
                                        </Link>
                                    );
                                }
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`text-sm font-medium transition-colors relative py-1 group ${
                                            scrolled 
                                                ? 'text-slate-600 hover:text-[#800020]' 
                                                : 'text-white/90 hover:text-white'
                                        }`}
                                    >
                                        {link.name}
                                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 rounded-full ${
                                            scrolled ? 'bg-[#800020] group-hover:w-full' : 'bg-white group-hover:w-full'
                                        }`} />
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Far Right CTA Button (Cabang Ritel without '56') */}
                        <div className="hidden lg:flex items-center">
                            <Link
                                href={route('branches.public')}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-xs shadow-xs transition-all duration-200 ${
                                    scrolled
                                        ? 'bg-[#800020] text-white hover:bg-[#5c0017]'
                                        : 'bg-white text-[#800020] hover:bg-rose-50 hover:shadow-md'
                                }`}
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Cabang Ritel</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Mobile Hamburger Button */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className={`p-2 rounded-xl transition-all ${
                                    scrolled 
                                        ? 'text-slate-800 hover:text-[#800020] bg-slate-100' 
                                        : 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-md'
                                }`}
                                aria-label="Open Navigation Menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Ultra-Clean Elegant Mobile Menu Sheet */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-start">
                        
                        {/* Backdrop Blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-40"
                        />

                        {/* Minimalist Solid Glass Menu Drawer */}
                        <motion.div
                            initial={{ opacity: 0, y: '-100%' }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: '-100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                            className="relative z-50 w-full bg-[#800020] text-white shadow-2xl overflow-hidden flex flex-col rounded-b-[2rem] border-b border-rose-900/60"
                        >
                            {/* Minimal Mobile Header */}
                            <div className="px-6 py-5 flex items-center justify-between border-b border-white/10">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-xl tracking-tight font-['Raleway'] text-white">
                                        DANCELL
                                    </span>
                                    <span className="px-1.5 py-0.5 text-[8px] font-semibold rounded-md bg-white/20 text-white uppercase tracking-wider">
                                        Official
                                    </span>
                                </div>

                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15"
                                    aria-label="Close Navigation Menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Minimalist Clean Link List */}
                            <div className="px-6 py-6 space-y-1">
                                {navLinks.map((link, idx) => {
                                    const isExternalOrAnchor = link.href.includes('#');
                                    if (isExternalOrAnchor) {
                                        return (
                                            <a
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="group flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-white/10 transition-all duration-200"
                                            >
                                                <span className="text-lg font-medium tracking-tight text-white/90 group-hover:text-white group-hover:translate-x-1.5 transition-transform duration-200">
                                                    {link.name}
                                                </span>
                                                <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                            </a>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="group flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-white/10 transition-all duration-200"
                                        >
                                            <span className="text-lg font-medium tracking-tight text-white/90 group-hover:text-white group-hover:translate-x-1.5 transition-transform duration-200">
                                                {link.name}
                                            </span>
                                            <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Clean Bottom Action Button */}
                            <div className="p-6 bg-black/20 border-t border-white/10">
                                <Link
                                    href={route('branches.public')}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-white text-[#800020] font-semibold text-sm shadow-md hover:bg-rose-50 transition-all active:scale-[0.98]"
                                >
                                    <MapPin className="w-4 h-4 text-[#800020]" />
                                    <span>Cabang Ritel</span>
                                    <ChevronRight className="w-4 h-4 ml-auto text-[#800020]" />
                                </Link>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

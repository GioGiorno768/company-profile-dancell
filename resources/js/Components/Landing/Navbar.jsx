import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Store, Menu, X, ChevronRight, MapPin, LogIn } from 'lucide-react';

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

    const navLinks = [
        { name: 'Tentang Kami', href: '/#about' },
        { name: 'Visi & Misi', href: '/#visimisi' },
        { name: 'Sejarah Dancell', href: '/#history' },
        { name: 'Cabang Ritel', href: route('branches.public') },
    ];

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-rose-100/80 py-3' 
                    : 'bg-transparent py-5 border-b border-white/10'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <a href="#" className="flex items-center gap-3 group">
                        
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className={`font-semibold text-xl tracking-tight font-['Raleway'] transition-colors duration-300 ${
                                    scrolled ? 'text-slate-900' : 'text-white'
                                }`}>
                                    DANCELL
                                </span>
                                <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded-md tracking-wider uppercase transition-colors duration-300 ${
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
                    </a>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
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
                            </a>
                        ))}
                    </nav>

                    {/* Right CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <a
                            href="#branches"
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-xs shadow-sm transition-all duration-200 ${
                                scrolled
                                    ? 'bg-[#800020] text-white hover:bg-[#5c0017]'
                                    : 'bg-white text-[#800020] hover:bg-rose-50 hover:shadow-md'
                            }`}
                        >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Cabang Ritel</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`p-2 rounded-lg transition-colors ${
                                scrolled 
                                    ? 'text-slate-700 hover:text-[#800020] hover:bg-rose-50' 
                                    : 'text-white hover:bg-white/10'
                            }`}
                            aria-label="Toggle Menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10 text-white overflow-hidden"
                    >
                        <div className="px-4 pt-3 pb-6 space-y-3">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-2">
                                <a
                                    href="#branches"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#800020] font-medium text-xs shadow-xs"
                                >
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>Lihat Selengkapnya</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

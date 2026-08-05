import React from 'react';
import { Link } from '@inertiajs/react';
import { Store, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50/80 text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-['Raleway']">
            
            {/* Soft Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-100/60 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50/80 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle Texture Grid */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            {/* Back to Home Button */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs text-slate-600 hover:text-[#800020] text-xs font-medium transition-all duration-200"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Halaman Utama</span>
                </Link>
            </div>

            <div className="w-full max-w-md relative z-10 space-y-6 my-auto pt-10 sm:pt-0">
                
                {/* Brand Logo Header - Clean Vector Typography without box */}
                <div className="text-center space-y-3">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="text-left leading-3">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-2xl tracking-tight text-slate-900 font-['Raleway']">
                                    DANCELL
                                </span>
                                <span className="px-2 py-0.5 text-[9px] font-medium rounded-full uppercase tracking-wider bg-rose-50 text-[#800020] border border-rose-200">
                                    Admin
                                </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-normal">
                                Management Portal System
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Main Clean White Card Wrapper */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-9 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                    {children}
                </div>

                {/* Footer Security Note */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-normal">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Dancell Secure Admin Authentication</span>
                </div>

            </div>
        </div>
    );
}

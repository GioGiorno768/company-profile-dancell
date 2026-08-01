import React from 'react';
import { Store, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function ContactFooter() {
    return (
        <footer id="contact" className="bg-slate-900 text-white pt-16 pb-10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
                    
                    {/* Brand Info */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5c0017] to-[#800020] flex items-center justify-center text-white font-normal">
                                <Store className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-xl tracking-tight text-white font-['Raleway']">
                                        DANCELL
                                    </span>
                                    <span className="px-1.5 py-0.5 text-[9px] font-medium bg-[#800020] text-white rounded-md tracking-wider uppercase">
                                        Group
                                    </span>
                                </div>
                                <span className="text-[10px] font-normal text-rose-300">
                                    Dan Group Official Company Profile 2025/2026
                                </span>
                            </div>
                        </div>

                        <p className="text-slate-400 text-xs leading-relaxed max-w-md font-normal">
                            Dancell adalah perusahaan ritel terpercaya yang pertama kali berdiri pada tahun 2008 di Warujayeng, Nganjuk. Hingga kini memiliki 56 cabang aktif di seluruh wilayah Jawa Timur.
                        </p>

                        <div className="flex items-center gap-2.5 text-xs font-normal text-emerald-400 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 w-fit">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>56 Cabang Siap Melayani Pelanggan</span>
                        </div>
                    </div>

                    {/* Kantor Pusat */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-white text-sm font-['Raleway']">Kantor Pusat</h4>
                        <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                <span>Warujayeng, Kec. Tanjunganom, Kab. Nganjuk, Jawa Timur</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                                <span>Senin - Minggu (08:00 - 21:00 WIB)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                                <span>Berdiri Sejak Tahun 2008</span>
                            </li>
                        </ul>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-white text-sm font-['Raleway']">Navigasi</h4>
                        <ul className="space-y-2 text-xs text-slate-400 font-normal">
                            <li><a href="#about" className="hover:text-rose-300 transition-colors">Tentang Dancell</a></li>
                            <li><a href="#visimisi" className="hover:text-rose-300 transition-colors">Visi & Misi</a></li>
                            <li><a href="#history" className="hover:text-rose-300 transition-colors">Sejarah 56 Cabang</a></li>
                            <li><a href="#social-impact" className="hover:text-rose-300 transition-colors">Pemberdayaan Perempuan</a></li>
                            <li><a href="#branches" className="hover:text-rose-300 transition-colors">Lokasi Outlet Ritel</a></li>
                        </ul>
                    </div>

                    {/* Nilai Utama */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-white text-sm font-['Raleway']">Nilai Utama</h4>
                        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
                            <div className="flex items-center gap-2 text-rose-300 text-xs font-medium">
                                <Heart className="w-3.5 h-3.5" />
                                <span>Kesejahteraan Bersama</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                                Mengedepankan kualitas pelayanan dan kebermanfaatan bagi masyarakat, karyawan, serta relasi bisnis.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom Line */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 font-normal">
                    <div>
                        © 2008 - 2026 <strong className="text-white font-medium">Dancell (Dan Group)</strong>. All rights reserved.
                    </div>
                    <div className="flex items-center gap-5">
                        <span className="hover:text-slate-300 cursor-pointer">Syarat & Ketentuan</span>
                        <span className="hover:text-slate-300 cursor-pointer">Kebijakan Privasi</span>
                        <span className="hover:text-slate-300 cursor-pointer">Karir Dancell</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

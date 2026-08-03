import React from 'react';
import { Store, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function ContactFooter({ footer }) {
    const brandName = footer?.brand_name || 'DANCELL';
    const brandTag = footer?.brand_tag || 'Official';
    const brandSubtitle = footer?.brand_subtitle || 'Dancell Official Company Profile 2025/2026';
    const brandDesc = footer?.brand_description || 'Dancell adalah perusahaan ritel terpercaya yang pertama kali berdiri pada tahun 2008 di Warujayeng, Nganjuk. Hingga kini memiliki 56 cabang aktif di seluruh wilayah Jawa Timur.';
    const branchBadge = footer?.branch_badge_text || '56 Cabang Siap Melayani Pelanggan';

    const officeTitle = footer?.office_title || 'Kantor Pusat';
    const officeAddress = footer?.office_address || 'Warujayeng, Kec. Tanjunganom, Kab. Nganjuk, Jawa Timur';
    const officeHours = footer?.office_hours || 'Senin - Minggu (08:00 - 21:00 WIB)';
    const officeEstablished = footer?.office_established || 'Berdiri Sejak Tahun 2008';

    const valueBoxTitle = footer?.value_box_title || 'Nilai Utama';
    const valueBoxHeading = footer?.value_box_heading || 'Kesejahteraan Bersama';
    const valueBoxDesc = footer?.value_box_description || 'Mengedepankan kualitas pelayanan dan kebermanfaatan bagi masyarakat, karyawan, serta relasi bisnis.';

    const copyrightText = footer?.copyright_text || '© 2008 - 2026 Dancell (Dancell Official). All rights reserved.';

    const navLinks = footer?.nav_links && footer.nav_links.length > 0
        ? footer.nav_links
        : [
            { label: 'Tentang Dancell', href: '#about' },
            { label: 'Visi & Misi', href: '#visimisi' },
            { label: 'Sejarah 56 Cabang', href: '#history' },
            { label: 'Produk & Aksesori', href: '#products' },
            { label: 'Lokasi Outlet Ritel', href: '#branches' },
        ];

    const bottomLinks = footer?.bottom_links && footer.bottom_links.length > 0
        ? footer.bottom_links
        : [
            { label: 'Syarat & Ketentuan', href: '#' },
            { label: 'Kebijakan Privasi', href: '#' },
            { label: 'Karir Dancell', href: '#' },
        ];

    return (
        <footer id="contact" className="bg-slate-900 text-white pt-16 pb-10 relative overflow-hidden font-['Raleway']">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
                    
                    {/* Brand Info */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="flex items-center gap-3">
                            
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-xl tracking-tight text-white font-['Raleway']">
                                        {brandName}
                                    </span>
                                    {brandTag && (
                                        <span className="px-1.5 py-0.5 text-[9px] font-medium bg-[#800020] text-white rounded-md tracking-wider uppercase">
                                            {brandTag}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-normal text-rose-300">
                                    {brandSubtitle}
                                </span>
                            </div>
                        </div>

                        <p className="text-slate-400 text-xs leading-relaxed max-w-md font-normal">
                            {brandDesc}
                        </p>

                        {branchBadge && (
                            <div className="flex items-center gap-2.5 text-xs font-normal text-emerald-400 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 w-fit">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span>{branchBadge}</span>
                            </div>
                        )}
                    </div>

                    {/* Kantor Pusat */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-white text-sm font-['Raleway']">{officeTitle}</h4>
                        <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
                            {officeAddress && (
                                <li className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                    <span>{officeAddress}</span>
                                </li>
                            )}
                            {officeHours && (
                                <li className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                                    <span>{officeHours}</span>
                                </li>
                            )}
                            {officeEstablished && (
                                <li className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                                    <span>{officeEstablished}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-white text-sm font-['Raleway']">Navigasi</h4>
                        <ul className="space-y-2 text-xs text-slate-400 font-normal">
                            {navLinks.map((link, idx) => (
                                <li key={`nl-${idx}`}>
                                    <a href={link.href || '#'} className="hover:text-rose-300 transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Nilai Utama */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-white text-sm font-['Raleway']">{valueBoxTitle}</h4>
                        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
                            <div className="flex items-center gap-2 text-rose-300 text-xs font-medium">
                                <Heart className="w-3.5 h-3.5" />
                                <span>{valueBoxHeading}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                                {valueBoxDesc}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom Line */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 font-normal">
                    <div>
                        {copyrightText}
                    </div>
                    <div className="flex items-center gap-5">
                        {bottomLinks.map((link, idx) => (
                            <a key={`bl-${idx}`} href={link.href || '#'} className="hover:text-slate-300 transition-colors">
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import {
    Globe,
    UserCheck,
    Lock,
    Save,
    CheckCircle2,
    Zap,
    Search,
    Share2,
    Code,
    Sparkles,
    Shield,
    Upload,
    Image as ImageIcon,
    MapPin,
    Radio,
    Link2,
    Eye,
    MessageSquare,
    MessageCircle,
    PhoneCall
} from 'lucide-react';

export default function Edit({ mustVerifyEmail, status, seo }) {
    const [activeTab, setActiveTab] = useState('seo'); // 'seo' | 'account'
    const [imagePreview, setImagePreview] = useState(seo?.og_image || '/images/hero.webp');

    // Form Hook for Global SEO Settings (with File Upload & Social Links)
    const { data: seoData, setData: setSeoData, post: postSeo, processing: processingSeo, errors: seoErrors } = useForm({
        site_title: seo?.site_title || 'Dancell — Jaringan Outlet Ritel Gadget & Smartphone Terbesar di Jawa Timur',
        site_name: seo?.site_name || 'Dancell Indonesia',
        meta_description: seo?.meta_description || 'Dancell adalah toko ritel gadget, HP, smartphone, & aksesori resmi terpercaya di Jawa Timur dengan 58 outlet aktif.',
        meta_keywords: seo?.meta_keywords || 'Dancell, toko hp Nganjuk, toko gadget Kediri, toko hp Blitar, toko hp Magetan, toko hp Madiun, toko hp Mojokerto',
        author: seo?.author || 'Dancell Indonesia',
        locale: seo?.locale || 'id_ID',
        canonical_url: seo?.canonical_url || 'https://dancell-official.com',
        og_title: seo?.og_title || 'Dancell — 58 Outlet Ritel Gadget Terpercaya Jawa Timur',
        og_description: seo?.og_description || 'Temukan cabang toko HP Dancell terdekat di Nganjuk, Kediri, Blitar, Magetan, Madiun, & Mojokerto.',
        og_image: seo?.og_image || '/images/hero.webp',
        og_image_file: null,
        og_image_alt: seo?.og_image_alt || 'Dancell Indonesia — Outlet Ritel Gadget Terkemuka Jawa Timur',
        og_type: seo?.og_type || 'website',
        twitter_card: seo?.twitter_card || 'summary_large_image',
        twitter_site: seo?.twitter_site || '@dancell_official',
        twitter_creator: seo?.twitter_creator || '@dancell_official',
        robots: seo?.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        google_site_verification: seo?.google_site_verification || '',
        bing_site_verification: seo?.bing_site_verification || '',
        yandex_site_verification: seo?.yandex_site_verification || '',
        facebook_app_id: seo?.facebook_app_id || '',
        facebook_page_url: seo?.facebook_page_url || 'https://facebook.com/dancell.official',
        instagram_account_url: seo?.instagram_account_url || 'https://instagram.com/dancell_official',
        tiktok_profile_url: seo?.tiktok_profile_url || 'https://tiktok.com/@dancell_official',
        whatsapp_cs_url: seo?.whatsapp_cs_url || 'https://wa.me/6285230855400',
        geo_region: seo?.geo_region || 'ID-JI',
        geo_placename: seo?.geo_placename || 'Nganjuk, Jawa Timur',
        geo_position: seo?.geo_position || '-7.604214;112.029845',
        structured_data_json: seo?.structured_data_json || '',
    });

    React.useEffect(() => {
        if (seo?.og_image) {
            setImagePreview(seo.og_image);
            setSeoData(d => ({ ...d, og_image: seo.og_image, og_image_file: null }));
        }
    }, [seo]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSeoData('og_image_file', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveSeo = (e) => {
        e.preventDefault();
        postSeo(route('profile.seo.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AdminLayout activeMenu="settings">
            <Head title="Pengaturan Akun & SEO Global 100% — Dancell" />

            <div className="font-['Raleway'] space-y-6">
                
                {/* Notification Alert */}
                {status && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{status}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                            ⚡ Redis Cache Cleared
                        </span>
                    </div>
                )}

                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-100 text-xs font-normal mb-1">
                            <Globe className="w-3.5 h-3.5 text-[#800020]" />
                            <span>Pusat Pengaturan SEO Komprehensif & Profil Admin</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight font-['Raleway']">
                            Pengaturan SEO 100% & Keamanan Akun
                        </h1>
                        <p className="text-xs text-slate-500 font-normal">
                            Kelola metadata Google Search, Upload OG Image, Social Links, Geo Meta Tags, & Schema.org JSON-LD.
                        </p>
                    </div>

                    {/* Tab Navigation Controls */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto border border-slate-200/80">
                        <button
                            type="button"
                            onClick={() => setActiveTab('seo')}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                                activeTab === 'seo'
                                    ? 'bg-white text-[#800020] shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>SEO & Metadata 100%</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('account')}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                                activeTab === 'account'
                                    ? 'bg-white text-[#800020] shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Keamanan Akun</span>
                        </button>
                    </div>
                </div>

                {/* TAB 1: SEO & METADATA SETTINGS */}
                {activeTab === 'seo' && (
                    <div className="space-y-6">
                        
                        {/* SEO Health Banner */}
                        <div className="bg-gradient-to-r from-[#4a0012] via-[#800020] to-[#600018] text-white p-6 sm:p-7 rounded-3xl shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="space-y-1.5 relative z-10">
                                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-400/30">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>SEO Audit Score: 100% Full Comprehensive</span>
                                </div>
                                <h2 className="text-lg font-bold">Metadata Google Search Engine & Social Media Sharing</h2>
                                <p className="text-xs text-rose-100/90 max-w-2xl leading-relaxed">
                                    Mendukung upload gambar OG Share, Google/Bing/Yandex Verification, Geo Meta Tags, Social Links, & JSON-LD LocalBusiness Schema yang tersinkronisasi instan ke Redis Cache.
                                </p>
                            </div>

                            <div className="shrink-0 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/15 text-center relative z-10">
                                <div className="text-2xl font-black text-amber-300">100%</div>
                                <div className="text-[10px] text-rose-200 uppercase font-semibold tracking-wider">SEO Score</div>
                            </div>
                        </div>

                        {/* Live SEO Previews (Google & WhatsApp Mockups) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            
                            {/* Live Google Search Preview Box */}
                            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">
                                    <Eye className="w-4 h-4 text-blue-600" />
                                    <span>Live Google Search Snippet Preview</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 font-sans">
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                        <span className="font-semibold text-slate-800">{seoData.site_name}</span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-500 truncate">{seoData.canonical_url}</span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer line-clamp-1">
                                        {seoData.site_title || 'Judul Utama Penelusuran'}
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                                        {seoData.meta_description || 'Deskripsi ringkas penelusuran...'}
                                    </p>
                                </div>
                            </div>

                            {/* Live WhatsApp / Facebook Share Card Preview Box */}
                            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">
                                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                                    <span>Live WhatsApp & Social Share Preview</span>
                                </div>
                                <div className="rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden font-sans space-y-0">
                                    <div className="w-full h-28 bg-slate-200 overflow-hidden relative flex items-center justify-center">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="OG Card" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="p-3 bg-slate-50 space-y-0.5">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                            {seoData.canonical_url.replace('https://', '')}
                                        </div>
                                        <div className="text-xs font-bold text-slate-800 truncate">
                                            {seoData.og_title || seoData.site_title}
                                        </div>
                                        <div className="text-[11px] text-slate-500 line-clamp-1">
                                            {seoData.og_description || seoData.meta_description}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <form onSubmit={handleSaveSeo} className="space-y-6">
                            
                            {/* Card 1: Main Search Engine Meta Tags & Site Identity */}
                            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                    <Search className="w-5 h-5 text-[#800020]" />
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Tag Meta Utama & Identitas Situs</h3>
                                        <p className="text-xs text-slate-500">Konfigurasi judul, deskripsi, kata kunci penelusuran, & verifikasi search engine.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    
                                    {/* Meta Title */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="block font-semibold text-slate-700">Judul Utama Penelusuran (Meta Title)</label>
                                        <input
                                            type="text"
                                            required
                                            value={seoData.site_title}
                                            onChange={(e) => setSeoData('site_title', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                        />
                                        <span className="text-[10px] text-slate-400 block">Rekomendasi: 50-60 Karakter.</span>
                                    </div>

                                    {/* Site Name */}
                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Nama Situs (Site Name)</label>
                                        <input
                                            type="text"
                                            required
                                            value={seoData.site_name}
                                            onChange={(e) => setSeoData('site_name', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                        />
                                    </div>

                                    {/* Author & Locale */}
                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Bahasa & Lokalisasi (Locale)</label>
                                        <input
                                            type="text"
                                            required
                                            value={seoData.locale}
                                            onChange={(e) => setSeoData('locale', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                            placeholder="id_ID"
                                        />
                                    </div>

                                    {/* Meta Description */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="block font-semibold text-slate-700">Deskripsi Ringkas Penelusuran (Meta Description)</label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={seoData.meta_description}
                                            onChange={(e) => setSeoData('meta_description', e.target.value)}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none leading-relaxed"
                                        />
                                        <span className="text-[10px] text-slate-400 block">Rekomendasi: 150-160 Karakter.</span>
                                    </div>

                                    {/* Meta Keywords */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="block font-semibold text-slate-700">Kata Kunci Penelusuran (Meta Keywords)</label>
                                        <input
                                            type="text"
                                            required
                                            value={seoData.meta_keywords}
                                            onChange={(e) => setSeoData('meta_keywords', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                        />
                                        <span className="text-[10px] text-slate-400 block">Pisahkan kata kunci dengan tanda koma.</span>
                                    </div>

                                    {/* Canonical URL & Author */}
                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">URL Canonical Domain (Canonical Link)</label>
                                        <input
                                            type="url"
                                            required
                                            value={seoData.canonical_url}
                                            onChange={(e) => setSeoData('canonical_url', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Penulis & Pemilik Hak Cipta (Author)</label>
                                        <input
                                            type="text"
                                            required
                                            value={seoData.author}
                                            onChange={(e) => setSeoData('author', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                        />
                                    </div>

                                    {/* Robots Meta Directive */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="block font-semibold text-slate-700">Petunjuk Robot Indexing (Robots Directives)</label>
                                        <input
                                            type="text"
                                            required
                                            value={seoData.robots}
                                            onChange={(e) => setSeoData('robots', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                        />
                                    </div>

                                    {/* Search Engine Webmaster Verifications */}
                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Google Search Console Verification Token</label>
                                        <input
                                            type="text"
                                            value={seoData.google_site_verification || ''}
                                            onChange={(e) => setSeoData('google_site_verification', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                            placeholder="google-site-verification=..."
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Bing Webmaster Verification Token</label>
                                        <input
                                            type="text"
                                            value={seoData.bing_site_verification || ''}
                                            onChange={(e) => setSeoData('bing_site_verification', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                            placeholder="msvalidate.01=..."
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Card 2: Open Graph & Social Media Sharing (With Image Upload Support) */}
                            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                    <Share2 className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Open Graph & Social Media Sharing (WA, FB, IG, X)</h3>
                                        <p className="text-xs text-slate-500">Upload file gambar OG Thumbnail & atur tampilan kartu saat link dibagikan di sosial media.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                                    
                                    {/* OG Image Upload Dropzone */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="block font-semibold text-slate-700">File Gambar Open Graph Share (OG Image Upload)</label>
                                        
                                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#800020] transition-colors">
                                            {/* Image Preview Box */}
                                            <div className="w-40 h-24 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center relative group">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="OG Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-8 h-8 text-slate-400" />
                                                )}
                                            </div>

                                            <div className="space-y-2 text-center sm:text-left flex-1">
                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                    <label className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-semibold shadow-xs cursor-pointer transition-all inline-flex items-center gap-1.5">
                                                        <Upload className="w-3.5 h-3.5" />
                                                        <span>Pilih File Gambar (Upload)</span>
                                                        <input
                                                            type="file"
                                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                                <p className="text-[11px] text-slate-500">
                                                    Rekomendasi rasio: <strong>1200 x 630 px</strong> (Format: PNG, JPG, WEBP • Max 4MB).
                                                </p>
                                            </div>
                                        </div>

                                        {/* Fallback Direct URL Input */}
                                        <div className="pt-1">
                                            <label className="block font-medium text-slate-600 text-[11px] mb-1">Atau masukkan URL Gambar OG Langsung:</label>
                                            <input
                                                type="text"
                                                value={seoData.og_image || ''}
                                                onChange={(e) => {
                                                    setSeoData('og_image', e.target.value);
                                                    setImagePreview(e.target.value);
                                                }}
                                                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                                placeholder="https://dancell-official.com/assets/images/og-dancell.jpg"
                                            />
                                        </div>
                                    </div>

                                    {/* OG Title */}
                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Judul Card Sosial Media (OG Title)</label>
                                        <input
                                            type="text"
                                            value={seoData.og_title || ''}
                                            onChange={(e) => setSeoData('og_title', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                        />
                                    </div>

                                    {/* OG Image Alt Text */}
                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Teks Deskripsi Gambar (OG Image Alt)</label>
                                        <input
                                            type="text"
                                            value={seoData.og_image_alt || ''}
                                            onChange={(e) => setSeoData('og_image_alt', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                        />
                                    </div>

                                    {/* OG Description */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="block font-semibold text-slate-700">Deskripsi Card Sosial Media (OG Description)</label>
                                        <textarea
                                            rows={2}
                                            value={seoData.og_description || ''}
                                            onChange={(e) => setSeoData('og_description', e.target.value)}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none leading-relaxed"
                                        />
                                    </div>

                                    {/* Twitter Card & Handles */}
                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Tipe Card Twitter (Twitter Card Format)</label>
                                        <input
                                            type="text"
                                            required
                                            value={seoData.twitter_card}
                                            onChange={(e) => setSeoData('twitter_card', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Username Official Twitter/X</label>
                                        <input
                                            type="text"
                                            value={seoData.twitter_site || ''}
                                            onChange={(e) => setSeoData('twitter_site', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Card 3: Official Social Media Links */}
                            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                    <Link2 className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Link Sosial Media Resmi (SameAs Accounts)</h3>
                                        <p className="text-xs text-slate-500">Tautan akun resmi Dancell yang disinkronkan ke Google Knowledge Graph.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Link Akun Instagram Official</label>
                                        <input
                                            type="url"
                                            value={seoData.instagram_account_url || ''}
                                            onChange={(e) => setSeoData('instagram_account_url', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                            placeholder="https://instagram.com/dancell_official"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Link Facebook Page Official</label>
                                        <input
                                            type="url"
                                            value={seoData.facebook_page_url || ''}
                                            onChange={(e) => setSeoData('facebook_page_url', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                            placeholder="https://facebook.com/dancell.official"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Link Profil TikTok Official</label>
                                        <input
                                            type="url"
                                            value={seoData.tiktok_profile_url || ''}
                                            onChange={(e) => setSeoData('tiktok_profile_url', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                            placeholder="https://tiktok.com/@dancell_official"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Link WhatsApp Customer Service</label>
                                        <input
                                            type="text"
                                            value={seoData.whatsapp_cs_url || ''}
                                            onChange={(e) => setSeoData('whatsapp_cs_url', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                            placeholder="https://wa.me/6281234567890"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Geo Meta Tags for Local Business SEO */}
                            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                    <MapPin className="w-5 h-5 text-rose-600" />
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Geo Meta Tags & Local Business SEO</h3>
                                        <p className="text-xs text-slate-500">Optimasi lokasi geografis toko untuk hasil pencarian lokal Google Maps & Regional Jatim.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                    
                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Kode Wilayah (Geo Region)</label>
                                        <input
                                            type="text"
                                            value={seoData.geo_region}
                                            onChange={(e) => setSeoData('geo_region', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                            placeholder="ID-JI"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Nama Kota/Wilayah (Geo Placename)</label>
                                        <input
                                            type="text"
                                            value={seoData.geo_placename}
                                            onChange={(e) => setSeoData('geo_placename', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                            placeholder="Nganjuk, Jawa Timur"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block font-semibold text-slate-700">Koordinat GPS (Geo Position Lat;Long)</label>
                                        <input
                                            type="text"
                                            value={seoData.geo_position}
                                            onChange={(e) => setSeoData('geo_position', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                            placeholder="-7.604214;112.029845"
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Card 5: JSON-LD Structured Data Schema.org */}
                            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                    <Code className="w-5 h-5 text-emerald-600" />
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">JSON-LD Structured Data Schema Markup (Schema.org)</h3>
                                        <p className="text-xs text-slate-500">Skema format data terstruktur untuk fitur Google Rich Snippet & Google Maps Store.</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <label className="block font-semibold text-slate-700">Skema JSON-LD Store / ElectronicsStore</label>
                                    <textarea
                                        rows={8}
                                        value={seoData.structured_data_json}
                                        onChange={(e) => setSeoData('structured_data_json', e.target.value)}
                                        className="w-full p-4 bg-slate-900 text-emerald-400 font-mono rounded-2xl text-[11px] leading-relaxed focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400 block">Format wajib JSON-LD Schema.org valid.</span>
                                </div>
                            </div>

                            {/* Form Submit Button */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processingSeo}
                                    className="px-6 py-3 rounded-2xl bg-[#800020] hover:bg-[#600018] text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{processingSeo ? 'Menyimpan File & Clear Cache...' : 'Simpan Pengaturan SEO Komprehensif 100%'}</span>
                                </button>
                            </div>

                        </form>
                    </div>
                )}

                {/* TAB 2: ADMIN ACCOUNT & SECURITY SETTINGS */}
                {activeTab === 'account' && (
                    <div className="space-y-6">
                        
                        {/* Profile Info Form */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                                <UserCheck className="w-5 h-5 text-[#800020]" />
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Informasi Administrator</h2>
                                    <p className="text-xs text-slate-500">Perbarui nama dan alamat email akun administrator utama.</p>
                                </div>
                            </div>

                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-2xl"
                            />
                        </div>

                        {/* Password Form */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                                <Lock className="w-5 h-5 text-amber-600" />
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Keamanan & Password</h2>
                                    <p className="text-xs text-slate-500">Gunakan password yang kuat untuk mengamankan akses ke panel admin Dancell.</p>
                                </div>
                            </div>

                            <UpdatePasswordForm className="max-w-2xl" />
                        </div>

                        {/* Delete User Account Form */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200/80 bg-rose-50/10 shadow-2xs space-y-4">
                            <div className="flex items-center gap-2.5 pb-4 border-b border-rose-100">
                                <Shield className="w-5 h-5 text-rose-600" />
                                <div>
                                    <h2 className="text-base font-bold text-rose-900">Zona Bahaya Hapus Akun</h2>
                                    <p className="text-xs text-slate-500">Hapus akun administrator secara permanen dari sistem.</p>
                                </div>
                            </div>

                            <DeleteUserForm className="max-w-2xl" />
                        </div>

                    </div>
                )}

            </div>
        </AdminLayout>
    );
}

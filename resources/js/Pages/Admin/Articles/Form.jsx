import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TiptapEditor from '@/Components/Admin/TiptapEditor';
import { 
    ArrowLeft, 
    Save, 
    Upload, 
    X, 
    Star, 
    Tag, 
    BookOpen, 
    Clock, 
    User, 
    Image as ImageIcon,
    CheckCircle2
} from 'lucide-react';

export default function ArticleForm({ isEdit = false, article = null, categories = [], suggestedTags = [] }) {
    const [tagInput, setTagInput] = useState('');
    const [imagePreview, setImagePreview] = useState(article?.image || null);

    const { data, setData, post, processing, errors } = useForm({
        title: article?.title || '',
        subtitle: article?.subtitle || '',
        excerpt: article?.excerpt || '',
        content: article?.content || '',
        category: article?.category || 'Review Gadget',
        category_slug: article?.category_slug || 'review-gadget',
        tags: article?.tags || [],
        author_name: article?.author_name || 'Dimas Prasetyo',
        author_role: article?.author_role || 'Hardware & Laptop Reviewer',
        reading_time: article?.reading_time || '4 min read',
        is_featured: article?.is_featured || false,
        is_published: article !== null ? article.is_published : true,
        image: null,
    });

    const handleCategoryChange = (e) => {
        const selectedSlug = e.target.value;
        const selectedObj = categories.find(c => c.slug === selectedSlug);
        setData({
            ...data,
            category_slug: selectedSlug,
            category: selectedObj ? selectedObj.name : 'Review Gadget',
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = tagInput.trim().replace(/,/g, '');
            if (val && !data.tags.includes(val)) {
                setData('tags', [...data.tags, val]);
                setTagInput('');
            }
        }
    };

    const handleQuickAddTag = (tagToAdd) => {
        if (!data.tags.includes(tagToAdd)) {
            setData('tags', [...data.tags, tagToAdd]);
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setData('tags', data.tags.filter(t => t !== tagToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('admin.articles.update', article.id));
        } else {
            post(route('admin.articles.store'));
        }
    };

    return (
        <AdminLayout activeMenu="articles">
            <Head title={`${isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'} | Admin Dancell`} />

            <form onSubmit={handleSubmit} className="space-y-8 max-w-7xl mx-auto pb-16">
                
                {/* Top Bar Navigation */}
                <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.articles.index')}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
                            title="Kembali ke Daftar Artikel"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                                {isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                            </h1>
                            <p className="text-xs text-slate-500 font-light mt-0.5">
                                Lengkapi informasi konten, format tulisan dengan Tiptap editor, dan upload banner cover.
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route('admin.articles.index')}
                        className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Daftar</span>
                    </Link>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column (8 Cols) - Content & Text Editor */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Title Box */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">Judul Artikel <span className="text-rose-600">*</span></label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Contoh: Panduan Cerdas Memilih Smartphone Garansi Resmi di 2026"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-normal text-slate-900 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all"
                                    required
                                />
                                {errors.title && <span className="text-xs text-rose-600">{errors.title}</span>}
                            </div>

                            {/* Subtitle */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">Subjudul / Headline Ringkas</label>
                                <input
                                    type="text"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                    placeholder="Penjelasan singkat di bawah judul..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-light text-slate-800 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all"
                                />
                            </div>

                            {/* Excerpt */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">Ringkasan / Excerpt (Tampil di Card Katalog & Hero) <span className="text-rose-600">*</span></label>
                                <textarea
                                    rows="3"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    placeholder="Ringkasan 2-3 kalimat mengenai isi artikel..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-light text-slate-800 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all"
                                    required
                                />
                                {errors.excerpt && <span className="text-xs text-rose-600">{errors.excerpt}</span>}
                            </div>
                        </div>

                        {/* Tiptap Rich Text Editor */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-slate-700 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-[#800020]" />
                                    <span>Isi Konten Artikel (Tiptap Rich Text Editor) <span className="text-rose-600">*</span></span>
                                </label>
                                <span className="text-[11px] text-slate-400 font-light">Format Heading, List, Link & Gambar</span>
                            </div>

                            <TiptapEditor
                                content={data.content}
                                onChange={(html) => setData('content', html)}
                                placeholder="Mulai menulis isi konten artikel, panduan, atau ulasan produk di sini..."
                            />
                            {errors.content && <span className="text-xs text-rose-600">{errors.content}</span>}
                        </div>

                        {/* Article Tags Manager */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-[#800020]" />
                                    <span>Tag & Topik Artikel</span>
                                </label>
                                <p className="text-[11px] text-slate-400 font-light">
                                    Tambahkan kata kunci topik artikel ini. Tekan Enter atau tanda koma (,) untuk menambahkan.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 min-h-[52px]">
                                {data.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#800020] text-xs font-normal border border-rose-200 shadow-2xs"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-rose-800 text-slate-400 ml-0.5 cursor-pointer"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Ketik tag & Enter..."
                                    className="bg-transparent border-0 text-xs focus:ring-0 text-slate-800 placeholder:text-slate-400 min-w-[140px] flex-1"
                                />
                            </div>

                            {/* Suggested Global Tags Quick Pick */}
                            {suggestedTags.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <span className="text-[11px] text-slate-500 font-light block">Saran Topik Populer:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {suggestedTags.map((sug, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleQuickAddTag(sug)}
                                                className={`px-2.5 py-1 rounded-full text-[11px] font-light transition-colors cursor-pointer ${
                                                    data.tags.includes(sug)
                                                        ? 'bg-rose-100 text-[#800020] border border-rose-300'
                                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                                }`}
                                            >
                                                +{sug}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column (4 Cols) - Metadata, Banner, Status */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Cover Image Uploader */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                            <label className="text-xs font-medium text-slate-700 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-[#800020]" />
                                <span>Banner / Cover Gambar</span>
                            </label>

                            {imagePreview ? (
                                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 group">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <label className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-medium cursor-pointer hover:bg-rose-50 transition-colors">
                                            Ganti
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center aspect-[16/10] rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#800020] bg-slate-50/50 hover:bg-rose-50/30 transition-all cursor-pointer p-4 text-center">
                                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                    <span className="text-xs font-medium text-slate-700">Upload Gambar Cover</span>
                                    <span className="text-[10px] text-slate-400 font-light mt-1">Format: JPG, PNG, WEBP (Maks 4MB)</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                            {errors.image && <span className="text-xs text-rose-600">{errors.image}</span>}
                        </div>

                        {/* Category & Status Settings */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
                            
                            {/* Category Selector */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">Kategori Artikel <span className="text-rose-600">*</span></label>
                                <select
                                    value={data.category_slug}
                                    onChange={handleCategoryChange}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.slug} value={cat.slug}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Reading Time */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">Estimasi Waktu Baca</label>
                                <input
                                    type="text"
                                    value={data.reading_time}
                                    onChange={(e) => setData('reading_time', e.target.value)}
                                    placeholder="Contoh: 4 min read"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-light text-slate-900 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                />
                            </div>

                            {/* Author Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">Nama Penulis <span className="text-rose-600">*</span></label>
                                <input
                                    type="text"
                                    value={data.author_name}
                                    onChange={(e) => setData('author_name', e.target.value)}
                                    placeholder="Contoh: Dimas Prasetyo"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-normal text-slate-900 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                    required
                                />
                            </div>

                            {/* Author Role */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700">Jabatan / Role Penulis</label>
                                <input
                                    type="text"
                                    value={data.author_role}
                                    onChange={(e) => setData('author_role', e.target.value)}
                                    placeholder="Contoh: Hardware Reviewer"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-light text-slate-900 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                />
                            </div>

                            {/* Hero Spotlight Switch */}
                            <div className="pt-4 border-t border-slate-100 space-y-3">
                                <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-rose-50/40 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="rounded text-[#800020] focus:ring-[#800020] mt-0.5"
                                    />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-medium text-slate-900 flex items-center gap-1.5">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                            <span>Sorotan Hero Slider</span>
                                        </span>
                                        <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                                            Tampilkan artikel ini di slide carousel bagian paling atas halaman /artikel.
                                        </p>
                                    </div>
                                </label>

                                {/* Published Status Switch */}
                                <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-emerald-50/40 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.is_published}
                                        onChange={(e) => setData('is_published', e.target.checked)}
                                        className="rounded text-emerald-600 focus:ring-emerald-600 mt-0.5"
                                    />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-medium text-slate-900 flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>Terbitkan Langsung</span>
                                        </span>
                                        <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                                            Bila dinonaktifkan, artikel berstatus draft dan tidak tampil ke publik.
                                        </p>
                                    </div>
                                </label>
                            </div>

                        </div>

                        {/* Bottom Sidebar Action Card: Batal & Simpan / Perbarui Artikel */}
                        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs sm:text-sm font-medium transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Menyimpan...' : (isEdit ? 'Perbarui Artikel' : 'Terbitkan Artikel')}</span>
                            </button>

                            <Link
                                href={route('admin.articles.index')}
                                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-colors text-center"
                            >
                                Batal
                            </Link>
                        </div>

                    </div>

                </div>

            </form>
        </AdminLayout>
    );
}

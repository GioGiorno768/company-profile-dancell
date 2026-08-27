import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Newspaper, 
    Plus, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    Eye, 
    Star, 
    CheckCircle2, 
    XCircle, 
    SlidersHorizontal, 
    Tag, 
    Sparkles, 
    ExternalLink, 
    X,
    Save,
    BookOpen,
    Clock,
    FolderPlus,
    Layers,
    ChevronDown,
    ChevronUp,
    Check,
    AlertTriangle,
    AlertCircle
} from 'lucide-react';

export default function ArticlesIndex({ articles, stats, settings, categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [panelOpen, setPanelOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('header'); // 'header', 'tags', 'categories'
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef(null);

    const [tagInput, setTagInput] = useState('');

    // Custom Delete Confirmation Modal State
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        id: null,
        title: '',
        type: 'article', // 'article', 'category', 'category_blocked'
        count: 0,
    });
    const [deleting, setDeleting] = useState(false);

    // Category CRUD Form State
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryOrder, setNewCategoryOrder] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    // Settings Form (Header & Global Tags)
    const { data: settingData, setData: setSettingData, post: postSettings, processing: savingSettings } = useForm({
        badge_text: settings?.badge_text || 'Pusat Informasi & Edukasi Teknologi',
        header_title: settings?.header_title || 'Jelajahi Artikel & Wawasan Gadget',
        header_subtitle: settings?.header_subtitle || 'Tips memilih smartphone, panduan garansi resmi, dan berita seputar jaringan toko Dancell.',
        global_tags: settings?.global_tags || ['Garansi Resmi', 'iPhone vs Android', 'Laptop Kuliah', 'Battery Health', 'Tukar Tambah', 'Promo Jatim', 'Kamera Flagship', 'Service Center'],
    });

    // Click outside listener for category dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setCategoryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.articles.index'), { search, category }, { preserveState: true, replace: true });
    };

    const handleCategoryFilter = (cat) => {
        setCategory(cat);
        router.get(route('admin.articles.index'), { search, category: cat }, { preserveState: true, replace: true });
    };

    const handleToggleStatus = (id) => {
        router.post(route('admin.articles.toggle-status', id), {}, { preserveScroll: true });
    };

    const handleToggleFeatured = (id) => {
        router.post(route('admin.articles.toggle-featured', id), {}, { preserveScroll: true });
    };

    // Open Delete Article Modal
    const openDeleteArticleModal = (id, title) => {
        setDeleteModal({
            isOpen: true,
            id,
            title,
            type: 'article',
            count: 0,
        });
    };

    // Open Delete Category Modal
    const openDeleteCategoryModal = (id, name, count) => {
        if (count > 0) {
            setDeleteModal({
                isOpen: true,
                id,
                title: name,
                type: 'category_blocked',
                count,
            });
            return;
        }

        setDeleteModal({
            isOpen: true,
            id,
            title: name,
            type: 'category',
            count: 0,
        });
    };

    // Execute Delete Action
    const handleConfirmDelete = () => {
        if (!deleteModal.id) return;
        setDeleting(true);

        if (deleteModal.type === 'article') {
            router.delete(route('admin.articles.destroy', deleteModal.id), {
                preserveScroll: true,
                onFinish: () => {
                    setDeleting(false);
                    setDeleteModal({ isOpen: false, id: null, title: '', type: 'article', count: 0 });
                }
            });
        } else if (deleteModal.type === 'category') {
            router.delete(route('admin.articles.categories.destroy', deleteModal.id), {
                preserveScroll: true,
                onFinish: () => {
                    setDeleting(false);
                    setDeleteModal({ isOpen: false, id: null, title: '', type: 'article', count: 0 });
                }
            });
        }
    };

    // Global Tags Handler
    const handleAddGlobalTag = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = tagInput.trim().replace(/,/g, '');
            if (val && !settingData.global_tags.includes(val)) {
                setSettingData('global_tags', [...settingData.global_tags, val]);
                setTagInput('');
            }
        }
    };

    const handleRemoveGlobalTag = (tagToRemove) => {
        setSettingData('global_tags', settingData.global_tags.filter(t => t !== tagToRemove));
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        postSettings(route('admin.articles.settings.update'), {
            preserveScroll: true,
        });
    };

    // Category CRUD Handlers
    const handleCreateCategory = (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        router.post(route('admin.articles.categories.store'), {
            name: newCategoryName.trim(),
            order: newCategoryOrder ? parseInt(newCategoryOrder, 10) : null,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewCategoryName('');
                setNewCategoryOrder('');
            }
        });
    };

    const handleStartEditCategory = (cat) => {
        setEditingCategoryId(cat.id);
        setEditingCategoryName(cat.name);
    };

    const handleSaveEditCategory = (id) => {
        if (!editingCategoryName.trim()) return;

        router.post(route('admin.articles.categories.update', id), {
            name: editingCategoryName.trim(),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingCategoryId(null);
                setEditingCategoryName('');
            }
        });
    };

    return (
        <AdminLayout activeMenu="articles">
            <Head title="Kelola Artikel & Edukasi | Admin Dancell" />

            <div className="space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                                Kelola Artikel & Wawasan Gadget
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[#800020] text-xs font-medium">
                                Database Dinamis
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 font-light mt-1">
                            Publikasikan artikel edukasi, atur sorotan hero slider, kelola kategori, dan tag topik populer.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setPanelOpen(!panelOpen)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer ${
                                panelOpen
                                    ? 'bg-[#800020] text-white border-[#800020]'
                                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                        >
                            <SlidersHorizontal className={`w-4 h-4 ${panelOpen ? 'text-white' : 'text-[#800020]'}`} />
                            <span>Pengaturan Header, Topik & Kategori</span>
                            {panelOpen ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                        </button>

                        <Link
                            href={route('admin.articles.create')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs sm:text-sm font-medium transition-all shadow-xs hover:shadow-md cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tulis Artikel Baru</span>
                        </Link>
                    </div>
                </div>

                {/* Collapsible Settings Panel (Appears ABOVE Quick Stats) */}
                <AnimatePresence>
                    {panelOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.98 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-md space-y-6">
                                
                                {/* Panel Header & Tab Switcher */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                                    <div className="flex items-center gap-2">
                                        <SlidersHorizontal className="w-5 h-5 text-[#800020]" />
                                        <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                                            Panel Pengaturan Konten & Kategori
                                        </h3>
                                    </div>

                                    {/* Tabs */}
                                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('header')}
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                                activeTab === 'header'
                                                    ? 'bg-white text-[#800020] shadow-xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            1. Header Publik
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('tags')}
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                                activeTab === 'tags'
                                                    ? 'bg-white text-[#800020] shadow-xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            2. Topik & Tag Global
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('categories')}
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                                activeTab === 'categories'
                                                    ? 'bg-white text-[#800020] shadow-xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            3. Kelola Kategori ({categories.length})
                                        </button>
                                    </div>
                                </div>

                                {/* Tab 1: Header Section Settings */}
                                {activeTab === 'header' && (
                                    <form onSubmit={handleSaveSettings} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-slate-700">Badge Header</label>
                                                <input
                                                    type="text"
                                                    value={settingData.badge_text}
                                                    onChange={(e) => setSettingData('badge_text', e.target.value)}
                                                    placeholder="Contoh: Pusat Informasi & Edukasi Teknologi"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-slate-700">Judul Utama Halaman</label>
                                                <input
                                                    type="text"
                                                    value={settingData.header_title}
                                                    onChange={(e) => setSettingData('header_title', e.target.value)}
                                                    placeholder="Contoh: Jelajahi Artikel & Wawasan Gadget"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-700">Deskripsi / Subjudul</label>
                                            <textarea
                                                rows="2"
                                                value={settingData.header_subtitle}
                                                onChange={(e) => setSettingData('header_subtitle', e.target.value)}
                                                placeholder="Deskripsi singkat seputar konten edukasi..."
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                            />
                                        </div>

                                        <div className="flex items-center justify-end pt-2">
                                            <button
                                                type="submit"
                                                disabled={savingSettings}
                                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
                                            >
                                                <Save className="w-3.5 h-3.5" />
                                                <span>{savingSettings ? 'Menyimpan...' : 'Simpan Perubahan Header'}</span>
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Tab 2: Global Popular Tags Settings */}
                                {activeTab === 'tags' && (
                                    <form onSubmit={handleSaveSettings} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
                                                <span>Topik & Tag Populer Global (Tampil di Sidebar Katalog & Reader)</span>
                                                <span className="text-[11px] text-slate-400 font-light">Ketik topik & tekan Enter</span>
                                            </label>
                                            
                                            <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 min-h-[60px]">
                                                {settingData.global_tags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-normal border border-slate-200 shadow-2xs"
                                                    >
                                                        #{tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveGlobalTag(tag)}
                                                            className="hover:text-rose-600 text-slate-400 cursor-pointer"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </span>
                                                ))}
                                                <input
                                                    type="text"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={handleAddGlobalTag}
                                                    placeholder="Ketik topik baru & Enter..."
                                                    className="bg-transparent border-0 text-xs focus:ring-0 text-slate-800 placeholder:text-slate-400 min-w-[150px] flex-1"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end pt-2">
                                            <button
                                                type="submit"
                                                disabled={savingSettings}
                                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
                                            >
                                                <Save className="w-3.5 h-3.5" />
                                                <span>{savingSettings ? 'Menyimpan...' : 'Simpan Tag Populer'}</span>
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Tab 3: CRUD Kategori Artikel */}
                                {activeTab === 'categories' && (
                                    <div className="space-y-6">
                                        
                                        {/* Form Tambah Kategori Baru */}
                                        <form onSubmit={handleCreateCategory} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                                            <span className="text-xs font-medium text-slate-900 flex items-center gap-1.5">
                                                <FolderPlus className="w-4 h-4 text-[#800020]" />
                                                <span>Tambah Kategori Baru</span>
                                            </span>

                                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                                <div className="w-full sm:flex-1">
                                                    <input
                                                        type="text"
                                                        value={newCategoryName}
                                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                                        placeholder="Nama Kategori (contoh: Panduan Service, Edukasi iOS)"
                                                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                        required
                                                    />
                                                </div>
                                                <div className="w-full sm:w-28">
                                                    <input
                                                        type="number"
                                                        value={newCategoryOrder}
                                                        onChange={(e) => setNewCategoryOrder(e.target.value)}
                                                        placeholder="Urutan"
                                                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer shrink-0"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    <span>Tambah Kategori</span>
                                                </button>
                                            </div>
                                        </form>

                                        {/* Daftar Kategori Table */}
                                        <div className="space-y-2">
                                            <span className="text-xs font-medium text-slate-700">Daftar Kategori yang Tersedia:</span>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {categories.map((cat) => (
                                                    <div
                                                        key={cat.id}
                                                        className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2"
                                                    >
                                                        {editingCategoryId === cat.id ? (
                                                            <div className="flex items-center gap-2 flex-1">
                                                                <input
                                                                    type="text"
                                                                    value={editingCategoryName}
                                                                    onChange={(e) => setEditingCategoryName(e.target.value)}
                                                                    className="w-full px-2.5 py-1 rounded-lg border border-slate-300 text-xs"
                                                                    autoFocus
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSaveEditCategory(cat.id)}
                                                                    className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                                                                    title="Simpan"
                                                                >
                                                                    <Check className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditingCategoryId(null)}
                                                                    className="p-1 rounded-md bg-slate-200 text-slate-600 hover:bg-slate-300 cursor-pointer"
                                                                    title="Batal"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="space-y-0.5 min-w-0">
                                                                    <span className="text-xs font-medium text-slate-900 block truncate">
                                                                        {cat.name}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400 font-light block">
                                                                        slug: {cat.slug} • {cat.count || 0} artikel
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-1 shrink-0">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleStartEditCategory(cat)}
                                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                                                        title="Edit Nama Kategori"
                                                                    >
                                                                        <Edit className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openDeleteCategoryModal(cat.id, cat.name, cat.count)}
                                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                                        title="Hapus Kategori"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                )}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-xs text-slate-500 font-light">Total Artikel</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl sm:text-3xl font-semibold text-slate-900">{stats.total}</span>
                            <BookOpen className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-xs text-slate-500 font-light">Artikel Terbit</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl sm:text-3xl font-semibold text-emerald-700">{stats.published}</span>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-xs text-slate-500 font-light">Sorotan di Hero</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl sm:text-3xl font-semibold text-amber-600">{stats.featured_hero}</span>
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-xs text-slate-500 font-light">Total Pembaca</span>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl sm:text-3xl font-semibold text-[#800020]">{stats.total_views?.toLocaleString()}</span>
                            <Eye className="w-5 h-5 text-[#800020]" />
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    {/* Left: Search Form */}
                    <form onSubmit={handleSearch} className="w-full sm:w-80 lg:w-96 relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari judul, ringkasan, atau penulis..."
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-light focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.get(route('admin.articles.index'), { search: '', category }, { preserveState: true, replace: true });
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </form>

                    {/* Right: Custom Animated Floating Category Dropdown */}
                    <div className="w-full sm:w-auto flex items-center gap-2">
                        <div ref={categoryDropdownRef} className="relative w-full sm:w-64">
                            
                            {/* Dropdown Trigger Button */}
                            <button
                                type="button"
                                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-normal transition-all cursor-pointer shadow-xs ${
                                    categoryDropdownOpen
                                        ? 'bg-white border-[#800020] ring-1 ring-[#800020] text-slate-900'
                                        : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-800'
                                }`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Filter className="w-4 h-4 text-[#800020] shrink-0" />
                                    <span className="truncate">
                                        {category === 'all'
                                            ? 'Semua Kategori (' + stats.total + ')'
                                            : (categories.find(c => c.slug === category)?.name || category)}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                                    categoryDropdownOpen ? 'rotate-180 text-[#800020]' : ''
                                }`} />
                            </button>

                            {/* Floating Animated Dropdown Menu with Max-Height & Custom Scrollbar */}
                            <AnimatePresence>
                                {categoryDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.18, ease: 'easeOut' }}
                                        className="absolute right-0 top-full mt-2 w-full min-w-[240px] bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl z-40 p-1.5 space-y-0.5"
                                    >
                                        <div className="max-h-60 overflow-y-auto sidebar-scroll pr-1">
                                            
                                            {/* Option: Semua Kategori */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleCategoryFilter('all');
                                                    setCategoryDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-normal transition-colors cursor-pointer ${
                                                    category === 'all'
                                                        ? 'bg-rose-50 text-[#800020] font-medium'
                                                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>Semua Kategori</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                                                        category === 'all' ? 'bg-rose-200/60 text-[#800020]' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {stats.total}
                                                    </span>
                                                    {category === 'all' && <Check className="w-3.5 h-3.5 text-[#800020]" />}
                                                </div>
                                            </button>

                                            <div className="h-px bg-slate-100 my-1 mx-2" />

                                            {/* Dynamic Category List */}
                                            {categories.map((cat) => {
                                                const isSelected = category === cat.slug;
                                                return (
                                                    <button
                                                        key={cat.slug}
                                                        type="button"
                                                        onClick={() => {
                                                            handleCategoryFilter(cat.slug);
                                                            setCategoryDropdownOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-normal transition-colors cursor-pointer ${
                                                            isSelected
                                                                ? 'bg-rose-50 text-[#800020] font-medium'
                                                                : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2 truncate">
                                                            <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            <span className="truncate">{cat.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                                                                isSelected ? 'bg-rose-200/60 text-[#800020]' : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                                {cat.count || 0}
                                                            </span>
                                                            {isSelected && <Check className="w-3.5 h-3.5 text-[#800020]" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}

                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>

                        {(search || category !== 'all') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setCategory('all');
                                    router.get(route('admin.articles.index'), {}, { preserveState: true, replace: true });
                                }}
                                className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-[#800020] hover:bg-rose-100 text-xs font-medium transition-colors cursor-pointer shrink-0"
                                title="Reset Filter"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                </div>

                {/* Articles Responsive List Cards */}
                <div className="space-y-4">
                    {articles.data.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#800020] flex items-center justify-center mx-auto">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <h3 className="text-base font-medium text-slate-900">Tidak ada artikel ditemukan</h3>
                            <p className="text-xs text-slate-500 font-light max-w-sm mx-auto">
                                Coba ubah kata kunci pencarian atau filter kategori, atau klik tombol "Tulis Artikel Baru".
                            </p>
                        </div>
                    ) : (
                        articles.data.map((art) => (
                            <div
                                key={art.id}
                                className="bg-white rounded-3xl p-4 sm:p-5 lg:p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                            >
                                {/* Left & Middle Section: Cover + Info */}
                                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 flex-1 min-w-0 w-full">
                                    
                                    {/* Cover Thumbnail with Badges */}
                                    <div className="w-full sm:w-48 lg:w-52 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 shrink-0 relative group border border-slate-100">
                                        <img
                                            src={art.image || '/images/hero.webp'}
                                            alt={art.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                                        
                                        {/* Category Pill over image */}
                                        <div className="absolute top-2.5 left-2.5">
                                            <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs text-[#800020] text-[11px] font-medium shadow-xs">
                                                {art.category}
                                            </span>
                                        </div>

                                        {/* Reading time */}
                                        {art.reading_time && (
                                            <div className="absolute bottom-2.5 right-2.5">
                                                <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-light flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-rose-300" />
                                                    <span>{art.reading_time}</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Info */}
                                    <div className="space-y-2 flex-1 min-w-0">
                                        
                                        {/* Meta Row: Author, Date, Views */}
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-light">
                                            <span className="font-medium text-slate-800">{art.author_name}</span>
                                            {art.author_role && <span className="text-slate-400">• {art.author_role}</span>}
                                            <span className="text-slate-300">|</span>
                                            <span>
                                                {art.created_at ? new Date(art.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                            </span>
                                            <span className="text-slate-300">|</span>
                                            <span className="inline-flex items-center gap-1 text-[#800020] font-medium bg-rose-50 px-2 py-0.5 rounded-full text-[11px]">
                                                <Eye className="w-3 h-3 text-[#800020]" />
                                                <span>{art.views?.toLocaleString()} views</span>
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base sm:text-lg font-medium text-slate-900 leading-snug">
                                            <Link
                                                href={route('admin.articles.edit', art.id)}
                                                className="hover:text-[#800020] transition-colors line-clamp-2"
                                            >
                                                {art.title}
                                            </Link>
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-xs sm:text-sm text-slate-500 font-light line-clamp-2 leading-relaxed">
                                            {art.excerpt}
                                        </p>

                                        {/* Tags */}
                                        {art.tags && art.tags.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                {art.tags.slice(0, 4).map((t, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-[11px] font-normal text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                                                    >
                                                        #{t}
                                                    </span>
                                                ))}
                                                {art.tags.length > 4 && (
                                                    <span className="text-[10px] text-slate-400 font-light">
                                                        +{art.tags.length - 4} lagi
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                    </div>

                                </div>

                                {/* Right Controls Bar: Quick Toggles & Action Buttons */}
                                <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                                    
                                    {/* Status Toggles Row */}
                                    <div className="flex items-center gap-2">
                                        
                                        {/* Hero Featured Spotlight Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleFeatured(art.id)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-normal transition-all cursor-pointer ${
                                                art.is_featured
                                                    ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 shadow-2xs'
                                                    : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                                            }`}
                                            title={art.is_featured ? 'Ditampilkan di Hero Carousel (Klik untuk Nonaktifkan)' : 'Jadikan Sorotan di Hero Carousel'}
                                        >
                                            <Star className={`w-3.5 h-3.5 ${art.is_featured ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                                            <span>{art.is_featured ? 'Hero Slide' : 'Biasa'}</span>
                                        </button>

                                        {/* Published Status Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(art.id)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-normal transition-all cursor-pointer ${
                                                art.is_published
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-2xs'
                                                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 shadow-2xs'
                                            }`}
                                            title="Ubah Status Publikasi"
                                        >
                                            {art.is_published ? (
                                                <>
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Terbit</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                                    <span>Draft</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Action Links */}
                                    <div className="flex items-center gap-1.5">
                                        <a
                                            href={'/artikel/' + art.slug}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                            title="Lihat Halaman Publik"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>

                                        <Link
                                            href={route('admin.articles.edit', art.id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#800020] text-xs font-medium transition-colors"
                                            title="Edit Artikel"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            <span>Edit</span>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => openDeleteArticleModal(art.id, art.title)}
                                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                            title="Hapus Artikel"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                </div>

                            </div>
                        ))
                    )}
                </div>

                {/* Clean Pagination Bar */}
                {articles.total > 0 && (
                    <div className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-xs text-slate-500 font-light text-center sm:text-left">
                            Menampilkan <span className="font-normal text-slate-800">{articles.from || 0}</span> - <span className="font-normal text-slate-800">{articles.to || 0}</span> dari total <span className="font-normal text-slate-800">{articles.total}</span> artikel
                        </span>

                        {articles.links && articles.links.length > 3 && (
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                                {articles.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-normal transition-all ${
                                            link.active
                                                ? 'bg-[#800020] text-white shadow-xs font-medium'
                                                : link.url
                                                    ? 'bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-[#800020] border border-slate-200/80'
                                                    : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-50 border border-slate-100'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Custom Animated Delete Confirmation Modal (Clean & Modern) */}
            <AnimatePresence>
                {deleteModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !deleting && setDeleteModal({ ...deleteModal, isOpen: false })}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
                        />

                        {/* Modal Dialog Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-center"
                        >
                            {/* Icon Indicator */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
                                deleteModal.type === 'category_blocked'
                                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                    : 'bg-rose-50 text-[#800020] border border-rose-200'
                            }`}>
                                {deleteModal.type === 'category_blocked' ? (
                                    <AlertTriangle className="w-7 h-7" />
                                ) : (
                                    <Trash2 className="w-7 h-7" />
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {deleteModal.type === 'category_blocked'
                                        ? 'Kategori Tidak Dapat Dihapus'
                                        : (deleteModal.type === 'category' ? 'Hapus Kategori Artikel?' : 'Hapus Artikel Ini?')}
                                </h3>

                                {deleteModal.type === 'category_blocked' ? (
                                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                                        Kategori <span className="font-medium text-slate-800">"{deleteModal.title}"</span> masih digunakan oleh <span className="font-semibold text-amber-700">{deleteModal.count} artikel</span>. Silakan ubah atau hapus artikel terkait terlebih dahulu.
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                                        Apakah Anda yakin ingin menghapus {deleteModal.type === 'category' ? 'kategori' : 'artikel'}{' '}
                                        <span className="font-medium text-slate-900">"{deleteModal.title}"</span>? Tindakan ini tidak dapat dibatalkan.
                                    </p>
                                )}
                            </div>

                            {/* Modal Action Buttons */}
                            <div className="pt-2 flex items-center justify-center gap-3">
                                {deleteModal.type === 'category_blocked' ? (
                                    <button
                                        type="button"
                                        onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        Mengerti
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            disabled={deleting}
                                            onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                                            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="button"
                                            disabled={deleting}
                                            onClick={handleConfirmDelete}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer disabled:opacity-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>{deleting ? 'Menghapus...' : 'Ya, Hapus'}</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </AdminLayout>
    );
}

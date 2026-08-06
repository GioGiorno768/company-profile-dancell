import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Store,
    Plus,
    Search,
    MapPin,
    Phone,
    MessageCircle,
    Clock,
    ExternalLink,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    Building2,
    Filter,
    RotateCcw,
    Zap,
    ChevronDown,
    ChevronUp,
    Save,
    SlidersHorizontal,
    Crown,
    Check,
    AlertCircle,
    X
} from 'lucide-react';

export default function BranchIndex({ branches = [], cities = [], branchSection = null, filters = {}, status }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCity, setSelectedCity] = useState(filters.city || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [showSectionSettings, setShowSectionSettings] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Auto-detect distinct cities directly from branch list
    const availableCities = React.useMemo(() => {
        const fromBranches = branches.map(b => b.city).filter(Boolean);
        return Array.from(new Set([...(cities || []), ...fromBranches])).sort();
    }, [cities, branches]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Smooth Animated Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'danger', // 'danger' | 'warning' | 'success'
        confirmText: 'Ya, Lanjutkan',
        cancelText: 'Batal',
        onConfirm: () => {},
    });

    // Dropdown open states
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const cityDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);

    // Close dropdowns on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
                setIsCityOpen(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setIsStatusOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Instant Auto Filter Trigger
    const applyFilter = (newSearch, newCity, newStatus) => {
        router.get(
            route('admin.branches.index'),
            {
                search: newSearch,
                city: newCity,
                status: newStatus,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    // Debounced search trigger
    const searchTimeoutRef = useRef(null);
    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            applyFilter(val, selectedCity, selectedStatus);
        }, 300);
    };

    // Instant City Select
    const handleSelectCity = (cityVal) => {
        setSelectedCity(cityVal);
        setIsCityOpen(false);
        applyFilter(searchQuery, cityVal, selectedStatus);
    };

    // Instant Status Select
    const handleSelectStatus = (statusVal) => {
        setSelectedStatus(statusVal);
        setIsStatusOpen(false);
        applyFilter(searchQuery, selectedCity, statusVal);
    };

    // Reset All Filters
    const handleResetFilter = () => {
        setSearchQuery('');
        setSelectedCity('all');
        setSelectedStatus('all');
        setIsCityOpen(false);
        setIsStatusOpen(false);
        router.get(route('admin.branches.index'), {}, { preserveState: true, preserveScroll: true });
    };

    // Section Header Form Hook
    const { data: sectionData, setData: setSectionData, post: postSection, processing: processingSection } = useForm({
        header_badge: branchSection?.header_badge || 'Jaringan Outlet Ritel',
        header_title: branchSection?.header_title || '56 Cabang Ritel Tersebar di Jawa Timur',
        header_description: branchSection?.header_description || 'Temukan cabang Dancell terdekat di kota Anda dengan pelayanan terbaik dan garansi produk terpercaya.',
        banner_title: branchSection?.banner_title || 'Total 56 Cabang & Terus Bertambah',
        banner_description: branchSection?.banner_description || 'Dancell berkomitmen menghadirkan outlet terdekat yang mudah dijangkau di seluruh kabupaten/kota Jawa Timur.',
        cta_btn_text: branchSection?.cta_btn_text || 'Hubungi Manajemen Dancell',
        cta_btn_link: branchSection?.cta_btn_link || '#contact',
    });

    const handleSaveSectionHeader = (e) => {
        e.preventDefault();
        postSection(route('admin.branches.section-header.update'), {
            preserveScroll: true,
        });
    };

    // Toggle Status with Minimalist Confirmation Modal
    const handleToggleStatus = (branch) => {
        const isActivating = !branch.is_active;
        setConfirmModal({
            isOpen: true,
            title: isActivating ? 'Aktifkan Outlet Cabang?' : 'Non-aktifkan Outlet Cabang?',
            message: `Apakah Anda yakin ingin ${isActivating ? 'mengaktifkan' : 'menonaktifkan'} outlet "${branch.name}" (${branch.city}) di website utama?`,
            type: isActivating ? 'success' : 'warning',
            confirmText: isActivating ? 'Ya, Aktifkan' : 'Ya, Non-aktifkan',
            cancelText: 'Batal',
            onConfirm: () => {
                router.post(route('admin.branches.toggle', branch.id), {}, {
                    preserveScroll: true,
                    onSuccess: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
                });
            },
        });
    };

    // Delete Branch with Minimalist Confirmation Modal
    const handleDelete = (branch) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Outlet Cabang?',
            message: `Apakah Anda yakin ingin menghapus outlet "${branch.name}" (${branch.city})? Data cabang yang sudah dihapus tidak dapat dikembalikan.`,
            type: 'danger',
            confirmText: 'Ya, Hapus Cabang',
            cancelText: 'Batal',
            onConfirm: () => {
                router.delete(route('admin.branches.destroy', branch.id), {
                    preserveScroll: true,
                    onSuccess: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
                });
            },
        });
    };

    const totalActive = branches.filter(b => b.is_active).length;
    const totalInactive = branches.length - totalActive;
    const isFiltered = searchQuery !== '' || selectedCity !== 'all' || selectedStatus !== 'all';

    return (
        <AdminLayout activeMenu="branches">
            <Head title="Kelola Outlet Cabang — Dancell" />

            <div className="font-['Raleway'] space-y-6">
                
                {/* Notification Alert */}
                {status && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{status}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                            ⚡ Redis Cache Updated
                        </span>
                    </div>
                )}

                {/* Header Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-100 text-xs font-normal mb-1">
                            <Store className="w-3.5 h-3.5 text-[#800020]" />
                            <span>Manajemen Jaringan Outlet — Jawa Timur</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight font-['Raleway']">
                            Kelola Outlet Cabang Dancell
                        </h1>
                        <p className="text-xs text-slate-500 font-normal">
                            Tambah, perbarui lokasi, atur teks header landing page, jam operasional, dan status keaktifan outlet.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                        <button
                            onClick={() => setShowSectionSettings(!showSectionSettings)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-[#800020]" />
                            <span>Teks Header Section</span>
                            {showSectionSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <Link
                            href={route('admin.branches.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#800020] hover:bg-[#600018] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Cabang Baru</span>
                        </Link>
                    </div>
                </div>

                {/* Collapsible Section Header Settings Panel */}
                {showSectionSettings && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-5">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal className="w-5 h-5 text-[#800020]" />
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Pengaturan Teks Header & Banner Section Cabang</h2>
                                    <p className="text-xs text-slate-500">Atur teks judul, deskripsi, dan tombol banner jaringan cabang yang tampil di Landing Page.</p>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                                Real-Time Landing Config
                            </span>
                        </div>

                        <form onSubmit={handleSaveSectionHeader} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {/* Badge Text */}
                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">Badge Tagline Section Header</label>
                                    <input
                                        type="text"
                                        required
                                        value={sectionData.header_badge}
                                        onChange={(e) => setSectionData('header_badge', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                </div>

                                {/* Header Title */}
                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">Judul Utama (Header Title)</label>
                                    <input
                                        type="text"
                                        required
                                        value={sectionData.header_title}
                                        onChange={(e) => setSectionData('header_title', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                </div>

                                {/* Header Description */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="block font-semibold text-slate-700">Deskripsi Sub-Judul (Header Description)</label>
                                    <textarea
                                        rows={2}
                                        value={sectionData.header_description}
                                        onChange={(e) => setSectionData('header_description', e.target.value)}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none leading-relaxed"
                                    />
                                </div>

                                {/* Banner Title */}
                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">Judul Banner Total Network (Bawah Grid)</label>
                                    <input
                                        type="text"
                                        required
                                        value={sectionData.banner_title}
                                        onChange={(e) => setSectionData('banner_title', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                </div>

                                {/* Banner Description */}
                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">Deskripsi Banner Network</label>
                                    <input
                                        type="text"
                                        value={sectionData.banner_description}
                                        onChange={(e) => setSectionData('banner_description', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                </div>

                                {/* CTA Button Text */}
                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">Teks Tombol CTA Banner</label>
                                    <input
                                        type="text"
                                        required
                                        value={sectionData.cta_btn_text}
                                        onChange={(e) => setSectionData('cta_btn_text', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                </div>

                                {/* CTA Button Link */}
                                <div className="space-y-1.5">
                                    <label className="block font-semibold text-slate-700">Link Tujuan Tombol CTA</label>
                                    <input
                                        type="text"
                                        required
                                        value={sectionData.cta_btn_link}
                                        onChange={(e) => setSectionData('cta_btn_link', e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                                    />
                                </div>

                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowSectionSettings(false)}
                                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingSection}
                                    className="px-5 py-2.5 rounded-xl bg-[#800020] hover:bg-[#600018] text-white font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{processingSection ? 'Menyimpan...' : 'Simpan Teks Header'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Stat Highlights Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                        <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Outlet Cabang</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1">{branches.length} <span className="text-xs font-normal text-slate-400">Toko</span></div>
                        </div>
                        <Store className="w-6 h-6 text-[#800020]" />
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                        <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Outlet Aktif</div>
                            <div className="text-2xl font-bold text-emerald-600 mt-1">{totalActive} <span className="text-xs font-normal text-slate-400">Toko</span></div>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                        <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Kota Terjangkau</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1">{availableCities.length} <span className="text-xs font-normal text-slate-400">Kota/Kab</span></div>
                        </div>
                        <Building2 className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                        <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Kecepatan Cache</div>
                            <div className="text-2xl font-bold text-rose-800 mt-1 flex items-center gap-1">
                                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                                <span>Redis</span>
                            </div>
                        </div>
                        <Zap className="w-6 h-6 text-amber-500" />
                    </div>
                </div>

                {/* Instant Live Filter Bar (No Confirm Button Required & Custom Clean Scrollable Dropdowns) */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                        
                        {/* Instant Live Search Input */}
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Ketik langsung untuk cari nama cabang, kota, area, alamat..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all outline-none"
                            />
                        </div>

                        {/* Custom Clean Scrollable City Dropdown */}
                        <div className="relative w-full md:w-52" ref={cityDropdownRef}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCityOpen(!isCityOpen);
                                    setIsStatusOpen(false);
                                }}
                                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                            >
                                <span className="truncate">
                                    {selectedCity === 'all' ? `Semua Kota (${availableCities.length})` : `Kota: ${selectedCity}`}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isCityOpen && (
                                <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 max-h-60 overflow-y-auto space-y-0.5">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectCity('all')}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                                            selectedCity === 'all' ? 'bg-rose-50 text-[#800020] font-semibold' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span>Semua Kota ({availableCities.length})</span>
                                        {selectedCity === 'all' && <Check className="w-3.5 h-3.5 text-[#800020]" />}
                                    </button>

                                    <div className="my-1 border-t border-slate-100" />

                                    {availableCities.map((city) => (
                                        <button
                                            key={city}
                                            type="button"
                                            onClick={() => handleSelectCity(city)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                                                selectedCity === city ? 'bg-rose-50 text-[#800020] font-semibold' : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span>{city}</span>
                                            {selectedCity === city && <Check className="w-3.5 h-3.5 text-[#800020]" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Custom Clean Scrollable Status Dropdown */}
                        <div className="relative w-full md:w-44" ref={statusDropdownRef}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsStatusOpen(!isStatusOpen);
                                    setIsCityOpen(false);
                                }}
                                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                            >
                                <span className="truncate">
                                    {selectedStatus === 'all' ? 'Semua Status' : (selectedStatus === 'active' ? 'Status: Aktif' : 'Status: Non-aktif')}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isStatusOpen && (
                                <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 max-h-60 overflow-y-auto space-y-0.5">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectStatus('all')}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                                            selectedStatus === 'all' ? 'bg-rose-50 text-[#800020] font-semibold' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span>Semua Status</span>
                                        {selectedStatus === 'all' && <Check className="w-3.5 h-3.5 text-[#800020]" />}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSelectStatus('active')}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                                            selectedStatus === 'active' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span>Aktif</span>
                                        </span>
                                        {selectedStatus === 'active' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleSelectStatus('inactive')}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                                            selectedStatus === 'inactive' ? 'bg-slate-100 text-slate-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                                            <span>Non-aktif</span>
                                        </span>
                                        {selectedStatus === 'inactive' && <Check className="w-3.5 h-3.5 text-slate-600" />}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Reset Filter Button (Only Visible when Filters are Active) */}
                        {isFiltered && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                                title="Reset Semua Filter"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset</span>
                            </button>
                        )}

                    </div>
                </div>

                {/* Branch Cards Grid */}
                {branches.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-2xs space-y-3">
                        <Store className="w-12 h-12 text-slate-300 mx-auto" />
                        <div className="font-semibold text-slate-800 text-sm">Tidak ada cabang ditemukan</div>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            Coba ubah kata kunci pencarian atau reset filter untuk menampilkan cabang outlet Dancell.
                        </p>
                        <button
                            onClick={handleResetFilter}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Filter</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {branches.map((branch) => (
                            <div
                                key={branch.id}
                                className={`bg-white rounded-2xl border ${
                                    branch.is_hq
                                        ? 'border-2 border-[#800020] ring-2 ring-rose-500/20 shadow-sm'
                                        : branch.is_active ? 'border-slate-200/80 hover:border-rose-300' : 'border-slate-200/50 bg-slate-50/50 opacity-75'
                                } p-5 shadow-2xs transition-all duration-200 flex flex-col justify-between group`}
                            >
                                <div className="space-y-3">
                                    
                                    {/* Card Header: Badges & Status */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-[#800020] text-[10px] font-semibold tracking-wider uppercase border border-rose-100">
                                                {branch.city}
                                            </span>
                                            {branch.is_hq && (
                                                <span className="px-2.5 py-1 rounded-lg bg-[#800020] text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 border border-rose-400/40">
                                                    <Crown className="w-3 h-3 text-rose-200" />
                                                    <span>HQ</span>
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                                                branch.is_active
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${branch.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                                <span>{branch.is_active ? 'Aktif' : 'Non-aktif'}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Branch Name & Area */}
                                    <div>
                                        <h3 className="font-semibold text-slate-900 text-base group-hover:text-[#800020] transition-colors line-clamp-1">
                                            {branch.name}
                                        </h3>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Area: {branch.area || branch.city} {branch.year ? `• Berdiri ${branch.year}` : ''}
                                        </p>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-start gap-2 text-xs text-slate-600">
                                        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                        <p className="line-clamp-2 leading-relaxed text-slate-600">
                                            {branch.address}
                                        </p>
                                    </div>

                                    {/* Contact & Hours */}
                                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{branch.opening_hours || 'Buka Setiap Hari'}</span>
                                            </div>
                                            {branch.whatsapp && (
                                                <a
                                                    href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:underline"
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

                                {/* Card Footer Actions */}
                                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                    
                                    {/* Left Map Button */}
                                    {branch.google_maps_url ? (
                                        <a
                                            href={branch.google_maps_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#800020] font-medium transition-colors"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            <span>Google Maps</span>
                                        </a>
                                    ) : (
                                        <span className="text-[11px] text-slate-400 italic">No Map Link</span>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5">
                                        
                                        {/* Toggle Status Button */}
                                        <button
                                            onClick={() => handleToggleStatus(branch)}
                                            className={`p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                                                branch.is_active
                                                    ? 'bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800'
                                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                            }`}
                                            title={branch.is_active ? 'Non-aktifkan Outlet' : 'Aktifkan Outlet'}
                                        >
                                            {branch.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                        </button>

                                        {/* Edit Button */}
                                        <Link
                                            href={route('admin.branches.edit', branch.id)}
                                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#800020] transition-colors cursor-pointer"
                                            title="Edit Data Cabang"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </Link>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(branch)}
                                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition-colors cursor-pointer"
                                            title="Hapus Cabang"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                    </div>

                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Teleport Confirmation Modal directly to document.body via React Portal */}
            {isMounted && createPortal(
                <AnimatePresence>
                    {confirmModal.isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[999999] w-screen h-screen flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-['Raleway'] overflow-hidden"
                            onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.88, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-[28px] border border-slate-100 shadow-2xl max-w-sm w-full p-6 sm:p-7 space-y-5 text-center relative overflow-hidden"
                            >
                                {/* Close Button Top Right */}
                                <button
                                    type="button"
                                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                    className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="Tutup"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Modal Icon Badge */}
                                <div className="mx-auto flex items-center justify-center pt-2">
                                    {confirmModal.type === 'danger' && (
                                        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#800020] shadow-2xs">
                                            <Trash2 className="w-6 h-6 text-[#800020]" />
                                        </div>
                                    )}
                                    {confirmModal.type === 'warning' && (
                                        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
                                            <AlertCircle className="w-6 h-6 text-amber-600" />
                                        </div>
                                    )}
                                    {confirmModal.type === 'success' && (
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                        </div>
                                    )}
                                </div>

                                {/* Modal Title & Message */}
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-slate-900 leading-snug tracking-tight font-['Raleway']">
                                        {confirmModal.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                        {confirmModal.message}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                        className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                                    >
                                        {confirmModal.cancelText || 'Batal'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            confirmModal.onConfirm();
                                        }}
                                        className={`flex-1 py-3 px-4 rounded-xl text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer ${
                                            confirmModal.type === 'danger'
                                                ? 'bg-[#800020] hover:bg-[#600018]'
                                                : confirmModal.type === 'warning'
                                                ? 'bg-amber-600 hover:bg-amber-700'
                                                : 'bg-[#800020] hover:bg-[#600018]'
                                        }`}
                                    >
                                        {confirmModal.confirmText || 'Ya, Lanjutkan'}
                                    </button>
                                </div>

                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </AdminLayout>
    );
}

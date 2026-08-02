import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Layers, 
    TrendingUp, 
    Award, 
    Save, 
    CheckCircle2, 
    Eye, 
    ExternalLink, 
    Plus, 
    Trash2, 
    Store, 
    Users, 
    Building2, 
    Info
} from 'lucide-react';
import DynamicIcon from '@/Components/Common/DynamicIcon';

export default function HistoryTimelineSetting({ historyTimeline, status }) {
    const [adminActiveTab, setAdminActiveTab] = useState('expansions'); // 'expansions' | 'milestones'
    const [previewActiveTab, setPreviewActiveTab] = useState('expansions');

    const { data, setData, post, processing } = useForm({
        header_badge: historyTimeline?.header_badge || 'Perjalanan & Rekam Jejak',
        header_title: historyTimeline?.header_title || 'Sejarah Pertumbuhan Dancell',
        header_description: historyTimeline?.header_description || 'Dari toko pertama di Warujayeng pada tahun 2008, bertransformasi menjadi jaringan ritel 56 cabang terdepan di Jawa Timur.',
        expansions: historyTimeline?.expansions || [
            {
                id: 'exp-2020',
                year: '2020',
                count: 14,
                added: '14 Cabang',
                highlight: 'Dancell 2020 – Mojoroto',
                desc: 'Awal ekspansi multi-cabang terstruktur di area Kediri & Mojoroto.',
                current: false,
            },
            {
                id: 'exp-2021',
                year: '2021',
                count: 25,
                added: '+11 Cabang',
                highlight: 'Dancell 2021 – Srengat',
                desc: 'Pertumbuhan pesat merambah area Blitar & Srengat.',
                current: false,
            },
            {
                id: 'exp-2022',
                year: '2022',
                count: 34,
                added: '+9 Cabang',
                highlight: 'Dancell 2022 – Magetan',
                desc: 'Melebarkan jaringan ritel ke wilayah Barat Jawa Timur (Magetan).',
                current: false,
            },
            {
                id: 'exp-2023',
                year: '2023',
                count: 41,
                added: '+7 Cabang',
                highlight: 'Dancell 2023 – Semen',
                desc: 'Tersebar kokoh hampir di seluruh wilayah strategis Jawa Timur.',
                current: false,
            },
            {
                id: 'exp-2024',
                year: '2024',
                count: 48,
                added: '+7 Cabang',
                highlight: 'Dancell 2024 – Uteran',
                desc: 'Memperkuat jaringan outlet di kawasan Uteran dan sekitarnya.',
                current: false,
            },
            {
                id: 'exp-2025',
                year: '2025',
                count: 53,
                added: '+5 Cabang',
                highlight: 'Dancell 2025 – Mojosari',
                desc: 'Penambahan cabang berlanjut secara masif di Mojosari.',
                current: false,
            },
            {
                id: 'exp-2026',
                year: '2026',
                count: 56,
                added: '+3 Cabang',
                highlight: '56 Cabang Terkini',
                desc: 'Kondisi terkini 56 outlet aktif siap melayani pelanggan Jawa Timur.',
                current: true,
            },
        ],
        milestones: historyTimeline?.milestones || [
            {
                id: 'ms-2008',
                year: '2008',
                title: 'Berdiri Pertama Kali',
                desc: 'Dancell pertama kali berdiri di Warujayeng, Nganjuk.',
                icon_svg: '',
            },
            {
                id: 'ms-2012',
                year: '2012',
                title: 'Awal Perjalanan Toko',
                desc: 'Perjalanan awal toko dengan pembentukan tim kecil yang solid.',
                icon_svg: '',
            },
            {
                id: 'ms-2013',
                year: '2013',
                title: 'Pengembangan Layanan',
                desc: 'Pengembangan kapasitas tim dan standar pelayanan ritel.',
                icon_svg: '',
            },
            {
                id: 'ms-2015',
                year: '2015',
                title: 'Pembukaan Dancell 2',
                desc: 'Pembukaan outlet Dancell 2, tim operasional mulai membesar.',
                icon_svg: '',
            },
            {
                id: 'ms-2017',
                year: '2017',
                title: 'Budaya Kerja Solid',
                desc: 'Pematangan suasana kerja yang semakin terstruktur dan kompak.',
                icon_svg: '',
            },
            {
                id: 'ms-2018',
                year: '2018',
                title: 'Pertumbuhan Pesat',
                desc: 'Tim besar dengan seragam khas, menandai era pertumbuhan cepat.',
                icon_svg: '',
            },
        ],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.content.history.update'));
    };

    // Expansion CRUD
    const handleAddExpansion = () => {
        const nextYear = String(new Date().getFullYear() + 1);
        const newExp = {
            id: `exp-${Date.now()}`,
            year: nextYear,
            count: 60,
            added: '+4 Cabang',
            highlight: `Dancell ${nextYear} – Cabang Baru`,
            desc: 'Deskripsi rencana penambahan jaringan cabang baru.',
            current: false,
        };
        setData('expansions', [...data.expansions, newExp]);
    };

    const handleRemoveExpansion = (indexToRemove) => {
        setData('expansions', data.expansions.filter((_, idx) => idx !== indexToRemove));
    };

    const handleUpdateExpansionField = (index, field, value) => {
        const updated = [...data.expansions];
        if (field === 'current' && value === true) {
            // Set current on target, unset current on all others
            updated.forEach((item, idx) => {
                item.current = idx === index;
            });
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }
        setData('expansions', updated);
    };

    // Milestone CRUD
    const handleAddMilestone = () => {
        const newMs = {
            id: `ms-${Date.now()}`,
            year: '2027',
            title: 'Inovasi & Pencapaian Baru',
            desc: 'Deskripsi momen bersejarah baru dalam perjalanan Dancell.',
            icon_svg: '',
        };
        setData('milestones', [...data.milestones, newMs]);
    };

    const handleRemoveMilestone = (indexToRemove) => {
        setData('milestones', data.milestones.filter((_, idx) => idx !== indexToRemove));
    };

    const handleUpdateMilestoneField = (index, field, value) => {
        const updated = [...data.milestones];
        updated[index] = { ...updated[index], [field]: value };
        setData('milestones', updated);
    };

    const sectionTabs = [
        { id: 'hero', label: 'Hero Section', href: route('admin.content.hero'), active: true },
        { id: 'visi-misi', label: 'Visi & Misi', href: route('admin.content.visi-misi'), active: true },
        { id: 'history', label: 'Sejarah & Timeline', href: route('admin.content.history'), active: true },
        { id: 'mitra', label: 'Mitra & Brand', href: route('admin.content.mitra'), active: true },
        { id: 'footer', label: 'Footer & Kontak', href: route('admin.content.footer'), active: true },
        { id: 'tentang', label: 'Tentang Kami', active: false },
    ];

    return (
        <AdminLayout activeMenu="content-hero">
            <Head title="Kelola Content Web — Sejarah & Timeline" />

            <div className="font-['Raleway']">
                
                {/* Header Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 text-[#800020] border border-rose-100 text-xs font-normal mb-1">
                            <Layers className="w-3.5 h-3.5 text-[#800020]" />
                            <span>Pengaturan Content Website</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight font-['Raleway']">
                            Kelola Sejarah & Timeline Dancell
                        </h1>
                        <p className="text-xs text-slate-500 font-normal">
                            Atur judul section, riwayat pertumbuhan cabang per tahun, dan garis waktu momen penting perusahaan.
                        </p>
                    </div>

                    <a
                        href="/#history"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
                    >
                        <span>Pratinjau Landing Page</span>
                        <ExternalLink className="w-3.5 h-3.5 text-rose-300" />
                    </a>
                </div>

                {/* Sub-Header Top Menu Bar (Fixed Sticky Bar Flush at Top of Main Viewport) */}
                <div className="sticky top-[56px] z-30 bg-slate-50/95 backdrop-blur-md py-3 -mx-6 sm:-mx-8 px-6 sm:px-8 border-b border-slate-200/80 mb-6 shadow-2xs">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-2xs overflow-x-auto">
                        <div className="flex items-center gap-1 min-w-max">
                            {sectionTabs.map((tab) => (
                                tab.href ? (
                                    <Link
                                        key={tab.id}
                                        href={tab.href}
                                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                                            tab.id === 'history'
                                                ? 'bg-[#800020] text-white shadow-xs font-semibold'
                                                : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                    </Link>
                                ) : (
                                    <button
                                        key={tab.id}
                                        disabled
                                        className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 bg-slate-50 cursor-not-allowed opacity-60 flex items-center gap-2"
                                    >
                                        <span>{tab.label}</span>
                                        <span className="px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-600 text-[9px] font-mono">
                                            Segera
                                        </span>
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Notification */}
                {status && (
                    <div className="p-4 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{status}</span>
                    </div>
                )}

                {/* Split Grid: Form Controls (Left) & Live Preview (Right) */}
                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Form Controls (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Section 1: Header Titles */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 font-['Raleway'] flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-[#800020]" />
                                    <span>Header Section (Judul Atas Sejarah)</span>
                                </h3>
                                <p className="text-xs text-slate-500">Teks pembuka untuk section Sejarah & Rekam Jejak.</p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Badge Label Atas
                                    </label>
                                    <input
                                        type="text"
                                        value={data.header_badge}
                                        onChange={(e) => setData('header_badge', e.target.value)}
                                        placeholder="Perjalanan & Rekam Jejak"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Judul Utama Section
                                    </label>
                                    <input
                                        type="text"
                                        value={data.header_title}
                                        onChange={(e) => setData('header_title', e.target.value)}
                                        placeholder="Sejarah Pertumbuhan Dancell"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs font-semibold text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Deskripsi Singkat Section
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.header_description}
                                        onChange={(e) => setData('header_description', e.target.value)}
                                        placeholder="Dari toko pertama di Warujayeng pada tahun 2008..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#800020] text-xs text-slate-900 leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Dual Sub-Tab Switcher for Form */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-5">
                            
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAdminActiveTab('expansions');
                                            setPreviewActiveTab('expansions');
                                        }}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                                            adminActiveTab === 'expansions'
                                                ? 'bg-[#800020] text-white shadow-2xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        <span>Pertumbuhan Cabang ({data.expansions.length})</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAdminActiveTab('milestones');
                                            setPreviewActiveTab('milestones');
                                        }}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                                            adminActiveTab === 'milestones'
                                                ? 'bg-[#800020] text-white shadow-2xs'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Award className="w-3.5 h-3.5" />
                                        <span>Momen Penting ({data.milestones.length})</span>
                                    </button>
                                </div>

                                {adminActiveTab === 'expansions' ? (
                                    <button
                                        type="button"
                                        onClick={handleAddExpansion}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#800020] text-white text-xs font-semibold hover:bg-[#5c0017] transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Tambah Tahun Ekspansi</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleAddMilestone}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#800020] text-white text-xs font-semibold hover:bg-[#5c0017] transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Tambah Momen Penting</span>
                                    </button>
                                )}
                            </div>

                            {/* TAB 1: EXPANSION ITEMS FORM */}
                            {adminActiveTab === 'expansions' && (
                                <div className="space-y-4">
                                    {data.expansions.map((exp, index) => (
                                        <div
                                            key={exp.id || index}
                                            className={`p-5 rounded-2xl border transition-all duration-200 space-y-3 ${
                                                exp.current 
                                                    ? 'bg-slate-900 text-white border-slate-800 shadow-md' 
                                                    : 'bg-slate-50/70 border-slate-200/80'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                                        exp.current ? 'bg-rose-950 text-rose-200' : 'bg-slate-200 text-slate-700'
                                                    }`}>
                                                        {index + 1}
                                                    </span>
                                                    <span className={`text-xs font-bold ${exp.current ? 'text-white' : 'text-slate-900'}`}>
                                                        {exp.year ? `Tahun ${exp.year}` : `Item Ekspansi #${index + 1}`}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {/* Radio/Checkbox for Current State */}
                                                    <label className={`flex items-center gap-1.5 text-[11px] font-medium cursor-pointer ${
                                                        exp.current ? 'text-rose-300 font-bold' : 'text-slate-700'
                                                    }`}>
                                                        <input
                                                            type="radio"
                                                            name="current_expansion"
                                                            checked={!!exp.current}
                                                            onChange={() => handleUpdateExpansionField(index, 'current', true)}
                                                            className="rounded-full border-slate-300 text-[#800020] focus:ring-[#800020] w-3.5 h-3.5"
                                                        />
                                                        <span>Kondisi Terkini (Active)</span>
                                                    </label>

                                                    {/* Delete Button */}
                                                    {data.expansions.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveExpansion(index)}
                                                            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-white/10 transition-colors"
                                                            title="Hapus Ekspansi"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <label className={`block text-[11px] font-medium mb-1 ${exp.current ? 'text-slate-300' : 'text-slate-700'}`}>Tahun</label>
                                                    <input
                                                        type="text"
                                                        value={exp.year}
                                                        onChange={(e) => handleUpdateExpansionField(index, 'year', e.target.value)}
                                                        placeholder="2026"
                                                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                                                            exp.current ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                                                        }`}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={`block text-[11px] font-medium mb-1 ${exp.current ? 'text-slate-300' : 'text-slate-700'}`}>Jumlah Total Cabang</label>
                                                    <input
                                                        type="number"
                                                        value={exp.count}
                                                        onChange={(e) => handleUpdateExpansionField(index, 'count', Number(e.target.value))}
                                                        placeholder="56"
                                                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                                                            exp.current ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                                                        }`}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={`block text-[11px] font-medium mb-1 ${exp.current ? 'text-slate-300' : 'text-slate-700'}`}>Label Penambahan</label>
                                                    <input
                                                        type="text"
                                                        value={exp.added}
                                                        onChange={(e) => handleUpdateExpansionField(index, 'added', e.target.value)}
                                                        placeholder="+3 Cabang"
                                                        className={`w-full px-3 py-2 rounded-xl border text-xs ${
                                                            exp.current ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                                                        }`}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={`block text-[11px] font-medium mb-1 ${exp.current ? 'text-slate-300' : 'text-slate-700'}`}>Judul Highlight Utama</label>
                                                <input
                                                    type="text"
                                                    value={exp.highlight}
                                                    onChange={(e) => handleUpdateExpansionField(index, 'highlight', e.target.value)}
                                                    placeholder="56 Cabang Terkini"
                                                    className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold ${
                                                        exp.current ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                                                    }`}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-[11px] font-medium mb-1 ${exp.current ? 'text-slate-300' : 'text-slate-700'}`}>Deskripsi Ringkas</label>
                                                <textarea
                                                    rows={2}
                                                    value={exp.desc}
                                                    onChange={(e) => handleUpdateExpansionField(index, 'desc', e.target.value)}
                                                    placeholder="Kondisi terkini 56 outlet aktif..."
                                                    className={`w-full px-3 py-2 rounded-xl border text-xs leading-relaxed ${
                                                        exp.current ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* TAB 2: MILESTONE ITEMS FORM */}
                            {adminActiveTab === 'milestones' && (
                                <div className="space-y-4">
                                    {data.milestones.map((ms, index) => (
                                        <div
                                            key={ms.id || index}
                                            className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 transition-all duration-200 space-y-3"
                                        >
                                            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {ms.year ? `Tahun ${ms.year} — ${ms.title}` : `Momen Penting #${index + 1}`}
                                                    </span>
                                                </div>

                                                {/* Delete Button */}
                                                {data.milestones.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMilestone(index)}
                                                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100/50 transition-colors"
                                                        title="Hapus Momen"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Tahun Momen</label>
                                                    <input
                                                        type="text"
                                                        value={ms.year}
                                                        onChange={(e) => handleUpdateMilestoneField(index, 'year', e.target.value)}
                                                        placeholder="2008"
                                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Judul Momen Penting</label>
                                                    <input
                                                        type="text"
                                                        value={ms.title}
                                                        onChange={(e) => handleUpdateMilestoneField(index, 'title', e.target.value)}
                                                        placeholder="Berdiri Pertama Kali"
                                                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-medium text-slate-700 mb-1">Penjelasan Deskripsi Momen</label>
                                                <textarea
                                                    rows={2}
                                                    value={ms.desc}
                                                    onChange={(e) => handleUpdateMilestoneField(index, 'desc', e.target.value)}
                                                    placeholder="Dancell pertama kali berdiri di Warujayeng..."
                                                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 leading-relaxed"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-medium text-slate-700 mb-1 flex items-center justify-between">
                                                    <span>Kode SVG Ikon (Opsional)</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">Format &lt;svg...&gt;</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={ms.icon_svg}
                                                    onChange={(e) => handleUpdateMilestoneField(index, 'icon_svg', e.target.value)}
                                                    placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...></svg>'
                                                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-800"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* Save Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#800020] hover:bg-[#5c0017] text-white font-medium text-xs shadow-lg shadow-rose-950/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Menyimpan Perubahan...' : 'Simpan Konten Sejarah & Timeline'}</span>
                            </button>
                        </div>

                    </div>

                    {/* Right Column: Realtime Live Preview Card (Sticky Desktop Floating) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-[130px] space-y-4">
                        
                        <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                                <span className="flex items-center gap-1.5 font-medium text-rose-300">
                                    <Eye className="w-4 h-4" />
                                    <span>Pratinjau Timeline Realtime</span>
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewActiveTab('expansions')}
                                        className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                                            previewActiveTab === 'expansions'
                                                ? 'bg-rose-950 text-rose-200 border-rose-800'
                                                : 'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}
                                    >
                                        Ekspansi
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewActiveTab('milestones')}
                                        className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                                            previewActiveTab === 'milestones'
                                                ? 'bg-rose-950 text-rose-200 border-rose-800'
                                                : 'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}
                                    >
                                        Momen
                                    </button>
                                </div>
                            </div>

                            {/* Simulated Timeline Box */}
                            <div className="rounded-2xl bg-white text-slate-900 p-4 space-y-4 border border-slate-200 shadow-inner max-h-[75vh] overflow-y-auto">
                                
                                {/* Header Preview */}
                                <div className="text-center space-y-1">
                                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#800020] text-[9px] font-semibold border border-rose-100 inline-block">
                                        {data.header_badge || 'Badge Header...'}
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                        {data.header_title || 'Judul Sejarah...'}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 line-clamp-2">
                                        {data.header_description || 'Deskripsi Sejarah...'}
                                    </p>
                                </div>

                                {/* PREVIEW TAB 1: EXPANSIONS */}
                                {previewActiveTab === 'expansions' && (
                                    <div className="space-y-2 pt-1">
                                        <span className="text-[10px] font-bold text-slate-700 block">Pertumbuhan Cabang ({data.expansions.length} Tahun):</span>
                                        
                                        <div className="grid grid-cols-1 gap-2">
                                            {data.expansions.map((item, idx) => (
                                                <div
                                                    key={item.id || idx}
                                                    className={`p-3 rounded-xl border text-left space-y-1 ${
                                                        item.current
                                                            ? 'bg-slate-900 text-white border-slate-800'
                                                            : 'bg-white border-slate-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm font-bold ${item.current ? 'text-white' : 'text-[#800020]'}`}>
                                                            {item.year}
                                                        </span>
                                                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                                                            item.current ? 'bg-rose-950 text-rose-200 border border-rose-800' : 'bg-rose-50 text-[#800020]'
                                                        }`}>
                                                            {item.added}
                                                        </span>
                                                    </div>

                                                    <div className={`text-base font-semibold ${item.current ? 'text-white' : 'text-slate-900'}`}>
                                                        {item.count} <span className="text-[10px] font-normal text-slate-400">Cabang</span>
                                                    </div>
                                                    <h5 className={`text-xs font-bold ${item.current ? 'text-rose-100' : 'text-slate-800'}`}>
                                                        {item.highlight}
                                                    </h5>
                                                    <p className={`text-[10px] line-clamp-2 leading-relaxed ${item.current ? 'text-slate-300' : 'text-slate-500'}`}>
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* PREVIEW TAB 2: MILESTONES */}
                                {previewActiveTab === 'milestones' && (
                                    <div className="space-y-2 pt-1">
                                        <span className="text-[10px] font-bold text-slate-700 block">Momen Penting ({data.milestones.length} Item):</span>
                                        
                                        <div className="border-l-2 border-rose-200 ml-2 space-y-3 py-1">
                                            {data.milestones.map((ms, idx) => (
                                                <div key={ms.id || idx} className="relative pl-5">
                                                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#800020]" />
                                                    
                                                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <DynamicIcon svgString={ms.icon_svg} fallback={idx === 0 ? Store : idx === 1 ? Users : Building2} className="w-3 h-3 text-[#800020]" />
                                                            <span className="text-[10px] font-bold text-[#800020] font-mono">{ms.year}</span>
                                                            <span className="text-xs font-bold text-slate-900">— {ms.title}</span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-600 leading-snug line-clamp-2">
                                                            {ms.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Informational Hint */}
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                            <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                                <Info className="w-4 h-4 text-amber-700" />
                                <span>Multi-Tab Timeline Management:</span>
                            </div>
                            <p className="text-[11px] text-amber-800/90 leading-relaxed font-normal">
                                Lu bisa beralih antara form <strong>Pertumbuhan Cabang</strong> dan <strong>Momen Penting</strong> untuk menambah/edit/hapus data secara mandiri. Gunakan radio <strong>"Kondisi Terkini"</strong> untuk menandai card pencapaian cabang paling update saat ini.
                            </p>
                        </div>

                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}

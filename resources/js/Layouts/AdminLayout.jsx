import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Store, 
    ShoppingBag, 
    Settings, 
    LogOut, 
    Menu, 
    X, 
    ExternalLink, 
    ShieldCheck, 
    ChevronDown,
    Layers
} from 'lucide-react';

export default function AdminLayout({ children, activeMenu = 'dashboard' }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'));
    };

    const navigation = [
        { id: 'dashboard', name: 'Dashboard Utama', href: route('dashboard'), icon: LayoutDashboard },
        { id: 'content-hero', name: 'Kelola Content Web', href: route('admin.content.hero'), icon: Layers },
        { id: 'branches', name: 'Kelola Cabang', href: route('admin.branches.index'), icon: Store },
        // { id: 'products', name: 'Katalog Produk & Brand', href: route('dashboard') + '#products', icon: ShoppingBag },
        // { id: 'settings', name: 'Pengaturan Akun', href: route('profile.edit'), icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-['Raleway'] text-slate-900 flex flex-col md:flex-row antialiased selection:bg-[#800020] selection:text-white">
            
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
                />
            )}

            {/* Clean Sidebar Navigation (Matching Landing Theme) */}
            <aside className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            } h-screen shrink-0 border-r border-slate-800 shadow-xl`}>
                
                <div className="p-6 space-y-7 relative z-10 flex-1 overflow-y-auto">
                    
                    {/* Brand Logo - Clean Vector Typography without box */}
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-xl tracking-tight text-white font-['Raleway']">
                                        DANCELL
                                    </span>
                                    <span className="px-1.5 py-0.5 text-[9px] font-medium rounded-md uppercase bg-white/10 text-rose-200 border border-white/10">
                                        Admin
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-normal">
                                    Retail Gadget Jawa Timur
                                </span>
                            </div>
                        </Link>

                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="space-y-1.5 pt-2">
                        <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                            Menu Administrasi
                        </div>
                        {navigation.map((item) => {
                            const IconComponent = item.icon;
                            const isSelected = activeMenu === item.id || (item.id === 'dashboard' && activeMenu === 'dashboard');

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 text-xs transition-all duration-200 ${
                                        isSelected
                                            ? 'text-white font-semibold'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    <IconComponent className={`w-4 h-4 shrink-0 ${
                                        isSelected ? 'text-white' : 'text-slate-400'
                                    }`} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                </div>

                {/* Sidebar Footer Logout */}
                <div className="p-4 border-t border-slate-800 relative z-10 space-y-3">
                    <div className="px-2 flex items-center gap-2 text-[11px] text-slate-400 font-normal">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sistem Dancell Terproteksi</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-white/10 text-xs font-medium transition-all duration-200 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Keluar (Logout)</span>
                    </button>
                </div>

            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Clean Top Header Bar */}
                <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-2xs">
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Panel Admin Dancell</span>
                        </div>
                    </div>

                    {/* Right Action Items */}
                    <div className="flex items-center gap-4">
                        
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-50 text-[#800020] hover:bg-rose-100/80 border border-rose-100 text-xs font-medium transition-colors"
                        >
                            <span>Lihat Website</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#800020]" />
                        </a>

                        {/* Admin User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-xl bg-[#800020] text-white flex items-center justify-center font-semibold text-xs shadow-xs">
                                    {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div className="hidden sm:flex flex-col text-left">
                                    <span className="text-xs font-semibold text-slate-900 leading-tight">
                                        {auth?.user?.name || 'Administrator'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-normal">
                                        {auth?.user?.email || 'admin@dancell-official.com'}
                                    </span>
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            {/* Dropdown Content */}
                            {userDropdownOpen && (
                                <div 
                                    onClick={() => setUserDropdownOpen(false)}
                                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200/80 shadow-xl py-2 z-50 text-xs text-slate-700 space-y-1"
                                >
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <div className="font-semibold text-slate-900">{auth?.user?.name || 'Administrator'}</div>
                                        <div className="text-[11px] text-slate-500">{auth?.user?.email || 'admin@dancell-official.com'}</div>
                                    </div>
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                                    >
                                        <Settings className="w-4 h-4 text-slate-400" />
                                        <span>Pengaturan Profile</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-700 cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4 text-rose-500" />
                                        <span>Keluar (Logout)</span>
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>

            </div>
        </div>
    );
}

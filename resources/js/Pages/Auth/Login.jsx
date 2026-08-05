import React, { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login Admin — Dancell" />

            <div className="space-y-6">
                
                {/* Header Title */}
                <div className="space-y-1.5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#800020] text-[11px] font-medium mb-1">
                        <KeyRound className="w-3.5 h-3.5 text-[#800020]" />
                        <span>Restricted Access Portal</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 font-['Raleway'] tracking-tight">
                        Login Administrator
                    </h1>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed">
                        Masukkan kredensial terdaftar untuk mengelola toko ritel & konten Dancell.
                    </p>
                </div>

                {/* Status Alert Notification */}
                {status && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4 pt-1">
                    
                    {/* Email Input Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-xs font-medium text-slate-700">
                            Email Admin
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="Masukkan email..."
                                autoComplete="username"
                                autoFocus
                                required
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent text-xs text-slate-900 placeholder-slate-400 transition-all shadow-xs"
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1 text-xs text-rose-600 font-normal" />
                    </div>

                    {/* Password Input Field */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-xs font-medium text-slate-700">
                                Kata Sandi
                            </label>
                        </div>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent text-xs text-slate-900 placeholder-slate-400 transition-all shadow-xs"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-1 text-xs text-rose-600 font-normal" />
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-slate-300 text-[#800020] focus:ring-[#800020]"
                            />
                            <span className="text-xs text-slate-600">
                                Ingat sesi login di perangkat ini
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-3 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#800020] to-[#5c0017] hover:bg-[#5c0017] text-white font-medium text-xs shadow-md shadow-rose-900/10 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                        {processing ? (
                            <span>Memproses Autentikasi...</span>
                        ) : (
                            <>
                                <span>Masuk ke Dashboard Admin</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

            </div>
        </GuestLayout>
    );
}

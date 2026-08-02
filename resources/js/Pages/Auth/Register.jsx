import React from 'react';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun — Portal Dancell" />

            <div className="space-y-6">
                
                {/* Header Title */}
                <div className="space-y-1.5 text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-white font-['Raleway']">
                        Buat Akun Baru
                    </h1>
                    <p className="text-xs text-slate-300 font-normal">
                        Lengkapi formulir di bawah ini untuk mendaftarkan akun di portal Dancell.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    
                    {/* Name Input Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="name" className="block text-xs font-medium text-slate-200">
                            Nama Lengkap
                        </label>
                        <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                placeholder="Nama Anda"
                                autoComplete="name"
                                autoFocus
                                required
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm text-white placeholder-slate-500 transition-all"
                            />
                        </div>
                        <InputError message={errors.name} className="mt-1 text-xs text-rose-300" />
                    </div>

                    {/* Email Input Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-xs font-medium text-slate-200">
                            Alamat Email
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="nama@dancell.id"
                                autoComplete="username"
                                required
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm text-white placeholder-slate-500 transition-all"
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1 text-xs text-rose-300" />
                    </div>

                    {/* Password Input Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="block text-xs font-medium text-slate-200">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm text-white placeholder-slate-500 transition-all"
                            />
                        </div>
                        <InputError message={errors.password} className="mt-1 text-xs text-rose-300" />
                    </div>

                    {/* Confirm Password Input Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="password_confirmation" className="block text-xs font-medium text-slate-200">
                            Konfirmasi Kata Sandi
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm text-white placeholder-slate-500 transition-all"
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1 text-xs text-rose-300" />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-[#800020] hover:from-rose-500 hover:to-[#a31d3b] text-white font-medium text-sm shadow-lg hover:shadow-rose-900/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                        {processing ? (
                            <span>Memproses Pendaftaran...</span>
                        ) : (
                            <>
                                <span>Daftar Akun Baru</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Link to Login */}
                <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
                    Sudah memiliki akun?{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-rose-300 hover:text-white transition-colors underline"
                    >
                        Masuk di Sini
                    </Link>
                </div>

            </div>
        </GuestLayout>
    );
}

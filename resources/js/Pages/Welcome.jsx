import React from 'react';
import { Head } from '@inertiajs/react';
import { ReactLenis } from 'lenis/react';
import Navbar from '../Components/Landing/Navbar';
import HeroSection from '../Components/Landing/HeroSection';
import VisiMisiSection from '../Components/Landing/VisiMisiSection';
import HistoryTimeline from '../Components/Landing/HistoryTimeline';
import SocialImpact from '../Components/Landing/SocialImpact';
import BranchNetwork from '../Components/Landing/BranchNetwork';
import ContactFooter from '../Components/Landing/ContactFooter';

export default function Welcome({ hero, visiMisi, historyTimeline, partnerBrand, footer, auth, laravelVersion, phpVersion }) {
    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
            <Head title="Dancell — Official Company Profile | Ritel Gadget Terkemuka Jawa Timur" />

            <div className="min-h-screen bg-slate-50 font-['Raleway'] text-slate-900 selection:bg-[#800020] selection:text-white antialiased">
                {/* Navbar */}
                <Navbar />

                {/* Main Landing Page Content */}
                <main>
                    {/* Hero Section */}
                    <div id="about">
                        <HeroSection hero={hero} />
                    </div>

                    {/* Visi & Misi Section */}
                    <VisiMisiSection visiMisi={visiMisi} />

                    {/* Interactive History & Branch Expansion Timeline (2008 - 2026) */}
                    <HistoryTimeline historyTimeline={historyTimeline} />

                    {/* Official Brand Partners & Retail Distributors Section */}
                    <SocialImpact partnerBrand={partnerBrand} />

                    {/* 56 Branches Retail Network Showcase */}
                    <BranchNetwork />
                </main>

                {/* Footer Section */}
                <ContactFooter footer={footer} />
            </div>
        </ReactLenis>
    );
}

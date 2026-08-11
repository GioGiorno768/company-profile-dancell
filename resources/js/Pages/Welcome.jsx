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

export default function Welcome({ seo, hero, visiMisi, historyTimeline, partnerBrand, footer, branchSection, branches = [], canLogin, canRegister }) {
    const rawOgImage = seo?.og_image || 'https://dancell-official.com/assets/images/og-dancell.jpg';
    const ogImageUrl = rawOgImage.startsWith('http')
        ? rawOgImage
        : `https://dancell-official.com${rawOgImage.startsWith('/') ? '' : '/'}${rawOgImage}`;

    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
            <Head>
                {/* Preconnect Candidates for 140ms LCP savings */}
                <link rel="preconnect" href="https://api.iconify.design" />
                <link rel="dns-prefetch" href="https://api.iconify.design" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* Preload Hero Image for instant LCP rendering */}
                <link rel="preload" as="image" href="/images/hero.webp" type="image/webp" fetchPriority="high" />

                {/* 1. Core Meta Tags */}
                <title>{seo?.site_title || "Dancell — Official Company Profile | Ritel Gadget Terkemuka Jawa Timur"}</title>
                <meta name="description" content={seo?.meta_description || "Dancell adalah jaringan toko ritel gadget, HP, smartphone, & aksesori resmi terpercaya di Jawa Timur."} head-key="description" />
                <meta name="keywords" content={seo?.meta_keywords || "Dancell, toko hp Nganjuk, toko gadget Kediri, toko hp Blitar"} head-key="keywords" />
                <meta name="author" content={seo?.author || "Dancell Indonesia"} head-key="author" />
                <meta name="robots" content={seo?.robots || "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} head-key="robots" />
                <meta name="language" content="Indonesian" />
                {seo?.locale && <meta httpEquiv="content-language" content={seo.locale} />}
                {seo?.canonical_url && <link rel="canonical" href={seo.canonical_url} head-key="canonical" />}

                {/* 2. Webmaster Site Verifications (Google, Bing, Yandex) */}
                {seo?.google_site_verification && <meta name="google-site-verification" content={seo.google_site_verification} head-key="google-site-verification" />}
                {seo?.bing_site_verification && <meta name="msvalidate.01" content={seo.bing_site_verification} head-key="bing_site_verification" />}
                {seo?.yandex_site_verification && <meta name="yandex-verification" content={seo.yandex_site_verification} head-key="yandex-verification" />}
                {seo?.facebook_app_id && <meta property="fb:app_id" content={seo.facebook_app_id} head-key="facebook_app_id" />}

                {/* 3. Geo Location Meta Tags for Local Business SEO */}
                {seo?.geo_region && <meta name="geo.region" content={seo.geo_region} head-key="geo.region" />}
                {seo?.geo_placename && <meta name="geo.placename" content={seo.geo_placename} head-key="geo.placename" />}
                {seo?.geo_position && <meta name="geo.position" content={seo.geo_position} head-key="geo.position" />}
                {seo?.geo_position && <meta name="ICBM" content={seo.geo_position.replace(';', ', ')} head-key="ICBM" />}

                {/* 4. Open Graph (OG) Facebook / WhatsApp Social Cards */}
                <meta property="og:site_name" content={seo?.site_name || "Dancell Indonesia"} head-key="og:site_name" />
                <meta property="og:title" content={seo?.og_title || seo?.site_title} head-key="og:title" />
                <meta property="og:description" content={seo?.og_description || seo?.meta_description} head-key="og:description" />
                <meta property="og:type" content={seo?.og_type || "website"} head-key="og:type" />
                <meta property="og:locale" content={seo?.locale || "id_ID"} head-key="og:locale" />
                {seo?.canonical_url && <meta property="og:url" content={seo.canonical_url} head-key="og:url" />}
                <meta property="og:image" content={ogImageUrl} head-key="og:image" />
                <meta property="og:image:secure_url" content={ogImageUrl} head-key="og:image:secure_url" />
                <meta property="og:image:width" content="1200" head-key="og:image:width" />
                <meta property="og:image:height" content="630" head-key="og:image:height" />
                <meta property="og:image:type" content="image/jpeg" head-key="og:image:type" />
                {seo?.og_image_alt && <meta property="og:image:alt" content={seo.og_image_alt} head-key="og:image:alt" />}

                {/* 5. Twitter / X Cards */}
                <meta name="twitter:card" content={seo?.twitter_card || "summary_large_image"} head-key="twitter:card" />
                {seo?.twitter_site && <meta name="twitter:site" content={seo.twitter_site} head-key="twitter:site" />}
                {seo?.twitter_creator && <meta name="twitter:creator" content={seo.twitter_creator} head-key="twitter:creator" />}
                <meta name="twitter:title" content={seo?.og_title || seo?.site_title} head-key="twitter:title" />
                <meta name="twitter:description" content={seo?.og_description || seo?.meta_description} head-key="twitter:description" />
                <meta name="twitter:image" content={ogImageUrl} head-key="twitter:image" />
                {seo?.og_image_alt && <meta name="twitter:image:alt" content={seo.og_image_alt} head-key="twitter:image:alt" />}

                {/* 6. Theme & PWA Meta Tags */}
                <meta name="theme-color" content="#800020" />
                <meta name="apple-mobile-web-app-title" content="Dancell" />
                <meta name="application-name" content="Dancell" />

                {/* 7. JSON-LD Structured Data Schema Markup */}
                {seo?.structured_data_json && (
                    <script type="application/ld+json">
                        {seo.structured_data_json}
                    </script>
                )}
            </Head>

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

                    {/* Interactive Branch Outlets & Network Section */}
                    <BranchNetwork branchSection={branchSection} branches={branches} />
                </main>

                {/* Contact & Footer Section */}
                <ContactFooter footer={footer} />
            </div>
        </ReactLenis>
    );
}

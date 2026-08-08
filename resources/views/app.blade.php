<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Favicon & PWA Icons -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

        {{-- ================================================================
             SERVER-SIDE SEO META TAGS (Required for WhatsApp, Facebook,
             Twitter, Telegram, Google bots that do NOT execute JavaScript)
             ================================================================ --}}
        @php
            $seo = $page['props']['seo'] ?? null;
            if ($seo) {
                // Normalize: could be an Eloquent model or an array
                $s = is_array($seo) ? (object) $seo : $seo;

                // Build absolute OG image URL
                $ogImg = $s->og_image ?? '/images/hero.webp';
                if (!str_starts_with($ogImg, 'http')) {
                    $ogImg = 'https://dancell-official.com' . (str_starts_with($ogImg, '/') ? '' : '/') . $ogImg;
                }

                // Extract clean Google verification token
                $googleToken = $s->google_site_verification ?? '';
                if ($googleToken && str_contains($googleToken, 'content="')) {
                    preg_match('/content="([^"]+)"/', $googleToken, $m);
                    $googleToken = $m[1] ?? $googleToken;
                }
            } else {
                $s = null;
                $ogImg = 'https://dancell-official.com/images/hero.webp';
                $googleToken = '';
            }
        @endphp

        @if($s)
            {{-- Core Meta --}}
            <meta name="description" content="{{ $s->meta_description ?? '' }}">
            <meta name="keywords" content="{{ $s->meta_keywords ?? '' }}">
            <meta name="author" content="{{ $s->author ?? 'Dancell Indonesia' }}">
            <meta name="robots" content="{{ $s->robots ?? 'index, follow' }}">
            @if(!empty($s->canonical_url))
                <link rel="canonical" href="{{ $s->canonical_url }}">
            @endif

            {{-- Open Graph (WhatsApp, Facebook, LINE, Telegram) --}}
            <meta property="og:site_name" content="{{ $s->site_name ?? 'Dancell Indonesia' }}">
            <meta property="og:title" content="{{ $s->og_title ?? $s->site_title ?? '' }}">
            <meta property="og:description" content="{{ $s->og_description ?? $s->meta_description ?? '' }}">
            <meta property="og:type" content="{{ $s->og_type ?? 'website' }}">
            <meta property="og:locale" content="{{ $s->locale ?? 'id_ID' }}">
            @if(!empty($s->canonical_url))
                <meta property="og:url" content="{{ $s->canonical_url }}">
            @endif
            <meta property="og:image" content="{{ $ogImg }}">
            <meta property="og:image:secure_url" content="{{ $ogImg }}">
            <meta property="og:image:width" content="1200">
            <meta property="og:image:height" content="630">
            @if(!empty($s->og_image_alt))
                <meta property="og:image:alt" content="{{ $s->og_image_alt }}">
            @endif

            {{-- Twitter / X Cards --}}
            <meta name="twitter:card" content="{{ $s->twitter_card ?? 'summary_large_image' }}">
            @if(!empty($s->twitter_site))
                <meta name="twitter:site" content="{{ $s->twitter_site }}">
            @endif
            @if(!empty($s->twitter_creator))
                <meta name="twitter:creator" content="{{ $s->twitter_creator }}">
            @endif
            <meta name="twitter:title" content="{{ $s->og_title ?? $s->site_title ?? '' }}">
            <meta name="twitter:description" content="{{ $s->og_description ?? $s->meta_description ?? '' }}">
            <meta name="twitter:image" content="{{ $ogImg }}">

            {{-- Geo Meta Tags --}}
            @if(!empty($s->geo_region))
                <meta name="geo.region" content="{{ $s->geo_region }}">
            @endif
            @if(!empty($s->geo_placename))
                <meta name="geo.placename" content="{{ $s->geo_placename }}">
            @endif
            @if(!empty($s->geo_position))
                <meta name="geo.position" content="{{ $s->geo_position }}">
                <meta name="ICBM" content="{{ str_replace(';', ', ', $s->geo_position) }}">
            @endif

            {{-- Search Engine Verifications --}}
            @if(!empty($googleToken))
                <meta name="google-site-verification" content="{{ $googleToken }}">
            @endif
            @if(!empty($s->bing_site_verification))
                <meta name="msvalidate.01" content="{{ $s->bing_site_verification }}">
            @endif

            {{-- JSON-LD Structured Data --}}
            @if(!empty($s->structured_data_json))
                <script type="application/ld+json">{!! $s->structured_data_json !!}</script>
            @endif
        @endif

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

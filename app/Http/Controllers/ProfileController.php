<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\SeoSetting;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile and SEO settings form.
     */
    public function edit(Request $request): Response
    {
        $seo = Cache::remember('seo_setting_content', 86400, function () {
            return SeoSetting::first();
        });

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'seo' => $seo,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'Informasi profil berhasil diperbarui!');
    }

    /**
     * Update Global Website SEO Settings & Upload OG Image File.
     */
    public function updateSeo(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_title' => 'required|string|max:255',
            'site_name' => 'required|string|max:255',
            'meta_description' => 'required|string',
            'meta_keywords' => 'required|string',
            'author' => 'required|string|max:255',
            'locale' => 'required|string|max:50',
            'canonical_url' => 'required|url',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'og_image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'og_image_alt' => 'nullable|string|max:255',
            'og_type' => 'required|string|max:100',
            'twitter_card' => 'required|string|max:100',
            'twitter_site' => 'nullable|string|max:100',
            'twitter_creator' => 'nullable|string|max:100',
            'robots' => 'required|string|max:255',
            'google_site_verification' => 'nullable|string|max:255',
            'bing_site_verification' => 'nullable|string|max:255',
            'yandex_site_verification' => 'nullable|string|max:255',
            'facebook_app_id' => 'nullable|string|max:255',
            'facebook_page_url' => 'nullable|url',
            'instagram_account_url' => 'nullable|url',
            'tiktok_profile_url' => 'nullable|url',
            'whatsapp_cs_url' => 'nullable|string',
            'geo_region' => 'nullable|string|max:100',
            'geo_placename' => 'nullable|string|max:100',
            'geo_position' => 'nullable|string|max:100',
            'structured_data_json' => 'nullable|string',
        ]);

        $seo = SeoSetting::firstOrCreate(['id' => 1]);

        if ($request->hasFile('og_image_file')) {
            $path = $request->file('og_image_file')->store('seo', 'public');
            $validated['og_image'] = '/storage/' . $path;
        }

        if (!empty($validated['google_site_verification']) && str_contains($validated['google_site_verification'], 'content=')) {
            if (preg_match('/content="([^"]+)"/', $validated['google_site_verification'], $matches)) {
                $validated['google_site_verification'] = $matches[1];
            }
        }

        $seo->update($validated);

        // Clear Redis Cache so Landing Page & Sitemap reflect updated SEO metadata instantly
        Cache::forget('seo_setting_content');
        Cache::forget('sitemap_xml');

        return Redirect::route('profile.edit')->with('status', 'Pengaturan SEO Global 100% & File Gambar OG Share Berhasil Diperbarui!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}

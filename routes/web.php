<?php

use App\Http\Controllers\Admin\FooterSettingController;
use App\Http\Controllers\Admin\HeroSettingController;
use App\Http\Controllers\Admin\HistoryTimelineSettingController;
use App\Http\Controllers\Admin\PartnerBrandSettingController;
use App\Http\Controllers\Admin\VisiMisiSettingController;
use App\Http\Controllers\ProfileController;
use App\Models\FooterSetting;
use App\Models\HeroSetting;
use App\Models\HistoryTimelineSetting;
use App\Models\PartnerBrandSetting;
use App\Models\VisiMisiSetting;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use Illuminate\Support\Facades\Cache;

Route::get('/', function () {
    $hero = Cache::remember('hero_setting_content', 86400, function () {
        return HeroSetting::first();
    });
    $visiMisi = Cache::remember('visi_misi_setting_content', 86400, function () {
        return VisiMisiSetting::first();
    });
    $historyTimeline = Cache::remember('history_timeline_setting_content', 86400, function () {
        return HistoryTimelineSetting::first();
    });
    $partnerBrand = Cache::remember('partner_brand_setting_content', 86400, function () {
        return PartnerBrandSetting::first();
    });
    $footer = Cache::remember('footer_setting_content', 86400, function () {
        return FooterSetting::first();
    });

    return Inertia::render('Welcome', [
        'hero' => $hero,
        'visiMisi' => $visiMisi,
        'historyTimeline' => $historyTimeline,
        'partnerBrand' => $partnerBrand,
        'footer' => $footer,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Content Management Routes
    Route::get('/admin/content/hero', [HeroSettingController::class, 'edit'])->name('admin.content.hero');
    Route::post('/admin/content/hero', [HeroSettingController::class, 'update'])->name('admin.content.hero.update');

    Route::get('/admin/content/visi-misi', [VisiMisiSettingController::class, 'edit'])->name('admin.content.visi-misi');
    Route::post('/admin/content/visi-misi', [VisiMisiSettingController::class, 'update'])->name('admin.content.visi-misi.update');

    Route::get('/admin/content/history', [HistoryTimelineSettingController::class, 'edit'])->name('admin.content.history');
    Route::post('/admin/content/history', [HistoryTimelineSettingController::class, 'update'])->name('admin.content.history.update');

    Route::get('/admin/content/mitra', [PartnerBrandSettingController::class, 'edit'])->name('admin.content.mitra');
    Route::post('/admin/content/mitra', [PartnerBrandSettingController::class, 'update'])->name('admin.content.mitra.update');

    Route::get('/admin/content/footer', [FooterSettingController::class, 'edit'])->name('admin.content.footer');
    Route::post('/admin/content/footer', [FooterSettingController::class, 'update'])->name('admin.content.footer.update');
});

Route::get('/admin', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

require __DIR__.'/auth.php';

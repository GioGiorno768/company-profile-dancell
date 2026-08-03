<?php

use App\Http\Controllers\Admin\BranchController;
use App\Http\Controllers\Admin\FooterSettingController;
use App\Http\Controllers\Admin\HeroSettingController;
use App\Http\Controllers\Admin\HistoryTimelineSettingController;
use App\Http\Controllers\Admin\PartnerBrandSettingController;
use App\Http\Controllers\Admin\VisiMisiSettingController;
use App\Http\Controllers\ProfileController;
use App\Models\Branch;
use App\Models\BranchSectionSetting;
use App\Models\FooterSetting;
use App\Models\HeroSetting;
use App\Models\HistoryTimelineSetting;
use App\Models\PartnerBrandSetting;
use App\Models\VisiMisiSetting;
use App\Models\SeoSetting;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use Illuminate\Support\Facades\Cache;

Route::get('/', function () {
    $seo = Cache::remember('seo_setting_content', 86400, function () {
        return SeoSetting::first();
    });
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
    $branchSection = Cache::remember('branch_section_setting_content', 86400, function () {
        return BranchSectionSetting::first();
    });
    $branches = Cache::remember('active_branches_list', 86400, function () {
        return Branch::where('is_active', true)->orderBy('order', 'asc')->get();
    });

    return Inertia::render('Welcome', [
        'seo'             => $seo,
        'hero'            => $hero,
        'visiMisi'        => $visiMisi,
        'historyTimeline' => $historyTimeline,
        'partnerBrand'    => $partnerBrand,
        'footer'          => $footer,
        'branchSection'   => $branchSection,
        'branches'        => $branches,
        'canLogin'        => Route::has('login'),
        'canRegister'     => Route::has('register'),
        'laravelVersion'  => Application::VERSION,
        'phpVersion'      => PHP_VERSION,
    ]);
});

Route::get('/cabang', [BranchController::class, 'publicIndex'])->name('branches.public');

Route::get('/dashboard', function () {
    $totalBranches = Cache::remember('total_branches_count', 86400, function () {
        return Branch::count();
    });
    $activeBranches = Cache::remember('active_branches_active_count', 86400, function () {
        return Branch::where('is_active', true)->count();
    });
    $citiesCount = Cache::remember('branches_cities_count', 86400, function () {
        return Branch::distinct('city')->count('city');
    });

    return Inertia::render('Dashboard', [
        'stats' => [
            'totalBranches' => $totalBranches ?: 56,
            'activeBranches' => $activeBranches ?: 54,
            'citiesCount' => $citiesCount ?: 8,
            'redisStatus' => 'Active & Fast',
        ]
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/seo', [ProfileController::class, 'updateSeo'])->name('profile.seo.update');
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

    // Admin Branch Management Routes
    Route::get('/admin/branches', [BranchController::class, 'index'])->name('admin.branches.index');
    Route::post('/admin/branches/section-header', [BranchController::class, 'updateSectionHeader'])->name('admin.branches.section-header.update');
    Route::get('/admin/branches/create', [BranchController::class, 'create'])->name('admin.branches.create');
    Route::post('/admin/branches', [BranchController::class, 'store'])->name('admin.branches.store');
    Route::get('/admin/branches/{id}/edit', [BranchController::class, 'edit'])->name('admin.branches.edit');
    Route::post('/admin/branches/{id}/update', [BranchController::class, 'update'])->name('admin.branches.update');
    Route::post('/admin/branches/{id}/toggle', [BranchController::class, 'toggleStatus'])->name('admin.branches.toggle');
    Route::delete('/admin/branches/{id}', [BranchController::class, 'destroy'])->name('admin.branches.destroy');
});

Route::get('/admin', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

require __DIR__.'/auth.php';

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\BranchSectionSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BranchController extends Controller
{
    /**
     * Clear branch cache whenever branches or section settings are updated.
     */
    protected function clearBranchCache(): void
    {
        Cache::forget('active_branches_list');
        Cache::forget('admin_branches_cities');
        Cache::forget('public_branches_cities');
        Cache::forget('branch_section_setting_content');
        Cache::forget('total_branches_count');
        Cache::forget('active_branches_active_count');
        Cache::forget('branches_cities_count');
        Cache::forget('sitemap_xml');
    }

    /**
     * Display public branches listing page with search, filters, and sticky hero section.
     */
    public function publicIndex(Request $request)
    {
        $query = Branch::where('is_active', true);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('area', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('city') && $request->city !== 'all') {
            $query->where('city', $request->city);
        }

        $branches = $query->orderBy('order', 'asc')->orderBy('id', 'desc')->get();

        $cities = Cache::remember('public_branches_cities', 86400, function () {
            return Branch::where('is_active', true)->select('city')->distinct()->pluck('city')->toArray();
        });

        $branchSection = Cache::remember('branch_section_setting_content', 86400, function () {
            return BranchSectionSetting::first();
        });

        $seo = Cache::remember('seo_setting_content', 86400, function () {
            return \App\Models\SeoSetting::first();
        });

        return Inertia::render('Branches/Index', [
            'branches' => $branches,
            'cities' => $cities,
            'branchSection' => $branchSection,
            'seo' => $seo,
            'filters' => [
                'search' => $request->search ?? '',
                'city' => $request->city ?? 'all',
            ]
        ]);
    }

    /**
     * Display a listing of branches with search, filters, and section header content settings.
     */
    public function index(Request $request)
    {
        $query = Branch::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('area', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('city') && $request->city !== 'all') {
            $query->where('city', $request->city);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $isActive = $request->status === 'active';
            $query->where('is_active', $isActive);
        }

        $branches = $query->orderBy('order', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        $cities = Cache::remember('admin_branches_cities', 86400, function () {
            return Branch::select('city')
                ->distinct()
                ->orderBy('city')
                ->pluck('city');
        });

        $branchSection = BranchSectionSetting::firstOrCreate([], [
            'header_badge'       => 'Jaringan Outlet Ritel',
            'header_title'       => '56 Cabang Ritel Tersebar di Jawa Timur',
            'header_description' => 'Temukan cabang Dancell terdekat di kota Anda dengan pelayanan terbaik dan garansi produk terpercaya.',
            'banner_title'       => 'Total 56 Cabang & Terus Bertambah',
            'banner_description' => 'Dancell berkomitmen menghadirkan outlet terdekat yang mudah dijangkau di seluruh kabupaten/kota Jawa Timur.',
            'cta_btn_text'       => 'Hubungi Manajemen Dancell',
            'cta_btn_link'       => '#contact',
        ]);

        return Inertia::render('Admin/Branch/Index', [
            'branches'      => $branches,
            'cities'        => $cities,
            'branchSection' => $branchSection,
            'filters'       => $request->only(['search', 'city', 'status']),
            'status'        => session('status') || session('success'),
        ]);
    }

    /**
     * Update section header and banner texts for the Landing Page Branch Section.
     */
    public function updateSectionHeader(Request $request)
    {
        $validated = $request->validate([
            'header_badge'       => 'required|string|max:255',
            'header_title'       => 'required|string|max:255',
            'header_description' => 'nullable|string',
            'banner_title'       => 'required|string|max:255',
            'banner_description' => 'nullable|string',
            'cta_btn_text'       => 'required|string|max:255',
            'cta_btn_link'       => 'required|string|max:255',
        ]);

        $section = BranchSectionSetting::firstOrCreate([]);
        $section->update($validated);

        $this->clearBranchCache();

        return back()->with('success', 'Teks Header & Banner Section Cabang berhasil diperbarui.');
    }

    /**
     * Show the form for creating a new branch.
     */
    public function create()
    {
        $cities = Cache::remember('admin_branches_cities', 86400, function () {
            return Branch::select('city')
                ->distinct()
                ->orderBy('city')
                ->pluck('city');
        });

        $nextOrder = Branch::max('order') + 1;

        return Inertia::render('Admin/Branch/Form', [
            'branch'    => null,
            'cities'    => $cities,
            'nextOrder' => $nextOrder,
        ]);
    }

    /**
     * Store a newly created branch in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'city'            => 'required|string|max:100',
            'area'            => 'nullable|string|max:100',
            'year'            => 'nullable|string|max:10',
            'is_hq'           => 'nullable|boolean',
            'address'         => 'required|string',
            'phone'           => 'nullable|string|max:50',
            'whatsapp'        => 'nullable|string|max:50',
            'google_maps_url' => 'nullable|string|max:500',
            'opening_hours'   => 'required|string|max:100',
            'image'           => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_active'       => 'nullable|boolean',
            'order'           => 'nullable|integer',
        ]);

        $slug = Str::slug($validated['name']);
        $baseSlug = $slug;
        $counter = 1;
        while (Branch::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('branches', 'public');
        }

        Branch::create([
            'name'            => $validated['name'],
            'slug'            => $slug,
            'city'            => $validated['city'],
            'area'            => $validated['area'] ?? $validated['city'],
            'year'            => $validated['year'] ?? date('Y'),
            'is_hq'           => $request->boolean('is_hq', false),
            'address'         => $validated['address'],
            'phone'           => $validated['phone'] ?? null,
            'whatsapp'        => $validated['whatsapp'] ?? null,
            'google_maps_url' => $validated['google_maps_url'] ?? null,
            'opening_hours'   => $validated['opening_hours'] ?? 'Buka Setiap Hari (08.00 - 21.00 WIB)',
            'image'           => $imagePath,
            'is_active'       => $request->boolean('is_active', true),
            'order'           => $validated['order'] ?? 0,
        ]);

        $this->clearBranchCache();

        return redirect()->route('admin.branches.index')->with('success', "Outlet cabang '{$validated['name']}' berhasil ditambahkan.");
    }

    /**
     * Show the form for editing the specified branch.
     */
    public function edit($id)
    {
        $branch = Branch::findOrFail($id);

        $cities = Cache::remember('admin_branches_cities', 86400, function () {
            return Branch::select('city')
                ->distinct()
                ->orderBy('city')
                ->pluck('city');
        });

        return Inertia::render('Admin/Branch/Form', [
            'branch' => $branch,
            'cities' => $cities,
        ]);
    }

    /**
     * Update the specified branch in storage.
     */
    public function update(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);

        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'city'            => 'required|string|max:100',
            'area'            => 'nullable|string|max:100',
            'year'            => 'nullable|string|max:10',
            'is_hq'           => 'nullable|boolean',
            'address'         => 'required|string',
            'phone'           => 'nullable|string|max:50',
            'whatsapp'        => 'nullable|string|max:50',
            'google_maps_url' => 'nullable|string|max:500',
            'opening_hours'   => 'required|string|max:100',
            'image'           => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_active'       => 'nullable|boolean',
            'order'           => 'nullable|integer',
        ]);

        if ($branch->name !== $validated['name']) {
            $slug = Str::slug($validated['name']);
            $baseSlug = $slug;
            $counter = 1;
            while (Branch::where('slug', $slug)->where('id', '!=', $branch->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $branch->slug = $slug;
        }

        if ($request->hasFile('image')) {
            if ($branch->image && Storage::disk('public')->exists($branch->image)) {
                Storage::disk('public')->delete($branch->image);
            }
            $branch->image = $request->file('image')->store('branches', 'public');
        }

        $branch->update([
            'name'            => $validated['name'],
            'city'            => $validated['city'],
            'area'            => $validated['area'] ?? $validated['city'],
            'year'            => $validated['year'] ?? $branch->year,
            'is_hq'           => $request->boolean('is_hq'),
            'address'         => $validated['address'],
            'phone'           => $validated['phone'] ?? null,
            'whatsapp'        => $validated['whatsapp'] ?? null,
            'google_maps_url' => $validated['google_maps_url'] ?? null,
            'opening_hours'   => $validated['opening_hours'] ?? 'Buka Setiap Hari (08.00 - 21.00 WIB)',
            'is_active'       => $request->boolean('is_active'),
            'order'           => $validated['order'] ?? 0,
        ]);

        $this->clearBranchCache();

        return redirect()->route('admin.branches.index')->with('success', "Data outlet cabang '{$branch->name}' berhasil diperbarui.");
    }

    /**
     * Toggle active status of a branch.
     */
    public function toggleStatus($id)
    {
        $branch = Branch::findOrFail($id);
        $branch->is_active = !$branch->is_active;
        $branch->save();

        $this->clearBranchCache();

        $statusText = $branch->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Cabang '{$branch->name}' berhasil {$statusText}.");
    }

    /**
     * Remove the specified branch from storage.
     */
    public function destroy($id)
    {
        $branch = Branch::findOrFail($id);
        $name = $branch->name;

        if ($branch->image && Storage::disk('public')->exists($branch->image)) {
            Storage::disk('public')->delete($branch->image);
        }

        $branch->delete();
        $this->clearBranchCache();

        return back()->with('success', "Cabang '{$name}' berhasil dihapus.");
    }
}

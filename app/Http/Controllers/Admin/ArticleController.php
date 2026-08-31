<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\ArticleSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles in admin panel.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search', '');
        $category = $request->query('category', 'all');

        $articlesQuery = Article::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('author_name', 'like', "%{$search}%")
                      ->orWhere('excerpt', 'like', "%{$search}%");
                });
            })
            ->when($category && $category !== 'all', function ($query) use ($category) {
                $query->where('category_slug', $category);
            })
            ->orderBy('is_featured', 'desc')
            ->orderBy('created_at', 'desc');

        $articles = $articlesQuery->paginate(10)->withQueryString();

        $stats = [
            'total' => Article::count(),
            'published' => Article::where('is_published', true)->count(),
            'featured_hero' => Article::where('is_featured', true)->count(),
            'total_views' => Article::sum('views'),
        ];

        $settings = Cache::remember('article_settings_content', 86400, function () {
            return ArticleSetting::first() ?? ArticleSetting::create([
                'badge_text' => 'Pusat Informasi & Edukasi Teknologi',
                'header_title' => 'Jelajahi Artikel & Wawasan Gadget',
                'header_subtitle' => 'Tips memilih smartphone, panduan garansi resmi, dan berita seputar jaringan toko Dancell.',
                'global_tags' => ['Garansi Resmi', 'iPhone vs Android', 'Laptop Kuliah', 'Battery Health', 'Tukar Tambah', 'Promo Jatim', 'Kamera Flagship', 'Service Center'],
            ]);
        });

        $categories = ArticleCategory::orderBy('order', 'asc')
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                    'order' => $c->order,
                    'count' => Article::where('category_slug', $c->slug)->count(),
                ];
            });

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
            'stats' => $stats,
            'settings' => $settings,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    /**
     * Show form for creating a new article.
     */
    public function create(): Response
    {
        $categories = ArticleCategory::orderBy('order', 'asc')->get();
        $settings = ArticleSetting::first();
        $suggestedTags = $settings->global_tags ?? [];

        return Inertia::render('Admin/Articles/Form', [
            'isEdit' => false,
            'article' => null,
            'categories' => $categories,
            'suggestedTags' => $suggestedTags,
        ]);
    }

    /**
     * Store a newly created article.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'excerpt' => 'required|string|max:1000',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'category_slug' => 'required|string|max:100',
            'tags' => 'nullable|array',
            'author_name' => 'required|string|max:100',
            'author_role' => 'nullable|string|max:100',
            'reading_time' => 'nullable|string|max:50',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,avif|max:4096',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $uploadDir = public_path('uploads/articles');
            if (!File::isDirectory($uploadDir)) {
                File::makeDirectory($uploadDir, 0755, true, true);
            }
            $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $file->move($uploadDir, $fileName);
            $imagePath = '/uploads/articles/' . $fileName;
        }

        $slug = Article::generateUniqueSlug($validated['title']);

        Article::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'subtitle' => $validated['subtitle'] ?? null,
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'image' => $imagePath ?? '/images/hero.webp',
            'category' => $validated['category'],
            'category_slug' => $validated['category_slug'],
            'tags' => $validated['tags'] ?? [],
            'author_name' => $validated['author_name'],
            'author_role' => $validated['author_role'] ?? 'Tim Editorial Dancell',
            'reading_time' => $validated['reading_time'] ?? '4 min read',
            'is_featured' => $validated['is_featured'] ?? false,
            'is_published' => $validated['is_published'] ?? true,
            'published_at' => now(),
            'views' => 0,
        ]);

        Cache::forget('public_articles_hub');
        Cache::forget('landing_articles_highlight');

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil diterbitkan!');
    }

    /**
     * Show form for editing an existing article.
     */
    public function edit(int $id): Response
    {
        $article = Article::findOrFail($id);
        $categories = ArticleCategory::orderBy('order', 'asc')->get();
        $settings = ArticleSetting::first();
        $suggestedTags = $settings->global_tags ?? [];

        return Inertia::render('Admin/Articles/Form', [
            'isEdit' => true,
            'article' => $article,
            'categories' => $categories,
            'suggestedTags' => $suggestedTags,
        ]);
    }

    /**
     * Update an existing article.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:500',
            'excerpt' => 'required|string|max:1000',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'category_slug' => 'required|string|max:100',
            'tags' => 'nullable|array',
            'author_name' => 'required|string|max:100',
            'author_role' => 'nullable|string|max:100',
            'reading_time' => 'nullable|string|max:50',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,avif|max:4096',
        ]);

        $imagePath = $article->image;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $uploadDir = public_path('uploads/articles');
            if (!File::isDirectory($uploadDir)) {
                File::makeDirectory($uploadDir, 0755, true, true);
            }
            $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $file->move($uploadDir, $fileName);
            $imagePath = '/uploads/articles/' . $fileName;
        }

        // Check if title changed to regenerate slug
        $slug = $article->slug;
        if ($article->title !== $validated['title']) {
            $slug = Article::generateUniqueSlug($validated['title'], $article->id);
        }

        $article->update([
            'title' => $validated['title'],
            'slug' => $slug,
            'subtitle' => $validated['subtitle'] ?? null,
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'image' => $imagePath,
            'category' => $validated['category'],
            'category_slug' => $validated['category_slug'],
            'tags' => $validated['tags'] ?? [],
            'author_name' => $validated['author_name'],
            'author_role' => $validated['author_role'] ?? 'Tim Editorial Dancell',
            'reading_time' => $validated['reading_time'] ?? '4 min read',
            'is_featured' => $validated['is_featured'] ?? false,
            'is_published' => $validated['is_published'] ?? true,
        ]);

        Cache::forget('public_articles_hub');
        Cache::forget('landing_articles_highlight');

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil diperbarui!');
    }

    /**
     * Quick toggle published / draft status.
     */
    public function toggleStatus(int $id): RedirectResponse
    {
        $article = Article::findOrFail($id);
        $article->update(['is_published' => !$article->is_published]);

        Cache::forget('public_articles_hub');
        Cache::forget('landing_articles_highlight');

        return back()->with('success', 'Status publikasi artikel berhasil diubah!');
    }

    /**
     * Quick toggle Featured in Hero slider spotlight.
     */
    public function toggleFeatured(int $id): RedirectResponse
    {
        $article = Article::findOrFail($id);
        $article->update(['is_featured' => !$article->is_featured]);

        Cache::forget('public_articles_hub');
        Cache::forget('landing_articles_highlight');

        return back()->with('success', 'Status sorotan Hero artikel berhasil diubah!');
    }

    /**
     * Update section header badge, title, subtitle, and global popular tags.
     */
    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'badge_text' => 'required|string|max:255',
            'header_title' => 'required|string|max:255',
            'header_subtitle' => 'nullable|string|max:1000',
            'global_tags' => 'required|array',
        ]);

        $setting = ArticleSetting::first() ?? new ArticleSetting();
        $setting->badge_text = $validated['badge_text'];
        $setting->header_title = $validated['header_title'];
        $setting->header_subtitle = $validated['header_subtitle'];
        $setting->global_tags = $validated['global_tags'];
        $setting->save();

        Cache::forget('article_settings_content');
        Cache::forget('public_articles_hub');

        return back()->with('success', 'Pengaturan Header & Topik Populer berhasil diperbarui!');
    }

    /**
     * Store new Article Category (CRUD Kategori).
     */
    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'order' => 'nullable|integer',
        ]);

        $slug = ArticleCategory::generateUniqueSlug($validated['name']);

        ArticleCategory::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'order' => $validated['order'] ?? (ArticleCategory::max('order') + 1),
        ]);

        Cache::forget('public_articles_hub');

        return back()->with('success', 'Kategori artikel baru berhasil ditambahkan!');
    }

    /**
     * Update Article Category (CRUD Kategori).
     */
    public function updateCategory(Request $request, int $id): RedirectResponse
    {
        $category = ArticleCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'order' => 'nullable|integer',
        ]);

        $slug = ArticleCategory::generateUniqueSlug($validated['name'], $category->id);

        // Also update existing articles matching old slug
        Article::where('category_slug', $category->slug)->update([
            'category' => $validated['name'],
            'category_slug' => $slug,
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => $slug,
            'order' => $validated['order'] ?? $category->order,
        ]);

        Cache::forget('public_articles_hub');

        return back()->with('success', 'Kategori artikel berhasil diperbarui!');
    }

    /**
     * Delete Article Category (CRUD Kategori).
     */
    public function destroyCategory(int $id): RedirectResponse
    {
        $category = ArticleCategory::findOrFail($id);
        
        $articlesCount = Article::where('category_slug', $category->slug)->count();
        if ($articlesCount > 0) {
            return back()->with('error', "Kategori tidak dapat dihapus karena masih digunakan oleh {$articlesCount} artikel!");
        }

        $category->delete();

        Cache::forget('public_articles_hub');

        return back()->with('success', 'Kategori artikel berhasil dihapus!');
    }

    /**
     * Delete an article.
     */
    public function destroy(int $id): RedirectResponse
    {
        $article = Article::findOrFail($id);
        $article->delete();

        Cache::forget('public_articles_hub');
        Cache::forget('landing_articles_highlight');

        return back()->with('success', 'Artikel berhasil dihapus!');
    }
}

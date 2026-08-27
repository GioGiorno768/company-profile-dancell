<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\ArticleSetting;
use App\Models\FooterSetting;
use App\Models\SeoSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    /**
     * Display the Articles Catalog Hub page.
     */
    public function index(Request $request, ?int $page = null): Response
    {
        $seo = Cache::remember('seo_setting_content', 86400, function () {
            return SeoSetting::first();
        });
        $footer = Cache::remember('footer_setting_content', 86400, function () {
            return FooterSetting::first();
        });
        $settings = Cache::remember('article_settings_content', 86400, function () {
            return ArticleSetting::first() ?? ArticleSetting::create([
                'badge_text' => 'Pusat Informasi & Edukasi Teknologi',
                'header_title' => 'Jelajahi Artikel & Wawasan Gadget',
                'header_subtitle' => 'Tips memilih smartphone, panduan garansi resmi, dan berita seputar jaringan toko Dancell.',
                'global_tags' => ['Garansi Resmi', 'iPhone vs Android', 'Laptop Kuliah', 'Battery Health', 'Tukar Tambah', 'Promo Jatim', 'Kamera Flagship', 'Service Center'],
            ]);
        });

        $articles = Article::where('is_published', true)
            ->orderBy('is_featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'slug' => $a->slug,
                    'subtitle' => $a->subtitle,
                    'excerpt' => $a->excerpt,
                    'content' => $a->content,
                    'image' => $a->image,
                    'category' => $a->category,
                    'category_slug' => $a->category_slug,
                    'tags' => $a->tags ?? [],
                    'author' => [
                        'name' => $a->author_name,
                        'role' => $a->author_role,
                        'avatar' => $a->author_avatar ?? '/images/dancell_logo.png',
                    ],
                    'published_at' => $a->published_at ? $a->published_at->translatedFormat('d F Y') : 'Baru saja',
                    'reading_time' => $a->reading_time,
                    'views' => $a->views,
                    'is_featured' => $a->is_featured,
                ];
            });

        $allCategories = ArticleCategory::orderBy('order', 'asc')
            ->get()
            ->map(function ($c) use ($articles) {
                return [
                    'slug' => $c->slug,
                    'name' => $c->name,
                    'count' => $articles->where('category_slug', $c->slug)->count(),
                ];
            })
            ->prepend([
                'slug' => 'semua',
                'name' => 'Semua Topik',
                'count' => $articles->count(),
            ])
            ->toArray();

        return Inertia::render('Articles/Index', [
            'seo' => $seo,
            'footer' => $footer,
            'settings' => $settings,
            'articles' => $articles,
            'categories' => $allCategories,
            'selectedCategory' => $request->query('kategori', 'semua'),
            'searchQuery' => $request->query('q', ''),
            'selectedPage' => (int) ($page ?? $request->query('page', 1)),
        ]);
    }

    /**
     * Display a single article detail page.
     */
    public function show(string $slug): Response
    {
        $articleModel = Article::where('slug', $slug)->firstOrFail();
        
        // Increment views counter
        $articleModel->increment('views');

        $article = [
            'id' => $articleModel->id,
            'title' => $articleModel->title,
            'slug' => $articleModel->slug,
            'subtitle' => $articleModel->subtitle,
            'excerpt' => $articleModel->excerpt,
            'content' => $articleModel->content,
            'image' => $articleModel->image,
            'category' => $articleModel->category,
            'category_slug' => $articleModel->category_slug,
            'tags' => $articleModel->tags ?? [],
            'author' => [
                'name' => $articleModel->author_name,
                'role' => $articleModel->author_role,
                'avatar' => $articleModel->author_avatar ?? '/images/dancell_logo.png',
            ],
            'published_at' => $articleModel->published_at ? $articleModel->published_at->translatedFormat('d F Y') : 'Baru saja',
            'reading_time' => $articleModel->reading_time,
            'views' => $articleModel->views,
            'is_featured' => $articleModel->is_featured,
        ];

        $relatedArticles = Article::where('is_published', true)
            ->where('id', '!=', $articleModel->id)
            ->where('category_slug', $articleModel->category_slug)
            ->take(3)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'slug' => $a->slug,
                    'category' => $a->category,
                    'published_at' => $a->published_at ? $a->published_at->translatedFormat('d F Y') : '',
                    'reading_time' => $a->reading_time,
                ];
            });

        // Fallback if not enough related in same category
        if ($relatedArticles->count() < 3) {
            $moreArticles = Article::where('is_published', true)
                ->where('id', '!=', $articleModel->id)
                ->whereNotIn('id', $relatedArticles->pluck('id'))
                ->take(3 - $relatedArticles->count())
                ->get()
                ->map(function ($a) {
                    return [
                        'id' => $a->id,
                        'title' => $a->title,
                        'slug' => $a->slug,
                        'category' => $a->category,
                        'published_at' => $a->published_at ? $a->published_at->translatedFormat('d F Y') : '',
                        'reading_time' => $a->reading_time,
                    ];
                });
            $relatedArticles = $relatedArticles->concat($moreArticles);
        }

        $popularArticles = Article::where('is_published', true)
            ->where('id', '!=', $articleModel->id)
            ->orderBy('views', 'desc')
            ->take(7)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'slug' => $a->slug,
                    'category' => $a->category,
                    'published_at' => $a->published_at ? $a->published_at->translatedFormat('d F Y') : '',
                    'views' => $a->views,
                ];
            });

        $latestArticles = Article::where('is_published', true)
            ->where('id', '!=', $articleModel->id)
            ->orderBy('published_at', 'desc')
            ->take(7)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'slug' => $a->slug,
                    'image' => $a->image,
                    'category' => $a->category,
                    'published_at' => $a->published_at ? $a->published_at->translatedFormat('d F Y') : '',
                ];
            });

        $seo = Cache::remember('seo_setting_content', 86400, function () {
            return SeoSetting::first();
        });
        $footer = Cache::remember('footer_setting_content', 86400, function () {
            return FooterSetting::first();
        });
        $settings = Cache::remember('article_settings_content', 86400, function () {
            return ArticleSetting::first();
        });

        return Inertia::render('Articles/Show', [
            'seo' => $seo,
            'footer' => $footer,
            'settings' => $settings,
            'article' => $article,
            'relatedArticles' => $relatedArticles,
            'popularArticles' => $popularArticles,
            'latestArticles' => $latestArticles,
        ]);
    }

    /**
     * Helper for landing page
     */
    public static function getLandingArticles()
    {
        return Article::where('is_published', true)
            ->orderBy('is_featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->take(6)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'slug' => $a->slug,
                    'excerpt' => $a->excerpt,
                    'image' => $a->image,
                    'category' => $a->category,
                    'published_at' => $a->published_at ? $a->published_at->translatedFormat('d F Y') : '',
                    'reading_time' => $a->reading_time,
                ];
            })
            ->toArray();
    }
}

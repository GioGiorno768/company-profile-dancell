<?php

namespace Database\Seeders;

use App\Models\ArticleCategory;
use Illuminate\Database\Seeder;

class ArticleCategorySeeder extends Seeder
{
    public function run(): void
    {
        $defaultCategories = [
            ['id' => 1, 'name' => 'Review Gadget', 'slug' => 'review-gadget', 'order' => 1],
            ['id' => 2, 'name' => 'Tips & Trik', 'slug' => 'tips-trik', 'order' => 2],
            ['id' => 3, 'name' => 'Promo & Event', 'slug' => 'promo-event', 'order' => 3],
            ['id' => 4, 'name' => 'Berita Dancell', 'slug' => 'berita-dancell', 'order' => 4],
        ];

        foreach ($defaultCategories as $cat) {
            ArticleCategory::updateOrCreate(['id' => $cat['id']], $cat);
        }
    }
}

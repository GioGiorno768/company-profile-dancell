<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('subtitle')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('image')->nullable();
            $table->string('category')->default('Review Gadget');
            $table->string('category_slug')->default('review-gadget');
            $table->json('tags')->nullable();
            $table->string('author_name')->default('Dimas Prasetyo');
            $table->string('author_role')->default('Hardware & Laptop Reviewer');
            $table->string('author_avatar')->nullable();
            $table->string('reading_time')->default('4 min read');
            $table->unsignedBigInteger('views')->default(0);
            $table->boolean('is_featured')->default(false); // Shown in Hero Carousel
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};

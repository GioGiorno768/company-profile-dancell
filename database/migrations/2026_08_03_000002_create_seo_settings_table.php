<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seo_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_title')->default('Dancell — Jaringan Outlet Ritel Gadget & Smartphone Terbesar Jawa Timur');
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('author')->default('Dancell Indonesia');
            $table->string('canonical_url')->default('https://dancell-official.com');
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('og_type')->default('website');
            $table->string('twitter_card')->default('summary_large_image');
            $table->string('twitter_site')->default('@dancell_official');
            $table->string('robots')->default('index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
            $table->string('google_site_verification')->nullable();
            $table->text('structured_data_json')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seo_settings');
    }
};

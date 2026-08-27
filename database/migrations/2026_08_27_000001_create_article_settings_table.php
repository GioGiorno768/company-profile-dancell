<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('article_settings', function (Blueprint $table) {
            $table->id();
            $table->string('badge_text')->default('Pusat Informasi & Edukasi Teknologi');
            $table->string('header_title')->default('Jelajahi Artikel & Wawasan Gadget');
            $table->text('header_subtitle')->nullable();
            $table->json('global_tags')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_settings');
    }
};

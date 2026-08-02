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
        Schema::create('visi_misi_settings', function (Blueprint $table) {
            $table->id();
            
            // Header Section
            $table->text('header_badge')->nullable();
            $table->text('header_title')->nullable();
            $table->text('header_description')->nullable();

            // Visi Spotlight Card
            $table->text('visi_badge')->nullable();
            $table->text('visi_badge_icon_svg')->nullable();
            $table->text('visi_title')->nullable();

            // 3 Visi Pillars / Highlights
            $table->text('visi_pillar_1_text')->nullable();
            $table->text('visi_pillar_1_icon_svg')->nullable();
            $table->text('visi_pillar_2_text')->nullable();
            $table->text('visi_pillar_2_icon_svg')->nullable();
            $table->text('visi_pillar_3_text')->nullable();
            $table->text('visi_pillar_3_icon_svg')->nullable();

            // Dynamic Misi Cards List (JSON)
            $table->json('misi_items')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visi_misi_settings');
    }
};

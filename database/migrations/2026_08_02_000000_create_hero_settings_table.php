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
        Schema::create('hero_settings', function (Blueprint $table) {
            $table->id();
            
            // Top Badge Bar
            $table->string('badge_text')->nullable();
            $table->text('badge_icon_svg')->nullable();

            // Main Headings & Copy
            $table->text('title')->nullable();
            $table->text('description')->nullable();

            // Primary Button CTA
            $table->string('primary_btn_text')->nullable();
            $table->string('primary_btn_link')->nullable();
            $table->text('primary_btn_icon_svg')->nullable();

            // Secondary Button CTA
            $table->string('secondary_btn_text')->nullable();
            $table->string('secondary_btn_link')->nullable();
            $table->text('secondary_btn_icon_svg')->nullable();

            // 3 Bottom Feature Highlights
            $table->string('feature_1_text')->nullable();
            $table->text('feature_1_icon_svg')->nullable();

            $table->string('feature_2_text')->nullable();
            $table->text('feature_2_icon_svg')->nullable();

            $table->string('feature_3_text')->nullable();
            $table->text('feature_3_icon_svg')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_settings');
    }
};

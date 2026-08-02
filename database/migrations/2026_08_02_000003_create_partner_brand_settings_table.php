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
        Schema::create('partner_brand_settings', function (Blueprint $table) {
            $table->id();
            
            // Header Section
            $table->text('header_badge')->nullable();
            $table->text('header_title')->nullable();
            $table->text('header_description')->nullable();

            // 4 Key Stats Items
            $table->text('stat_1_val')->nullable();
            $table->text('stat_1_label')->nullable();
            $table->text('stat_2_val')->nullable();
            $table->text('stat_2_label')->nullable();
            $table->text('stat_3_val')->nullable();
            $table->text('stat_3_label')->nullable();
            $table->text('stat_4_val')->nullable();
            $table->text('stat_4_label')->nullable();

            // Brand Rows Lists (JSON)
            $table->json('smartphone_brands')->nullable();
            $table->json('accessory_brands')->nullable();

            // Footer Bar
            $table->text('footer_note')->nullable();
            $table->text('cta_btn_text')->nullable();
            $table->text('cta_btn_link')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_brand_settings');
    }
};

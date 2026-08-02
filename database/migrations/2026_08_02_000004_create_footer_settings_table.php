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
        Schema::create('footer_settings', function (Blueprint $table) {
            $table->id();
            
            // Brand Info
            $table->text('brand_name')->nullable();
            $table->text('brand_tag')->nullable();
            $table->text('brand_subtitle')->nullable();
            $table->text('brand_description')->nullable();
            $table->text('branch_badge_text')->nullable();

            // Office Info
            $table->text('office_title')->nullable();
            $table->text('office_address')->nullable();
            $table->text('office_hours')->nullable();
            $table->text('office_established')->nullable();

            // Value Box
            $table->text('value_box_title')->nullable();
            $table->text('value_box_heading')->nullable();
            $table->text('value_box_description')->nullable();

            // Copyright & Dynamic Links (JSON)
            $table->text('copyright_text')->nullable();
            $table->json('nav_links')->nullable();
            $table->json('bottom_links')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footer_settings');
    }
};

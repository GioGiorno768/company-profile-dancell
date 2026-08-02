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
        Schema::create('history_timeline_settings', function (Blueprint $table) {
            $table->id();
            
            // Header Section
            $table->text('header_badge')->nullable();
            $table->text('header_title')->nullable();
            $table->text('header_description')->nullable();

            // Branch Expansions List (JSON)
            $table->json('expansions')->nullable();

            // Milestones List (JSON)
            $table->json('milestones')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('history_timeline_settings');
    }
};

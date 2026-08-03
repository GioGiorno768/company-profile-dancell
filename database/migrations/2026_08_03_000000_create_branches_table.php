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
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('city');
            $table->string('area')->nullable();
            $table->string('year')->nullable();
            $table->boolean('is_hq')->default(false);
            $table->text('address');
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('google_maps_url')->nullable();
            $table->string('opening_hours')->default('Buka Setiap Hari (08.00 - 21.00 WIB)');
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};

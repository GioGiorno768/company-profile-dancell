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
        Schema::create('branch_section_settings', function (Blueprint $table) {
            $table->id();
            $table->string('header_badge')->default('Jaringan Outlet Ritel');
            $table->string('header_title')->default('56 Cabang Ritel Tersebar di Jawa Timur');
            $table->text('header_description')->nullable();
            $table->string('banner_title')->default('Total 56 Cabang & Terus Bertambah');
            $table->text('banner_description')->nullable();
            $table->string('cta_btn_text')->default('Lihat Selengkapnya');
            $table->string('cta_btn_link')->default('#branches');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branch_section_settings');
    }
};

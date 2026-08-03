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
        Schema::table('seo_settings', function (Blueprint $table) {
            $table->string('facebook_page_url')->default('https://facebook.com/dancell.official')->after('facebook_app_id');
            $table->string('instagram_account_url')->default('https://instagram.com/dancell_official')->after('facebook_page_url');
            $table->string('tiktok_profile_url')->default('https://tiktok.com/@dancell_official')->after('instagram_account_url');
            $table->string('whatsapp_cs_url')->default('https://wa.me/6281234567890')->after('tiktok_profile_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('seo_settings', function (Blueprint $table) {
            $table->dropColumn([
                'facebook_page_url',
                'instagram_account_url',
                'tiktok_profile_url',
                'whatsapp_cs_url',
            ]);
        });
    }
};

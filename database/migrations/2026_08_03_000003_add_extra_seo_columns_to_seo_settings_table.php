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
            $table->string('site_name')->default('Dancell Indonesia')->after('site_title');
            $table->string('locale')->default('id_ID')->after('author');
            $table->string('og_image_alt')->default('Dancell Indonesia — Outlet Ritel Gadget Terkemuka Jawa Timur')->after('og_image');
            $table->string('twitter_creator')->default('@dancell_official')->after('twitter_site');
            $table->string('bing_site_verification')->nullable()->after('google_site_verification');
            $table->string('yandex_site_verification')->nullable()->after('bing_site_verification');
            $table->string('facebook_app_id')->nullable()->after('yandex_site_verification');
            $table->string('geo_region')->default('ID-JI')->after('facebook_app_id');
            $table->string('geo_placename')->default('Nganjuk, Jawa Timur')->after('geo_region');
            $table->string('geo_position')->default('-7.604214;112.029845')->after('geo_placename');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('seo_settings', function (Blueprint $table) {
            $table->dropColumn([
                'site_name',
                'locale',
                'og_image_alt',
                'twitter_creator',
                'bing_site_verification',
                'yandex_site_verification',
                'facebook_app_id',
                'geo_region',
                'geo_placename',
                'geo_position',
            ]);
        });
    }
};

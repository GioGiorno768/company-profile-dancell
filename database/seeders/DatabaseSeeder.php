<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@dancell.id'],
            [
                'name' => 'Administrator Dancell',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $this->call([
            HeroSettingSeeder::class,
            VisiMisiSettingSeeder::class,
            HistoryTimelineSettingSeeder::class,
            PartnerBrandSettingSeeder::class,
            FooterSettingSeeder::class,
            BranchSeeder::class,
            BranchSectionSettingSeeder::class,
            SeoSettingSeeder::class,
        ]);
    }
}

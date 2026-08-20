<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DefaultSettingCurrencyRightSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributes = ['key' => 'is_currency_right'];

        if (Schema::hasColumn('settings', 'store_id')) {
            $attributes = ['store_id' => null] + $attributes;
        }

        Setting::firstOrCreate($attributes, ['value' => false]);
    }
}

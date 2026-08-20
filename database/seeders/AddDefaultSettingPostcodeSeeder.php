<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class AddDefaultSettingPostcodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::where('key', 'postcode')
            ->where('value', '395007')
            ->update(['value' => '130802']);

        $attributes = ['key' => 'postcode'];

        if (Schema::hasColumn('settings', 'store_id')) {
            $attributes = ['store_id' => null] + $attributes;
        }

        Setting::firstOrCreate($attributes, ['value' => '130802']);
    }
}

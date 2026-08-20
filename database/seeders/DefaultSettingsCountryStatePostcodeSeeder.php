<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DefaultSettingsCountryStatePostcodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedSetting('country', 'Ecuador', ['India', 'india']);
        $this->seedSetting('state', 'Manabi', ['Gujarat', 'gujarat']);
        $this->seedSetting('city', 'Manta', ['Surat', 'surat', 'Mumbai', 'mumbai']);
    }

    private function seedSetting(string $key, string $value, array $legacyValues): void
    {
        Setting::where('key', $key)
            ->whereIn('value', $legacyValues)
            ->update(['value' => $value]);

        $attributes = ['key' => $key];

        if (Schema::hasColumn('settings', 'store_id')) {
            $attributes = ['store_id' => null] + $attributes;
        }

        Setting::firstOrCreate($attributes, ['value' => $value]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

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

        Setting::firstOrCreate(
            ['store_id' => null, 'key' => 'postcode'],
            ['value' => '130802']
        );
    }
}

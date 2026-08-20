<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\State;
use Illuminate\Database\Seeder;

class DefaultCountriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = file_get_contents(storage_path('countries/countries.json'));
        $countries = json_decode($countries, true)['countries'];
        Country::upsert(
            $countries,
            ['id'],
            ['name', 'phone_code', 'short_code']
        );

        $states = file_get_contents(storage_path('countries/states.json'));
        $states = json_decode($states, true)['states'];
        State::upsert(
            $states,
            ['id'],
            ['name', 'country_id']
        );
    }
}

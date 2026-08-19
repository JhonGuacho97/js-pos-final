<?php

namespace Database\Seeders;

use App\Models\Language;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class DefaultLanguageTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissionExits = Permission::where('name', 'manage_language')->first();

        if (! $permissionExits) {
            Permission::create([
                'name' => 'manage_language',
                'display_name' => 'Manage Language',
            ]);
        }

        $adminRole = Role::whereName(Role::ADMIN)->first();

        if (empty($adminRole)) {
            $adminRole = Role::create([
                'name' => 'admin',
                'display_name' => ' Admin',
            ]);

        }
        $permission = Permission::where('name', 'manage_language')->pluck('name', 'id');
        $adminRole->givePermissionTo($permission);

        $languages = [
            'ar' => 'Arabic',
            'cn' => 'Chinese',
            'en' => 'English',
            'fr' => 'French',
            'gr' => 'German',
            'sp' => 'Spanish',
            'tr' => 'Turkish',
            'vi' => 'Vietnamese',
        ];

        foreach ($languages as $isoCode => $name) {
            Language::firstOrCreate(
                ['iso_code' => $isoCode],
                ['name' => $name]
            );
        }

        Language::query()->update(['is_default' => false]);
        Language::where('iso_code', 'sp')->update(['is_default' => true]);
    }
}

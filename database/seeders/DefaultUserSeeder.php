<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * El administrador inicial usa la marca EcuaPos y una contraseña
     * aleatoria que solo se muestra al crearlo. Las instalaciones antiguas
     * conservan su contraseña al migrar el correo del administrador.
     */
    public function run(): void
    {
        $email = 'admin@ecua-pos.com';
        $legacyEmail = 'admin@infy-pos.com';
        $password = null;

        $user = User::whereEmail($email)->first();

        // Conserva la contraseña y el historial de una instalación antigua,
        // pero migra la cuenta principal al nuevo correo.
        if (! $user) {
            $user = User::whereEmail($legacyEmail)->first();
            if ($user) {
                $user->update(['email' => $email]);
            }
        }

        if (! $user) {
            $password = Str::password(16);
            $user = User::create([
                'first_name' => 'admin',
                'email' => $email,
                'language' => 'sp',
                'password' => Hash::make($password),
            ]);
            $user->forceFill(['email_verified_at' => Carbon::now()])->save();
        }

        if (in_array($user->language, [null, '', 'en'], true)) {
            $user->update(['language' => 'sp']);
        }

        /** @var Role $adminRole */
        $adminRole = Role::whereName('admin')->first();
        if ($user && ! $user->hasRole($adminRole)) {
            $user->assignRole($adminRole);
        }

        // El administrador debe quedar asociado a la tienda inicial incluso
        // cuando el usuario ya existía antes de volver a ejecutar db:seed.
        $store = Store::first();
        if ($store) {
            $user->stores()->syncWithoutDetaching([$store->id]);
        }

        if ($password !== null && $this->command) {
            $this->command->warn("Usuario admin creado: {$email} / contraseña: {$password}");
            $this->command->warn('Guarde esta contraseña ahora -- no se volverá a mostrar. Cámbiela después del primer login.');
        }
    }
}

<?php

namespace Database\Seeders;

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
     * Antes esto creaba admin@infy-pos.com con la contraseña fija '123456'
     * -- una credencial pública del template que, combinada con el dump
     * database/pos.sql que el propio README indica importar en producción,
     * daba acceso admin completo a cualquiera que la conociera. Ahora se
     * genera una contraseña aleatoria y se imprime UNA sola vez en
     * consola al correr el seeder -- quien lo ejecuta debe capturarla ahí.
     */
    public function run(): void
    {
        $email = 'admin@infy-pos.com';

        if (User::whereEmail($email)->exists()) {
            return;
        }

        $password = Str::password(16);

        $input = [
            'first_name' => 'admin',
            'email' => $email,
            'email_verified_at' => Carbon::now(),
            'password' => Hash::make($password),
        ];
        $user = User::create($input);
        /** @var Role $adminRole */
        $adminRole = Role::whereName('admin')->first();
        if ($user) {
            $user->assignRole($adminRole);
        }

        if ($this->command) {
            $this->command->warn("Usuario admin creado: {$email} / contraseña: {$password}");
            $this->command->warn('Guarde esta contraseña ahora -- no se volverá a mostrar. Cámbiela después del primer login.');
        }
    }
}

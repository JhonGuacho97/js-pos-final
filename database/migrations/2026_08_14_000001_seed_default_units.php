<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;

/**
 * Ver database/seeders/DefaultUnitSeeder.php -- la tabla `units` nunca tuvo
 * un seeder, a diferencia de `base_units`
 * (2022_11_30_071556_add_base_units_seeder.php). Se corre como migración
 * (mismo patrón que esa) para que también backfillee instalaciones YA
 * EXISTENTES en el próximo `php artisan migrate`, no solo instalaciones
 * nuevas -- sin esto, una base de datos vieja seguiría sin poder importar
 * ni crear productos aunque se actualice el código.
 */
return new class extends Migration
{
    public function up(): void
    {
        Artisan::call('db:seed', ['--class' => 'DefaultUnitSeeder', '--force' => true]);
    }

    public function down(): void
    {
        //
    }
};

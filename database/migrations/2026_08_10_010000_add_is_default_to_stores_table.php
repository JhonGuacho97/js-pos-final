<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Store;

/**
 * "Tienda predeterminada" -- la que se auto-selecciona al iniciar
 * sesión cuando el usuario tiene 2+ tiendas y todavía no eligió/no
 * tiene guardada ninguna (ver storeAction.js::fetchMyStores()). Es un
 * singleton a nivel de aplicación (solo UNA tienda puede ser default a
 * la vez) -- se aplica a mano en StoreAPIController::update() (des-
 * marcando las demás en la misma transacción), no vía constraint de
 * BD, mismo criterio que is_active en el resto de este módulo.
 *
 * Backfill: la tienda más vieja (MIN(id), la primera que existió antes
 * de que se creara cualquier otra) queda como default -- es la única
 * con sentido sin que nadie haya elegido nada todavía.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->boolean('is_default')->default(false)->after('is_active');
        });

        $firstStoreId = Store::orderBy('id')->value('id');
        if ($firstStoreId !== null) {
            Store::whereKey($firstStoreId)->update(['is_default' => true]);
        }
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn('is_default');
        });
    }
};

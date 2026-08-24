<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // config/permission.php tiene 'teams' => true de forma permanente,
        // así que model_has_roles.store_id es NOT NULL (es parte de su
        // primary key compuesta). DefaultUserSeeder hace
        // $user->assignRole(...) más abajo, y Spatie inserta ahí el
        // team id "activo" en el momento -- sin fijarlo antes, queda NULL
        // y la inserción falla (probado en un fresh install: "Column
        // 'store_id' cannot be null"). La migración
        // 2026_08_10_000100_migrate_existing_data_to_initial_store ya
        // corrió antes que este seeder y garantiza que exista al menos
        // una Store, incluso en una base de datos nueva.
        $store = Store::first();
        if ($store) {
            setPermissionsTeamId($store->id);
        }

        // Algunos seeders historicos esperan que el rol admin ya exista.
        // Al final se sincroniza nuevamente para incluir todos los permisos.
        $this->call(DefaultPermissionsSeeder::class);
        $this->call(DefaultRoleSeeder::class);
        $this->call(DefaultLanguageTableSeeder::class);
        $this->call(AddDashboardAndSettingPermissionsSeeder::class);
        $this->call(AddPurchaseAndSalePermissionsSeeder::class);
        $this->call(AddPurchaseReturnAndSaleReturnPermissionsSeeder::class);
        $this->call(AddAdjustmentAndTransferPermissionsSeeder::class);
        $this->call(DefaultPermissionEmailReportQuotationSeeder::class);
        $this->call(AddSmsPermissionsSeeder::class);
        $this->call(AddElectronicInvoicesPermissionSeeder::class);
        $this->call(AddKardexPermissionSeeder::class);
        $this->call(AddSellerDashboardPermissionSeeder::class);
        $this->call(AddSriConfigPermissionSeeder::class);
        $this->call(AddCashControlPermissionSeeder::class);
        $this->call(AddCatalogOrdersPermissionSeeder::class);
        $this->call(AddInventoryCountPermissionsSeeder::class);

        $this->call(DefaultUserSeeder::class);
        $this->call(SettingTableSeeder::class);
        $this->call(DefaultSettingsCountryStatePostcodeSeeder::class);
        $this->call(AddDefaultSettingPostcodeSeeder::class);
        $this->call(DefaultSettingCurrencyRightSeeder::class);

        // Tambien repara instalaciones existentes: cualquier permiso que se
        // agregue antes de este punto queda sincronizado con el admin.
        $this->call(EnsureAllPermissionsSyncedSeeder::class);
    }
}

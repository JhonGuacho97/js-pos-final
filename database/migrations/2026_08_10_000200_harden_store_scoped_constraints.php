<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Segunda mitad de la Fase 2 -- corre DESPUÉS de
 * migrate_existing_data_to_initial_store (que ya dejó store_id poblado
 * en todas las filas existentes), así que ahora es seguro:
 *
 * 1. Volver store_id NOT NULL en las tablas B/C del documento de
 *    planificación (todas menos `settings`, que se queda nullable
 *    permanentemente -- ver su propia migración de Fase 1).
 * 2. Reemplazar los unique globales (name/email/identification) por
 *    uniques compuestos (store_id, ...) -- lo que permite que dos
 *    tiendas tengan cada una su propia categoría "Bebidas", su propio
 *    cliente con la misma cédula, etc. Ver notas dejadas en cada
 *    migración add_store_id_to_*_table.php de la Fase 1.
 * 3. Terminar de endurecer las tablas de Spatie para el modo teams:
 *    unique(store_id, name, guard_name) en roles (no existía ningún
 *    unique ahí antes, ver add_teams_support_to_permission_tables.php),
 *    y la primary key de model_has_roles/model_has_permissions pasa a
 *    incluir store_id, como espera Spatie en modo teams.
 */
return new class extends Migration
{
    public function up(): void
    {
        // 1. NOT NULL en las tablas store-level (catálogo + clientes/
        // proveedores) y warehouse-level (warehouses).
        foreach ([
            'warehouses', 'products', 'main_products', 'product_categories',
            'brands', 'variations', 'variation_types', 'customers',
            'suppliers', 'expense_categories',
        ] as $table) {
            $this->changeStoreIdNullability($table, false);
        }

        // 2. Uniques compuestos por tienda.
        Schema::table('product_categories', function (Blueprint $table) {
            $table->dropUnique('product_categories_name_unique');
            $table->unique(['store_id', 'name']);
        });

        Schema::table('brands', function (Blueprint $table) {
            $table->dropUnique('brands_name_unique');
            $table->unique(['store_id', 'name']);
        });

        Schema::table('variations', function (Blueprint $table) {
            $table->dropUnique('variations_name_unique');
            $table->unique(['store_id', 'name']);
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropUnique('customers_email_unique');
            $table->dropUnique('customers_identification_unique');
            $table->unique(['store_id', 'email']);
            $table->unique(['store_id', 'identification']);
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropUnique('suppliers_email_unique');
            $table->unique(['store_id', 'email']);
        });

        // 3. Spatie teams -- roles gana el unique compuesto que nunca
        // tuvo (name/guard_name solo no alcanza más: "Cajero" puede
        // existir una vez por tienda), y las tablas de asignación pasan
        // a tener store_id como parte de su primary key.
        Schema::table('roles', function (Blueprint $table) {
            $table->unique(['store_id', 'name', 'guard_name'], 'roles_store_name_guard_unique');
        });

        // MySQL no deja tocar la primary key mientras la FK de esta misma
        // tabla (permission_id/role_id) dependa de ella como único índice
        // que la soporta -- hay que soltar la FK primero y recrearla
        // después de que la nueva primary key ya exista.
        Schema::table('model_has_permissions', function (Blueprint $table) {
            $table->dropForeign('model_has_permissions_permission_id_foreign');
            $table->dropPrimary('model_has_permissions_permission_model_type_primary');
            $table->primary(
                ['store_id', 'permission_id', 'model_id', 'model_type'],
                'model_has_permissions_store_permission_model_type_primary'
            );
            $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade');
        });

        Schema::table('model_has_roles', function (Blueprint $table) {
            $table->dropForeign('model_has_roles_role_id_foreign');
            $table->dropPrimary('model_has_roles_role_model_type_primary');
            $table->primary(
                ['store_id', 'role_id', 'model_id', 'model_type'],
                'model_has_roles_store_role_model_type_primary'
            );
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('model_has_roles', function (Blueprint $table) {
            $table->dropForeign('model_has_roles_role_id_foreign');
            $table->dropPrimary('model_has_roles_store_role_model_type_primary');
            $table->primary(['role_id', 'model_id', 'model_type'], 'model_has_roles_role_model_type_primary');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });

        Schema::table('model_has_permissions', function (Blueprint $table) {
            $table->dropForeign('model_has_permissions_permission_id_foreign');
            $table->dropPrimary('model_has_permissions_store_permission_model_type_primary');
            $table->primary(['permission_id', 'model_id', 'model_type'], 'model_has_permissions_permission_model_type_primary');
            $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade');
        });

        Schema::table('roles', function (Blueprint $table) {
            $table->dropUnique('roles_store_name_guard_unique');
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropUnique(['store_id', 'email']);
            $table->unique('email', 'suppliers_email_unique');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->dropUnique(['store_id', 'identification']);
            $table->dropUnique(['store_id', 'email']);
            $table->unique('identification', 'customers_identification_unique');
            $table->unique('email', 'customers_email_unique');
        });

        Schema::table('variations', function (Blueprint $table) {
            $table->dropUnique(['store_id', 'name']);
            $table->unique('name', 'variations_name_unique');
        });

        Schema::table('brands', function (Blueprint $table) {
            $table->dropUnique(['store_id', 'name']);
            $table->unique('name', 'brands_name_unique');
        });

        Schema::table('product_categories', function (Blueprint $table) {
            $table->dropUnique(['store_id', 'name']);
            $table->unique('name', 'product_categories_name_unique');
        });

        foreach ([
            'warehouses', 'products', 'main_products', 'product_categories',
            'brands', 'variations', 'variation_types', 'customers',
            'suppliers', 'expense_categories',
        ] as $table) {
            $this->changeStoreIdNullability($table, true);
        }
    }

    /**
     * MySQL 8.4 no permite cambiar la nulabilidad de una columna mientras
     * participa en una clave foranea. Ejecutar DROP/MODIFY/ADD dentro del
     * mismo ALTER TABLE mantiene la operacion atomica y conserva exactamente
     * las reglas originales de la relacion con stores.
     */
    private function changeStoreIdNullability(string $table, bool $nullable): void
    {
        $originalForeignKey = $table.'_store_id_foreign';
        $hardenedForeignKey = $table.'_store_id_foreign_hardened';
        $foreignKeyToDrop = $nullable ? $hardenedForeignKey : $originalForeignKey;
        $foreignKeyToAdd = $nullable ? $originalForeignKey : $hardenedForeignKey;
        $nullability = $nullable ? 'NULL' : 'NOT NULL';

        DB::statement(sprintf(
            'ALTER TABLE `%s` '
            .'DROP FOREIGN KEY `%s`, '
            .'MODIFY `store_id` BIGINT UNSIGNED %s, '
            .'ADD CONSTRAINT `%s` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) '
            .'ON UPDATE CASCADE ON DELETE RESTRICT',
            $table,
            $foreignKeyToDrop,
            $nullability,
            $foreignKeyToAdd
        ));
    }
};

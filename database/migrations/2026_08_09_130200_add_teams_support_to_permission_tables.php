<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Activa el soporte nativo de "teams" de Spatie Laravel Permission,
 * usando store_id como team_foreign_key (ver config/permission.php).
 * Con esto, un mismo usuario puede tener roles DISTINTOS por tienda
 * (ej. admin en Store A, vendedor en Store B) sin construir un sistema
 * de autorización paralelo -- hasRole()/can() ya lo respetan solo con
 * llamar a setPermissionsTeamId() al resolver la tienda activa.
 *
 * Sigue el patrón oficial de retrofit de Spatie para instalaciones que
 * ya tenían roles/permisos creados sin teams:
 * - roles: gana store_id: el mismo nombre de rol ("Cajero") puede
 *   existir una vez POR tienda, cada uno con su propio set de permisos
 *   (unique pasa de (name, guard_name) a (store_id, name, guard_name)).
 * - model_has_roles / model_has_permissions: ganan store_id porque la
 *   ASIGNACIÓN de un rol a un usuario es lo que se vuelve por tienda.
 * - permissions y role_has_permissions NO se tocan: el catálogo de
 *   permisos (manage_sale, manage_purchase, etc.) sigue siendo global,
 *   y role_has_permissions ya queda scoped indirectamente vía role_id
 *   (que ahora pertenece a una sola tienda).
 *
 * A propósito NO se toca la primary key de model_has_roles/
 * model_has_permissions en esta migración (Spatie en modo teams la
 * define como (store_id, permission_id/role_id, model_id, model_type)),
 * ni se agrega el unique compuesto en `roles` -- store_id todavía es
 * nullable y sin backfillear acá (Fase 1 es solo esquema). Ambas cosas
 * se endurecen en la migración de Fase 2, después de asignar cada rol
 * existente a la Store inicial, para no intentar meter NULL en una
 * columna que pasaría a formar parte de una primary key.
 *
 * `roles(name, guard_name)` tampoco tenía unique constraint activo antes
 * de esta migración (viene comentado en la migración original de Spatie
 * de este proyecto, 2022_02_21_073634_create_permission_tables.php), así
 * que no hay nada que reemplazar ahí tampoco.
 */
return new class extends Migration
{
    public function up(): void
    {
        $teamForeignKey = config('permission.column_names.team_foreign_key', 'store_id');

        // Idempotente a propósito: config/permission.php ya tiene
        // 'teams' => true de forma permanente, así que en una instalación
        // NUEVA la propia migración de Spatie (2022_02_21_073634) lee ese
        // config en el momento de correr y crea estas columnas de una vez
        // -- esta migración de retrofit solo hace falta en instalaciones
        // VIEJAS que corrieron esa migración antes de activar teams. Sin
        // este chequeo, un fresh install fallaba acá con "Duplicate
        // column name 'store_id'".
        if (! Schema::hasColumn('roles', $teamForeignKey)) {
            Schema::table('roles', function (Blueprint $table) use ($teamForeignKey) {
                $table->unsignedBigInteger($teamForeignKey)->nullable()->after('id');
                $table->index($teamForeignKey, 'roles_store_id_index');
            });
        }

        if (! Schema::hasColumn('model_has_roles', $teamForeignKey)) {
            Schema::table('model_has_roles', function (Blueprint $table) use ($teamForeignKey) {
                $table->unsignedBigInteger($teamForeignKey)->nullable()->after('role_id');
                $table->index($teamForeignKey, 'model_has_roles_store_id_index');
            });
        }

        if (! Schema::hasColumn('model_has_permissions', $teamForeignKey)) {
            Schema::table('model_has_permissions', function (Blueprint $table) use ($teamForeignKey) {
                $table->unsignedBigInteger($teamForeignKey)->nullable()->after('permission_id');
                $table->index($teamForeignKey, 'model_has_permissions_store_id_index');
            });
        }
    }

    public function down(): void
    {
        $teamForeignKey = config('permission.column_names.team_foreign_key', 'store_id');

        Schema::table('model_has_permissions', function (Blueprint $table) use ($teamForeignKey) {
            $table->dropIndex('model_has_permissions_store_id_index');
            $table->dropColumn($teamForeignKey);
        });

        Schema::table('model_has_roles', function (Blueprint $table) use ($teamForeignKey) {
            $table->dropIndex('model_has_roles_store_id_index');
            $table->dropColumn($teamForeignKey);
        });

        Schema::table('roles', function (Blueprint $table) use ($teamForeignKey) {
            $table->dropIndex('roles_store_id_index');
            $table->dropColumn($teamForeignKey);
        });
    }
};

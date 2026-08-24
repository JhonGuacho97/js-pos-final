<?php

use App\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->date('payment_due_date')->nullable()->after('payment_status');
            $table->unsignedSmallInteger('payment_terms_days')->nullable()->after('payment_due_date');
            $table->text('collection_note')->nullable()->after('payment_terms_days');
            $table->index(['payment_status', 'payment_due_date'], 'sales_receivable_status_due_index');
            $table->index(['customer_id', 'payment_status', 'payment_due_date'], 'sales_customer_receivable_index');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->boolean('credit_enabled')->default(false)->after('es_consumidor_final');
            $table->decimal('credit_limit', 15, 2)->default(0)->after('credit_enabled');
            $table->unsignedSmallInteger('default_payment_terms_days')->default(0)->after('credit_limit');
        });

        // Las ventas históricas pendientes nacen con el vencimiento en su
        // fecha de emisión. Así aparecen inmediatamente en la cartera y no
        // quedan como registros sin clasificar.
        DB::table('sales')
            ->whereIn('payment_status', [2, 3])
            ->whereNull('payment_due_date')
            ->update([
                'payment_due_date' => DB::raw('date'),
                'payment_terms_days' => 0,
            ]);

        foreach ([
            'view_accounts_receivable' => 'Ver cuentas por cobrar',
            'collect_accounts_receivable' => 'Registrar cobros de cartera',
            'manage_accounts_receivable' => 'Gestionar condiciones de crédito',
        ] as $name => $displayName) {
            Permission::firstOrCreate(['name' => $name], ['display_name' => $displayName]);
        }

        if ($admin = Role::whereName(Role::ADMIN)->first()) {
            $admin->givePermissionTo([
                'view_accounts_receivable',
                'collect_accounts_receivable',
                'manage_accounts_receivable',
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['credit_enabled', 'credit_limit', 'default_payment_terms_days']);
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->dropIndex('sales_receivable_status_due_index');
            $table->dropIndex('sales_customer_receivable_index');
            $table->dropColumn(['payment_due_date', 'payment_terms_days', 'collection_note']);
        });
    }
};

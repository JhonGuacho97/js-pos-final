<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_registers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->string('name');
            $table->string('code', 40);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['store_id', 'code']);
            $table->index(['warehouse_id', 'is_active']);
        });

        Schema::table('pos_register', function (Blueprint $table) {
            $table->foreignId('cash_register_id')->nullable()->after('warehouse_id')
                ->constrained('cash_registers')->cascadeOnUpdate()->nullOnDelete();
            $table->index(['cash_register_id', 'closed_at']);
        });

        Schema::create('cash_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pos_register_id')->constrained('pos_register')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('cash_register_id')->nullable()->constrained('cash_registers')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('store_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->string('type', 40);
            $table->enum('direction', ['IN', 'OUT']);
            $table->decimal('amount', 15, 4);
            $table->decimal('balance_after', 15, 4);
            $table->string('reference', 100)->nullable();
            $table->text('description')->nullable();
            $table->nullableMorphs('source');
            $table->foreignId('reversed_movement_id')->nullable()->constrained('cash_movements')->restrictOnDelete();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['pos_register_id', 'created_at']);
            $table->index(['store_id', 'warehouse_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_movements');
        Schema::table('pos_register', function (Blueprint $table) {
            $table->dropForeign(['cash_register_id']);
            $table->dropIndex(['cash_register_id', 'closed_at']);
            $table->dropColumn('cash_register_id');
        });
        Schema::dropIfExists('cash_registers');
    }
};

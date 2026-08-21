<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('offline_customer_identities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained('stores')->cascadeOnDelete();
            $table->uuid('client_uuid');
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['store_id', 'client_uuid'], 'offline_customer_store_uuid_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offline_customer_identities');
    }
};

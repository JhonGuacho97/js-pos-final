<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collection_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained('sales')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type', 30);
            $table->text('note');
            $table->date('promised_payment_date')->nullable();
            $table->decimal('promised_amount', 15, 2)->nullable();
            $table->timestamp('contacted_at');
            $table->timestamps();

            $table->index(['sale_id', 'contacted_at'], 'collection_activity_sale_date_index');
            $table->index(['customer_id', 'promised_payment_date'], 'collection_activity_customer_promise_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collection_activities');
    }
};

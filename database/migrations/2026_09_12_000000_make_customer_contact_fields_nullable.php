<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
            $table->string('phone', 50)->nullable()->change();
        });
    }

    public function down(): void
    {
        DB::table('customers')
            ->whereNull('email')
            ->orderBy('id')
            ->eachById(function ($customer) {
                DB::table('customers')->where('id', $customer->id)->update([
                    'email' => "sin-correo-{$customer->id}@invalid.local",
                ]);
            });
        DB::table('customers')->whereNull('phone')->update(['phone' => 'N/A']);

        Schema::table('customers', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
            $table->string('phone')->nullable(false)->change();
        });
    }
};

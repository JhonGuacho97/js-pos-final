<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presentation_families', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id');
            $table->string('name');
            $table->string('slug');
            $table->boolean('is_active')->default(true);
            $table->integer('sort')->default(0);
            $table->timestamps();

            $table->foreign('store_id')->references('id')->on('stores')->cascadeOnDelete();
            $table->unique(['store_id', 'slug']);
        });

        Schema::create('presentation_types', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('presentation_family_id');
            $table->string('name');
            $table->string('slug');
            $table->decimal('default_equivalence', 15, 4)->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort')->default(0);
            $table->timestamps();

            $table->foreign('store_id')->references('id')->on('stores')->cascadeOnDelete();
            $table->foreign('presentation_family_id')->references('id')->on('presentation_families')->cascadeOnDelete();
            $table->unique(['presentation_family_id', 'slug']);
        });

        Schema::table('product_presentations', function (Blueprint $table) {
            // MySQL no permite cambiar la nulabilidad de una columna que
            // todavía participa en una FK (error 1832), por eso se retira
            // y se vuelve a crear explícitamente alrededor del change().
            $table->dropForeign(['variation_type_id']);
        });
        Schema::table('product_presentations', function (Blueprint $table) {
            $table->unsignedBigInteger('variation_type_id')->nullable()->change();
        });
        Schema::table('product_presentations', function (Blueprint $table) {
            $table->foreign('variation_type_id')->references('id')->on('variation_types')->nullOnDelete();
            $table->unsignedBigInteger('presentation_type_id')->nullable()->after('variation_type_id');
            $table->foreign('presentation_type_id')->references('id')->on('presentation_types')->nullOnDelete();
        });

        $defaults = [
            ['General', 'general', [['Unidad', 1], ['Paquete', null], ['Caja', null]]],
            ['Bebidas', 'bebidas', [['Unidad', 1], ['Six Pack', 6], ['Pack x12', 12], ['Caja x24', 24]]],
            ['Tabaco', 'tabaco', [['Cigarrillo', 1], ['Cajetilla', 20], ['Cartón', 200]]],
            ['Farmacia', 'farmacia', [['Unidad', 1], ['Blíster', null], ['Frasco', null], ['Caja', null]]],
            ['Ferretería', 'ferreteria', [['Unidad', 1], ['Paquete', null], ['Rollo', null], ['Caja', null]]],
        ];

        foreach (DB::table('stores')->pluck('id') as $storeId) {
            foreach ($defaults as $familySort => [$familyName, $familySlug, $types]) {
                $familyId = DB::table('presentation_families')->insertGetId([
                    'store_id' => $storeId,
                    'name' => $familyName,
                    'slug' => $familySlug,
                    'is_active' => true,
                    'sort' => $familySort,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                foreach ($types as $typeSort => [$typeName, $equivalence]) {
                    DB::table('presentation_types')->insert([
                        'store_id' => $storeId,
                        'presentation_family_id' => $familyId,
                        'name' => $typeName,
                        'slug' => Str::slug($typeName),
                        'default_equivalence' => $equivalence,
                        'is_active' => true,
                        'sort' => $typeSort,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Migra el catálogo ya utilizado sin recrear product_presentations:
        // sus IDs permanecen intactos y también todas las líneas históricas.
        $legacyGroups = DB::table('variations')->where('is_presentation', true)->get();
        foreach ($legacyGroups as $legacyGroup) {
            $familySlug = 'legacy-' . $legacyGroup->id;
            $familyId = DB::table('presentation_families')->insertGetId([
                'store_id' => $legacyGroup->store_id,
                'name' => $legacyGroup->name . ' (existentes)',
                'slug' => $familySlug,
                'is_active' => true,
                'sort' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach (DB::table('variation_types')->where('variation_id', $legacyGroup->id)->get() as $sort => $legacyType) {
                $typeId = DB::table('presentation_types')->insertGetId([
                    'store_id' => $legacyGroup->store_id,
                    'presentation_family_id' => $familyId,
                    'name' => $legacyType->name,
                    'slug' => Str::slug($legacyType->name) . '-' . $legacyType->id,
                    'default_equivalence' => null,
                    'is_active' => true,
                    'sort' => $sort,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('product_presentations')
                    ->where('variation_type_id', $legacyType->id)
                    ->update(['presentation_type_id' => $typeId]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('product_presentations', function (Blueprint $table) {
            $table->dropForeign(['presentation_type_id']);
            $table->dropColumn('presentation_type_id');
        });

        Schema::dropIfExists('presentation_types');
        Schema::dropIfExists('presentation_families');
    }
};

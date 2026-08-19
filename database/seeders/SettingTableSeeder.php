<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\Customer;
use App\Models\Language;
use App\Models\Setting;
use App\Models\Store;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class SettingTableSeeder extends Seeder
{
    /**
     * Crea la configuracion inicial de EcuaPos. Tambien reemplaza valores
     * heredados del template InfyPOS, sin pisar valores personalizados.
     */
    public function run(): void
    {
        $store = Store::first();
        if ($store && in_array($store->name, ['Mi Negocio', 'infy-pos', 'InfyPOS'], true)) {
            $store->name = 'EcuaPos';
            if (in_array($store->slug, ['mi-negocio', 'infy-pos', 'infypos'], true)
                && ! Store::where('slug', 'ecuapos')->where('id', '!=', $store->id)->exists()) {
                $store->slug = 'ecuapos';
            }
            $store->save();
        }

        $storeId = $store?->id;

        $legacyCustomer = Customer::where('store_id', $storeId)
            ->where('email', 'customer@infypos.com')
            ->first();
        $customer = Customer::where('store_id', $storeId)
            ->where('email', 'customer@ecua-pos.com')
            ->first();

        if (! $customer && $legacyCustomer) {
            $legacyCustomer->update([
                'name' => 'Consumidor final',
                'email' => 'customer@ecua-pos.com',
                'phone' => '0999999999',
                'country' => 'Ecuador',
                'city' => 'Manta',
                'address' => 'Manabi, Ecuador',
            ]);
            $customer = $legacyCustomer;
        }

        $customer ??= Customer::firstOrCreate(
            ['store_id' => $storeId, 'email' => 'customer@ecua-pos.com'],
            [
                'name' => 'Consumidor final',
                'phone' => '0999999999',
                'country' => 'Ecuador',
                'city' => 'Manta',
                'address' => 'Manabi, Ecuador',
            ]
        );

        $legacyWarehouse = Warehouse::where('email', 'warehouse1@infypos.com')->first();
        $warehouse = Warehouse::where('email', 'warehouse@ecua-pos.com')->first();

        if (! $warehouse && $legacyWarehouse) {
            $legacyWarehouse->update([
                'name' => 'Bodega principal',
                'phone' => '0999999999',
                'country' => 'Ecuador',
                'city' => 'Manta',
                'email' => 'warehouse@ecua-pos.com',
                'zip_code' => '130802',
                'store_id' => $storeId,
            ]);
            $warehouse = $legacyWarehouse;
        }

        $warehouse ??= Warehouse::firstOrCreate(
            ['email' => 'warehouse@ecua-pos.com'],
            [
                'name' => 'Bodega principal',
                'phone' => '0999999999',
                'country' => 'Ecuador',
                'city' => 'Manta',
                'zip_code' => '130802',
                'store_id' => $storeId,
            ]
        );

        $legacyCurrencyIds = Currency::where('code', 'INR')->pluck('id')->map(fn ($id) => (string) $id)->all();
        $currency = Currency::where('code', 'USD')->first();
        if (! $currency) {
            $currency = Currency::create([
                'name' => 'US Dollar',
                'code' => 'USD',
                'symbol' => '$',
            ]);
        } else {
            $currency->update(['name' => 'US Dollar', 'symbol' => '$']);
        }

        $this->seedSetting('currency', $currency->id, $legacyCurrencyIds);
        $this->seedSetting('email', 'support@ecua-pos.com', ['support@infypos.com']);
        $this->seedSetting('company_name', 'EcuaPos', ['infy-pos', 'InfyPOS', 'Infy Pos']);
        $this->seedSetting('phone', '0999999999', ['1234567890']);
        $this->seedSetting('developed', 'EcuaPosSoft', ['infyom', 'InfyOm']);
        $this->seedSetting(
            'footer',
            'Desarrollado por EcuaPosSoft. Todos los derechos reservados.',
            ['2022 Developed by Infy-pos All rights reserved - v1.1.0']
        );
        $spanish = Language::where('iso_code', 'sp')->firstOrFail();
        $legacyDefaultLanguageIds = Language::where('iso_code', 'ar')
            ->pluck('id')
            ->map(fn ($id) => (string) $id)
            ->all();
        $this->seedSetting('default_language', $spanish->id, $legacyDefaultLanguageIds);
        $this->seedSetting('default_customer', $customer->id, $legacyCustomer ? [(string) $legacyCustomer->id] : []);
        $this->seedSetting('default_warehouse', $warehouse->id, $legacyWarehouse ? [(string) $legacyWarehouse->id] : []);
        $this->seedSetting(
            'address',
            'Manabi, Ecuador',
            ['C-303, Atlanta Shopping Mall, Nr. Sudama Chowk, Mota Varachha, Surat, Gujarat, India.']
        );
        $this->seedSetting('logo', 'images/ecua-pos-logo.png', [
            'images/infycare-logo.png',
            'images/infyom.png',
        ]);

        $this->seedSetting('stripe_key', 'pu_test_yBzA1qI1PcfRBAVn1vJG2VuS00HcyhQX9LASERTFDDS');
        $this->seedSetting('stripe_secret', 'pu_test_yBzA1qI1PcfRBAVn1vJG2VuS00HcyhQX9LASERTFDDS');
        $this->seedSetting('sms_gateway', 1);
        $this->seedSetting('twillo_sid', 'asd');
        $this->seedSetting('twillo_token', 'asd');
        $this->seedSetting('twillo_from', 'asd');
        $this->seedSetting('smtp_host', 'mailtrap.io');
        $this->seedSetting('smtp_port', '2525');
        $this->seedSetting('smtp_username', 'test');
        $this->seedSetting('smtp_password', 'test');
        $this->seedSetting('smtp_Encryption', 'tls');
    }

    /**
     * Crea el fallback global y solo reemplaza valores legacy conocidos.
     */
    private function seedSetting(string $key, string|int|bool $value, array $legacyValues = []): void
    {
        $value = (string) $value;

        if ($legacyValues !== []) {
            Setting::where('key', $key)
                ->whereIn('value', array_map('strval', $legacyValues))
                ->update(['value' => $value]);
        }

        Setting::firstOrCreate(
            ['store_id' => null, 'key' => $key],
            ['value' => $value]
        );
    }
}

<?php

use App\Models\Currency;
use App\Models\ManageStock;
use App\Models\Setting;
use App\Models\Supplier;
use Illuminate\Support\Facades\File;

if (! function_exists('getPageSize')) {
    /**
     * @return mixed
     */
    function getPageSize($request)
    {
        return $request->input('page.size', 10);
    }
}

function getLogoUrl(): string
{
    static $appLogo;

    if (empty($appLogo)) {
        $appLogo = Setting::where('key', '=', 'logo')->first();
    }

    if (empty($appLogo) || empty($appLogo->logo)) {
        return '';
    }

    return asset($appLogo->logo);
    //return '/public/uploads/settings/1/Imagen-de-WhatsApp-2023-10-06-a-las-09.21.45_4c27850c.png';
}

if (! function_exists('getSettingValue')) {
    /**
     * @return mixed
     */
    function getSettingValue($keyName)
    {
        $key = 'setting'.'-'.$keyName;

        static $settingValues;

        if (isset($settingValues[$key])) {
            return $settingValues[$key];
        }

        /** @var Setting $setting */
        $setting = Setting::where('key', '=', $keyName)->first();
        $settingValues[$key] = $setting->value;

        return $setting->value;
    }
}

function canDelete(array $models, string $columnName, int $id): bool
{
    foreach ($models as $model) {
        $result = $model::where($columnName, $id)->exists();

        if ($result) {
            return true;
        }
    }

    return false;
}

function getCurrencyCode()
{
    $currencyId = Setting::where('key', '=', 'currency')->first()->value;

    return Currency::whereId($currencyId)->first()->symbol;
}

function getLoginUserLanguage(): string
{
    return \Illuminate\Support\Facades\Auth::user()->language;
}

if (! function_exists('manageStock')) {
    /**
     * @param $request
     * @return mixed
     */
    function manageStock($warehouseID, $productID, $qty = 0)
    {
        // Se usa desde varios repositorios en puntos que no siempre están
        // dentro de una transacción propia (ej. reversiones de stock).
        // DB::transaction() anida con savepoints si ya hay una transacción
        // abierta, y lockForUpdate() evita que dos llamadas concurrentes
        // (ej. dos reversiones al mismo tiempo) lean el mismo valor antes
        // de que ninguna haga commit.
        \Illuminate\Support\Facades\DB::transaction(function () use ($warehouseID, $productID, $qty) {
            $product = ManageStock::whereWarehouseId($warehouseID)
                ->whereProductId($productID)
                ->lockForUpdate()
                ->first();

            if ($product) {
                $totalQuantity = $product->quantity + $qty;

                if ($totalQuantity < 0) {
                    // Antes esto se fijaba a 0 en silencio -- ej. se
                    // elimina una transferencia después de que parte de
                    // ese stock ya se vendió desde la bodega destino:
                    // manageStock() intentaba restar más de lo que hay
                    // y lo clampeaba a 0 sin avisar, dejando el
                    // inventario mostrando "0" en vez de reflejar el
                    // déficit real (que ya se vendió más de lo que esta
                    // reversión puede devolver). Ahora se bloquea la
                    // operación para que quien la dispara se entere.
                    throw new \Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException(
                        "No se puede ajustar el stock del producto #{$productID} en la bodega #{$warehouseID}: ".
                        "quedaría en {$totalQuantity} (disponible {$product->quantity}, se intentó aplicar {$qty})."
                    );
                }
                $product->update([
                    'quantity' => $totalQuantity,
                ]);
            } else {
                if ($qty < 0) {
                    // Mismo criterio que arriba: no hay ninguna fila de
                    // stock todavía para este producto/bodega, y se
                    // intenta restar -- no hay "0 disponible - algo"
                    // válido, así que se bloquea en vez de crear la fila
                    // en 0 en silencio.
                    throw new \Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException(
                        "No se puede ajustar el stock del producto #{$productID} en la bodega #{$warehouseID}: ".
                        "no hay stock registrado ahí (se intentó restar {$qty})."
                    );
                }

                ManageStock::create([
                    'warehouse_id' => $warehouseID,
                    'product_id' => $productID,
                    'quantity' => $qty,
                ]);
            }
        });
    }
}

if (! function_exists('keyExist')) {
    function keyExist($key)
    {
        $exists = Setting::where('key', $key)->exists();

        return $exists;
    }
}

function getSupplierGrandTotalFilterIds($search)
{
    $supplierData = Supplier::with('purchases')->get();
    $ids = [];
    foreach ($supplierData as $key => $supplier) {
        $value = $supplier->purchases->sum('grand_total');
        if ($search != '') {
            if ($value == $search) {
                $ids[] = $supplier->id;
            }
        }
    }

    return $ids;
}

if (! function_exists('replaceArrayValue')) {
    function replaceArrayValue(&$array, $key, $replaceValue)
    {
        foreach ($array as $index => $value) {
            if (is_array($value)) {
                $array[$index] = replaceArrayValue($value, $key, $replaceValue);
            }
            if ($index == $key) {
                $array[$index] = $replaceValue;
            }
        }

        return $array;
    }
}

if (! function_exists('getLogo')) {
    function getLogo()
    {
        /** @var Setting $setting */
        $logoImage = Setting::where('key', '=', 'logo')->first()->value;

        $logo = '';
        if (File::exists(asset($logoImage))) {
            $logo = base64_encode(file_get_contents(asset($logoImage)));
        }

        return 'data:image/png;base64,'.$logo;
    }
}

if (! function_exists('currencyAlignment')) {
    function currencyAlignment($amount)
    {
        if (getSettingValue('is_currency_right') != 1) {
            return getCurrencyCode().' '.$amount;
        }

        return $amount.' '.getCurrencyCode();
    }
}

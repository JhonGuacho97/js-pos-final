<?php

namespace App\MediaLibrary;

use App\Models\Brand;
use App\Models\MainProduct;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Purchase;
use App\Models\PurchaseReturn;
use App\Models\Sale;
use App\Models\SaleReturn;
use App\Models\Setting;
use App\Models\User;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

/**
 * Class CustomPathGenerator
 */
class CustomPathGenerator implements PathGenerator
{
    public function getPath(Media $media): string
    {
        // Forward slash siempre -- este path alimenta tanto el guardado en
        // disco como getFullUrl() (URL pública). DIRECTORY_SEPARATOR aquí
        // rompe toda imagen de la app en Windows: "\" es válido como
        // separador de carpeta para el filesystem de Windows, pero no es
        // un separador de ruta válido en una URL.
        $path = '{PARENT_DIR}' . '/' . $media->id . '/';
        switch ($media->collection_name) {
            case Brand::PATH:
                return str_replace('{PARENT_DIR}', Brand::PATH, $path);
            case ProductCategory::PATH:
                return str_replace('{PARENT_DIR}', ProductCategory::PATH, $path);
            case Product::PATH:
                return str_replace('{PARENT_DIR}', Product::PATH, $path);
            case MainProduct::PATH:
                return str_replace('{PARENT_DIR}', MainProduct::PATH, $path);
            case Product::PRODUCT_BARCODE_PATH:
                return str_replace('{PARENT_DIR}', Product::PRODUCT_BARCODE_PATH, $path);
            case User::PATH:
                return str_replace('{PARENT_DIR}', User::PATH, $path);
            case Setting::PATH:
                return str_replace('{PARENT_DIR}', Setting::PATH, $path);
            case Purchase::PURCHASE_PDF:
                return str_replace('{PARENT_DIR}', Purchase::PURCHASE_PDF, $path);
            case Sale::SALE_PDF:
                return str_replace('{PARENT_DIR}', Sale::SALE_PDF, $path);
            case PurchaseReturn::PURCHASE_RETURN_PDF:
                return str_replace('{PARENT_DIR}', PurchaseReturn::PURCHASE_RETURN_PDF, $path);
            case SaleReturn::SALE_RETURN_PDF:
                return str_replace('{PARENT_DIR}', SaleReturn::SALE_RETURN_PDF, $path);
            case Sale::SALE_BARCODE_PATH:
                return str_replace('{PARENT_DIR}', Sale::SALE_BARCODE_PATH, $path);
            case 'default':
                return '';
        }
    }

    public function getPathForConversions(Media $media): string
    {
        return $this->getPath($media) . 'thumbnails/';
    }

    public function getPathForResponsiveImages(Media $media): string
    {
        return $this->getPath($media) . 'rs-images/';
    }
}

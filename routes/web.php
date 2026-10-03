<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogPageController;
use App\Http\Controllers\API\PublicCatalogController;
use App\Http\Controllers\LandingPageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', LandingPageController::class)->name('landing');
Route::view('/sistema', 'welcome')->name('app');

Route::get('/catalogo/{store:slug}', CatalogPageController::class)->name('catalog.show');
Route::post('/catalogo/{store:slug}/pedidos', [PublicCatalogController::class, 'storeOrder'])
    ->middleware('throttle:15,1')->name('catalog.orders.store');

include 'upgrade.php';

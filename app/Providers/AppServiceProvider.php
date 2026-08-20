<?php

namespace App\Providers;

use App\Models\Customer;
use App\Observers\CustomerObserver;
use App\Models\SalesPayment;
use App\Observers\SalesPaymentObserver;
use App\Models\SaleReturn;
use App\Observers\SaleReturnObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Customer::observe(CustomerObserver::class);
        SalesPayment::observe(SalesPaymentObserver::class);
        SaleReturn::observe(SaleReturnObserver::class);
    }
}

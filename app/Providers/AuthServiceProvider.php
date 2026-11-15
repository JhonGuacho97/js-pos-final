<?php

namespace App\Providers;

use App\Models\PersonalAccessToken;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Sanctum\Sanctum;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Modelo propio: evita un UPDATE de last_used_at en cada petición.
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }
}

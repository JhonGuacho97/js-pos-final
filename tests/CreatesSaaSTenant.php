<?php

namespace Tests;

use App\Models\Organization;
use App\Models\OrganizationSubscription;
use App\Models\SaaSPlan;
use Illuminate\Support\Str;

trait CreatesSaaSTenant
{
    protected function subscribedOrganization(): Organization
    {
        $suffix = Str::lower(Str::random(12));
        $organization = Organization::create([
            'name' => 'Organización de pruebas '.$suffix,
            'slug' => 'test-'.$suffix,
            'is_active' => true,
        ]);
        $plan = SaaSPlan::firstOrCreate(['code' => 'integration-tests'], [
            'name' => 'Plan de pruebas', 'price' => 0, 'currency' => 'USD',
            'billing_interval' => 'monthly', 'billing_interval_count' => 1,
            'trial_days' => 0, 'grace_days' => 0, 'features' => ['*'], 'is_active' => true,
        ]);
        OrganizationSubscription::create([
            'organization_id' => $organization->id,
            'saas_plan_id' => $plan->id,
            'status' => OrganizationSubscription::STATUS_ACTIVE,
            'starts_at' => now(), 'current_period_starts_at' => now(),
            'current_period_ends_at' => now()->addMonth(),
        ]);

        return $organization;
    }
}

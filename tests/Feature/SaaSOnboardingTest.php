<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Store;
use App\Mail\OnboardingVerificationCodeMail;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SaaSOnboardingTest extends TestCase
{
    use DatabaseTransactions;

    public function test_saas_configuration_exposes_the_self_registration_switch(): void
    {
        $saasConfig = require config_path('saas.php');

        $this->assertArrayHasKey('self_registration_enabled', $saasConfig);
    }

    public function test_owner_can_create_a_complete_operational_tenant(): void
    {
        config(['saas.self_registration_enabled' => true]);
        $beforeOrganizations = Organization::count();
        $email = 'owner-'.Str::lower(Str::random(10)).'@example.test';
        $code = $this->requestCode($email);

        $response = $this->postJson('/api/onboarding/register', [
            'organization_name' => 'Café del Pacífico',
            'store_name' => 'Matriz Manta',
            'warehouse_name' => 'Bodega matriz',
            'first_name' => 'María',
            'last_name' => 'Zambrano',
            'email' => $email,
            'phone' => '0991234567',
            'city' => 'Manta',
            'province' => 'Manabí',
            'password' => 'ClaveSaaS123',
            'password_confirmation' => 'ClaveSaaS123',
            'terms' => true,
            'email_code' => $code,
        ])->assertCreated();

        $organizationId = (int) $response->json('data.organization.id');
        $storeId = (int) $response->json('data.store.id');
        $warehouseId = (int) $response->json('data.warehouse.id');
        $userId = (int) $response->json('data.user.id');

        $this->assertSame($beforeOrganizations + 1, Organization::count());
        $this->assertDatabaseHas('stores', [
            'id' => $storeId,
            'organization_id' => $organizationId,
            'is_default' => true,
        ]);
        $this->assertDatabaseHas('organization_user', [
            'organization_id' => $organizationId,
            'user_id' => $userId,
            'role' => 'OWNER',
            'status' => 'ACTIVE',
        ]);
        $this->assertDatabaseHas('user_store', ['user_id' => $userId, 'store_id' => $storeId]);
        $this->assertDatabaseHas('warehouses', ['id' => $warehouseId, 'store_id' => $storeId]);
        $this->assertDatabaseHas('cash_registers', [
            'store_id' => $storeId,
            'warehouse_id' => $warehouseId,
            'code' => 'CAJA-01',
        ]);
        $this->assertDatabaseHas('customers', [
            'store_id' => $storeId,
            'identification' => '9999999999999',
            'es_consumidor_final' => true,
        ]);
        $this->assertDatabaseHas('settings', [
            'store_id' => $storeId,
            'key' => 'company_name',
            'value' => 'Café del Pacífico',
        ]);
        $this->assertDatabaseHas('settings', [
            'store_id' => $storeId,
            'key' => 'logo',
            'value' => 'images/ecua-pos-logo.png',
        ]);
        $this->assertDatabaseHas('organization_subscriptions', [
            'organization_id' => $organizationId,
            'status' => 'TRIALING',
            'electronic_documents_used' => 0,
        ]);
        $this->assertSame('trial', $response->json('data.subscription.plan.code'));
        $this->assertSame(14, $response->json('data.subscription.days_remaining'));
        $this->assertSame(1, $response->json('data.subscription.limits.users'));
        $this->assertSame(10, $response->json('data.subscription.limits.electronic_documents'));

        setPermissionsTeamId($storeId);
        $role = Role::where('store_id', $storeId)->where('name', 'admin')->firstOrFail();
        $this->assertSame(Permission::where('guard_name', 'web')->count(), $role->permissions()->count());
        $this->assertTrue(User::findOrFail($userId)->hasRole($role));

        $this->postJson('/api/login', [
            'email' => $email,
            'password' => 'ClaveSaaS123',
            'language_code' => 'sp',
        ])->assertOk()->assertJsonPath('data.user.email', $email);

        Sanctum::actingAs(User::findOrFail($userId), ['*']);
        $this->withHeader('X-Store-Id', $storeId)->getJson('/api/config')->assertOk()
            ->assertJsonPath('data.can_manage_subscription', true);
    }

    public function test_duplicate_owner_email_does_not_create_partial_tenant(): void
    {
        config(['saas.self_registration_enabled' => true]);
        $existing = User::create([
            'first_name' => 'Usuario',
            'last_name' => 'Existente',
            'email' => 'existing-'.Str::lower(Str::random(10)).'@example.test',
            'phone' => '0999999999',
            'password' => bcrypt('ClaveSaaS123'),
            'language' => 'sp',
        ]);
        $beforeOrganizations = Organization::count();
        $beforeStores = Store::count();

        $this->postJson('/api/onboarding/register', [
            'organization_name' => 'No debe persistir',
            'first_name' => 'Cuenta',
            'last_name' => 'Duplicada',
            'email' => $existing->email,
            'phone' => '0991234567',
            'city' => 'Manta',
            'password' => 'ClaveSaaS123',
            'password_confirmation' => 'ClaveSaaS123',
            'terms' => true,
            'email_code' => '123456',
        ])->assertUnprocessable();

        $this->assertSame($beforeOrganizations, Organization::count());
        $this->assertSame($beforeStores, Store::count());
    }

    public function test_registration_requires_the_code_sent_to_the_email(): void
    {
        config(['saas.self_registration_enabled' => true]);
        $email = 'nocode-'.Str::lower(Str::random(10)).'@example.test';
        $before = Organization::count();

        // Sin código.
        $this->assertRejected($this->postJson('/api/onboarding/register', $this->payload($email)), 'Ingrese el código');

        // Con un código que nunca se pidió.
        $this->assertRejected($this->postJson('/api/onboarding/register', $this->payload($email, '123456')), 'no fue solicitado');

        $this->assertSame($before, Organization::count());
        $this->assertFalse(User::where('email', $email)->exists());
    }

    public function test_wrong_codes_are_limited_and_the_code_is_single_use(): void
    {
        config(['saas.self_registration_enabled' => true]);
        // Aquí se prueba el límite de intentos del código, no el de peticiones por IP.
        $this->withoutMiddleware(\Illuminate\Routing\Middleware\ThrottleRequests::class);
        $email = 'tries-'.Str::lower(Str::random(10)).'@example.test';
        $code = $this->requestCode($email);
        $wrong = $code === '000000' ? '111111' : '000000';

        for ($i = 0; $i < 5; $i++) {
            $this->assertRejected(
                $this->postJson('/api/onboarding/register', $this->payload($email, $wrong)),
                $i < 4 ? 'no es correcto' : 'Demasiados intentos'
            );
        }

        // Tras 5 fallos ni el código correcto sirve: hay que pedir otro.
        $this->assertRejected($this->postJson('/api/onboarding/register', $this->payload($email, $code)), 'Demasiados intentos');
        $this->assertFalse(User::where('email', $email)->exists());
    }

    public function test_send_code_rejects_existing_accounts_and_rapid_resends(): void
    {
        config(['saas.self_registration_enabled' => true]);
        Mail::fake();
        $existing = User::create([
            'first_name' => 'Usuario', 'last_name' => 'Existente',
            'email' => 'taken-'.Str::lower(Str::random(10)).'@example.test',
            'phone' => '0999999999', 'password' => bcrypt('ClaveSaaS123'), 'language' => 'sp',
        ]);

        $this->assertRejected($this->postJson('/api/onboarding/send-code', ['email' => $existing->email]), 'Ya existe una cuenta');

        $email = 'resend-'.Str::lower(Str::random(10)).'@example.test';
        $this->postJson('/api/onboarding/send-code', ['email' => $email])->assertOk();
        $this->assertRejected($this->postJson('/api/onboarding/send-code', ['email' => $email]), 'Ya enviamos un código');

        Mail::assertSent(OnboardingVerificationCodeMail::class, 1);
    }

    public function test_send_code_is_closed_when_registration_is_disabled(): void
    {
        config(['saas.self_registration_enabled' => false]);
        Mail::fake();

        $this->postJson('/api/onboarding/send-code', ['email' => 'closed@example.test'])->assertForbidden();
        Mail::assertNothingSent();
    }

    private function assertRejected($response, string $message): void
    {
        $response->assertUnprocessable();
        $this->assertStringContainsString($message, (string) $response->json('message'));
    }

    private function requestCode(string $email): string
    {
        Mail::fake();
        $this->postJson('/api/onboarding/send-code', ['email' => $email])->assertOk();

        $code = null;
        Mail::assertSent(OnboardingVerificationCodeMail::class, function ($mail) use ($email, &$code) {
            $code = $mail->code;

            return $mail->hasTo($email);
        });
        $this->assertMatchesRegularExpression('/^\d{6}$/', (string) $code);

        return $code;
    }

    private function payload(string $email, ?string $code = null): array
    {
        return array_filter([
            'organization_name' => 'Empresa '.Str::random(5),
            'first_name' => 'Ana',
            'last_name' => 'Prueba',
            'email' => $email,
            'phone' => '0991234567',
            'city' => 'Manta',
            'password' => 'ClaveSaaS123',
            'password_confirmation' => 'ClaveSaaS123',
            'terms' => true,
            'email_code' => $code,
        ], fn ($value) => $value !== null);
    }
}

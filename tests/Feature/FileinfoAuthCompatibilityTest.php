<?php

namespace Tests\Feature;

use App\MediaLibrary\Media;
use App\MediaLibrary\FileinfoCompatibleUrlGenerator;
use App\Models\Organization;
use App\Models\OrganizationSubscription;
use App\Models\Role;
use App\Models\SaaSPlan;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

/**
 * Real HTTP login/profile requests against the migrated SaaS schema
 * (organization + subscription + store), rolled back after each test.
 */
class FileinfoAuthCompatibilityTest extends TestCase
{
    use DatabaseTransactions;

    private string $email;

    private ?Store $store = null;

    protected function setUp(): void
    {
        parent::setUp();
        $this->email = 'operator-'.Str::lower(Str::random(10)).'@example.test';
        config([
            'filesystems.disks.public' => [
                'driver' => 'local', 'visibility' => 'public',
                'root' => public_path('images'), 'url' => 'https://pos.example.test/uploads',
            ],
        ]);
        setPermissionsTeamId(null);
    }

    public function test_login_with_existing_avatar_and_profile_keep_their_urls_and_permissions(): void
    {
        $user = $this->actor();
        $media = $this->attachExistingMedia($user);
        $url = "https://pos.example.test/uploads/user_image/{$media->id}/avatar.png";
        $response = $this->postJson('/api/login', $this->credentials())
            ->assertOk()->assertJsonPath('data.user.image_url', $url)
            ->assertJsonPath('data.user.media.0.original_url', $url)
            ->assertJsonPath('data.role_name', 'Test operator')
            ->assertJsonPath('data.permissions.0', 'manage_users');

        $this->assertArrayNotHasKey('password', $response->json('data.user'));
        $token = $response->json('data.token');
        $this->assertNotEmpty($token);
        $this->withToken($token)->withHeader('X-Store-Id', (string) $this->store->id)
            ->getJson('/api/edit-profile')
            ->assertOk()->assertJsonPath('data.attributes.image', $url)
            ->assertJsonPath('data.attributes.store_ids.0', $this->store->id);
        $this->withToken($token)->withHeader('X-Store-Id', (string) $this->store->id)
            ->postJson('/api/users/'.$user->id.'/change-password', [
                'password' => 'NotAuthorized123', 'password_confirmation' => 'NotAuthorized123',
            ])->assertForbidden();
        $this->assertSame(1, Media::where('model_type', User::class)->where('model_id', $user->id)->count());
        $this->assertTrue($user->fresh()->hasPermissionTo('manage_users'));
        $this->assertFalse($user->fresh()->hasPermissionTo('change_user_passwords'));
    }

    public function test_login_without_avatar_and_profile_return_an_empty_image(): void
    {
        $user = $this->actor();
        $response = $this->postJson('/api/login', $this->credentials())
            ->assertOk()->assertJsonPath('data.user.image_url', '');
        $this->withToken($response->json('data.token'))->withHeader('X-Store-Id', (string) $this->store->id)
            ->getJson('/api/edit-profile')
            ->assertOk()->assertJsonPath('data.attributes.image', '');
        $this->assertSame(0, Media::where('model_type', User::class)->where('model_id', $user->id)->count());
    }

    public function test_invalid_password_does_not_issue_a_token_and_profile_still_requires_authentication(): void
    {
        $user = $this->actor();
        $this->attachExistingMedia($user);
        $this->postJson('/api/login', array_merge($this->credentials(), ['password' => 'incorrect']))
            ->assertStatus(422);
        $this->getJson('/api/edit-profile')->assertUnauthorized();
        $this->assertSame(0, $user->tokens()->count());
        $this->assertDatabaseHas('login_logs', ['email' => $this->email, 'status' => 'failed']);
    }

    public function test_unsupported_avatar_storage_does_not_break_login_or_expose_a_url(): void
    {
        config([
            'media-library.url_generator' => NoFileinfoForAuthUrlGenerator::class,
            'filesystems.disks.public.visibility' => 'private',
        ]);
        Storage::shouldReceive('disk')->never();
        Log::shouldReceive('warning')->atLeast()->once();
        $user = $this->actor();
        $this->attachExistingMedia($user);
        $response = $this->postJson('/api/login', $this->credentials())
            ->assertOk()->assertJsonPath('data.user.image_url', '')
            ->assertJsonPath('data.user.media.0.original_url', '');
        $this->withToken($response->json('data.token'))->withHeader('X-Store-Id', (string) $this->store->id)
            ->getJson('/api/edit-profile')
            ->assertOk()->assertJsonPath('data.attributes.image', '');
        $this->assertSame(1, Media::where('model_type', User::class)->where('model_id', $user->id)->count());
    }

    private function credentials(): array
    {
        return ['email' => $this->email, 'password' => 'TestSecret123', 'language_code' => 'sp'];
    }

    private function actor(): User
    {
        $suffix = Str::lower(Str::random(8));
        $organization = Organization::create([
            'name' => "Fileinfo {$suffix}", 'slug' => "fileinfo-{$suffix}", 'is_active' => true,
        ]);
        $plan = SaaSPlan::create([
            'code' => "fileinfo-{$suffix}", 'name' => 'Fileinfo Test Plan', 'price' => 0,
            'currency' => 'USD', 'billing_interval' => 'monthly', 'billing_interval_count' => 1,
            'trial_days' => 0, 'grace_days' => 0, 'features' => ['*'], 'is_active' => true,
        ]);
        OrganizationSubscription::create([
            'organization_id' => $organization->id, 'saas_plan_id' => $plan->id,
            'status' => OrganizationSubscription::STATUS_ACTIVE, 'starts_at' => now(),
            'current_period_starts_at' => now(), 'current_period_ends_at' => now()->addMonth(),
            'auto_renew' => false,
        ]);
        $store = $this->store = Store::create([
            'organization_id' => $organization->id, 'name' => "Test {$suffix}",
            'slug' => "test-{$suffix}", 'is_active' => true, 'is_default' => true,
        ]);
        $user = User::create([
            'first_name' => 'Test', 'last_name' => 'Operator', 'email' => $this->email,
            'phone' => '0999999999', 'password' => Hash::make('TestSecret123'), 'status' => 1,
        ]);
        $organization->users()->attach($user->id, [
            'role' => Organization::ROLE_OWNER, 'status' => Organization::STATUS_ACTIVE,
        ]);
        $user->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        Permission::firstOrCreate(['name' => 'change_user_passwords', 'guard_name' => 'web']);
        $permission = Permission::firstOrCreate(['name' => 'manage_users', 'guard_name' => 'web']);
        $role = Role::create(['name' => 'test operator', 'guard_name' => 'web']);
        $role->givePermissionTo($permission);
        $user->assignRole($role);
        setPermissionsTeamId(null);
        return $user;
    }

    private function attachExistingMedia(User $user): Media
    {
        // Metadata only: reproduces an existing upload, without writing a file
        // or bypassing upload validation to manufacture test images.
        return Media::create([
            'model_type' => User::class, 'model_id' => $user->id,
            'collection_name' => User::PATH, 'name' => 'avatar', 'file_name' => 'avatar.png',
            'mime_type' => 'image/png', 'disk' => 'public', 'conversions_disk' => 'public',
            'size' => 100, 'manipulations' => [], 'custom_properties' => [],
            'generated_conversions' => [], 'responsive_images' => [], 'order_column' => 1,
        ]);
    }
}

class NoFileinfoForAuthUrlGenerator extends FileinfoCompatibleUrlGenerator
{
    protected function hasFileinfo(): bool { return false; }
}

<?php

namespace Tests\Feature;

use App\MediaLibrary\Media;
use App\MediaLibrary\FileinfoCompatibleUrlGenerator;
use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

/** Real HTTP login/profile requests; all records exist only in SQLite memory. */
class FileinfoAuthCompatibilityTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config([
            'database.default' => 'fileinfo_test',
            'database.connections.fileinfo_test' => [
                'driver' => 'sqlite', 'database' => ':memory:', 'prefix' => '', 'foreign_key_constraints' => false,
            ],
            'filesystems.disks.public' => [
                'driver' => 'local', 'visibility' => 'public',
                'root' => public_path('images'), 'url' => 'https://pos.example.test/uploads',
            ],
        ]);
        $this->assertSame(':memory:', DB::connection()->getDatabaseName());
        $this->createMemorySchema();
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
        $this->withToken($token)->getJson('/api/edit-profile')
            ->assertOk()->assertJsonPath('data.attributes.image', $url)
            ->assertJsonPath('data.attributes.store_ids.0', 1);
        $this->withToken($token)->postJson('/api/users/'.$user->id.'/change-password', [
            'password' => 'NotAuthorized123', 'password_confirmation' => 'NotAuthorized123',
        ])->assertForbidden();
        $this->assertDatabaseCount('media', 1);
        $this->assertTrue($user->fresh()->hasPermissionTo('manage_users'));
        $this->assertFalse($user->fresh()->hasPermissionTo('change_user_passwords'));
    }

    public function test_login_without_avatar_and_profile_return_an_empty_image(): void
    {
        $this->actor();
        $response = $this->postJson('/api/login', $this->credentials())
            ->assertOk()->assertJsonPath('data.user.image_url', '');
        $this->withToken($response->json('data.token'))->getJson('/api/edit-profile')
            ->assertOk()->assertJsonPath('data.attributes.image', '');
        $this->assertDatabaseCount('media', 0);
    }

    public function test_invalid_password_does_not_issue_a_token_and_profile_still_requires_authentication(): void
    {
        $this->attachExistingMedia($this->actor());
        $this->postJson('/api/login', array_merge($this->credentials(), ['password' => 'incorrect']))
            ->assertStatus(422);
        $this->getJson('/api/edit-profile')->assertUnauthorized();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->assertDatabaseHas('login_logs', ['status' => 'failed']);
    }

    public function test_unsupported_avatar_storage_does_not_break_login_or_expose_a_url(): void
    {
        config([
            'media-library.url_generator' => NoFileinfoForAuthUrlGenerator::class,
            'filesystems.disks.public.visibility' => 'private',
        ]);
        Storage::shouldReceive('disk')->never();
        Log::shouldReceive('warning')->atLeast()->once();
        $this->attachExistingMedia($this->actor());
        $response = $this->postJson('/api/login', $this->credentials())
            ->assertOk()->assertJsonPath('data.user.image_url', '')
            ->assertJsonPath('data.user.media.0.original_url', '');
        $this->withToken($response->json('data.token'))->getJson('/api/edit-profile')
            ->assertOk()->assertJsonPath('data.attributes.image', '');
        $this->assertDatabaseCount('media', 1);
    }

    private function credentials(): array
    {
        return ['email' => 'operator@example.test', 'password' => 'TestSecret123', 'language_code' => 'sp'];
    }

    private function actor(): User
    {
        $store = Store::create(['name' => 'Test', 'slug' => 'test', 'is_active' => true]);
        $user = User::create([
            'first_name' => 'Test', 'last_name' => 'Operator', 'email' => 'operator@example.test',
            'phone' => '0999999999', 'password' => Hash::make('TestSecret123'), 'status' => 1,
        ]);
        $user->stores()->attach($store->id);
        setPermissionsTeamId($store->id);
        Permission::create(['name' => 'change_user_passwords', 'guard_name' => 'web']);
        $permission = Permission::create(['name' => 'manage_users', 'guard_name' => 'web']);
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

    private function createMemorySchema(): void
    {
        Schema::create('users', function (Blueprint $t) {
            $t->id(); $t->string('first_name'); $t->string('last_name')->nullable();
            $t->string('email')->unique(); $t->string('password'); $t->string('phone')->nullable();
            $t->string('language')->default('sp'); $t->boolean('status')->default(true);
            $t->timestamp('email_verified_at')->nullable(); $t->rememberToken();
            $t->unsignedBigInteger('default_warehouse_id')->nullable(); $t->timestamps();
        });
        Schema::create('stores', function (Blueprint $t) {
            $t->id(); $t->string('name'); $t->string('slug'); $t->boolean('is_active');
            $t->boolean('is_default')->default(false); $t->timestamps();
        });
        Schema::create('user_store', function (Blueprint $t) {
            $t->unsignedBigInteger('user_id'); $t->unsignedBigInteger('store_id'); $t->timestamps();
        });
        Schema::create('media', function (Blueprint $t) {
            $t->id(); $t->morphs('model'); $t->uuid('uuid')->nullable();
            foreach (['collection_name', 'name', 'file_name', 'disk', 'conversions_disk'] as $field) $t->string($field);
            $t->string('mime_type')->nullable(); $t->unsignedBigInteger('size');
            foreach (['manipulations', 'custom_properties', 'generated_conversions', 'responsive_images'] as $field) $t->text($field);
            $t->unsignedInteger('order_column')->nullable(); $t->timestamps();
        });
        Schema::create('personal_access_tokens', function (Blueprint $t) {
            $t->id(); $t->morphs('tokenable'); $t->string('name'); $t->string('token', 64)->unique();
            $t->text('abilities')->nullable(); $t->timestamp('last_used_at')->nullable();
            $t->timestamp('expires_at')->nullable(); $t->timestamps();
        });
        Schema::create('login_logs', function (Blueprint $t) {
            $t->id(); $t->unsignedBigInteger('user_id')->nullable(); $t->string('email');
            $t->string('ip_address')->nullable(); $t->text('user_agent')->nullable();
            $t->string('status'); $t->timestamp('logged_at');
        });
        foreach (['roles', 'permissions'] as $table) {
            Schema::create($table, function (Blueprint $t) use ($table) {
                $t->id(); $t->string('name'); $t->string('guard_name'); $t->timestamps();
                if ($table === 'roles') $t->unsignedBigInteger('store_id')->nullable();
            });
        }
        foreach (['model_has_roles' => 'role_id', 'model_has_permissions' => 'permission_id'] as $table => $key) {
            Schema::create($table, function (Blueprint $t) use ($key) {
                $t->unsignedBigInteger($key); $t->string('model_type');
                $t->unsignedBigInteger('model_id'); $t->unsignedBigInteger('store_id')->nullable();
            });
        }
        Schema::create('role_has_permissions', function (Blueprint $t) {
            $t->unsignedBigInteger('role_id'); $t->unsignedBigInteger('permission_id');
        });
    }
}

class NoFileinfoForAuthUrlGenerator extends FileinfoCompatibleUrlGenerator
{
    protected function hasFileinfo(): bool { return false; }
}

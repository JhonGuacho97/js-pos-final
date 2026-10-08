<?php

namespace Tests\Unit;

use App\MediaLibrary\CustomPathGenerator;
use App\MediaLibrary\FileinfoCompatibleUrlGenerator;
use App\MediaLibrary\Media;
use App\Models\Brand;
use App\Models\MainProduct;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Spatie\MediaLibrary\Conversions\Conversion;
use Spatie\MediaLibrary\Support\UrlGenerator\DefaultUrlGenerator;
use Tests\TestCase;

class FileinfoMediaUrlTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['filesystems.disks.public' => [
            'driver' => 'local', 'visibility' => 'public',
            'root' => public_path('images'), 'url' => 'https://pos.example.test/uploads',
        ]]);
    }

    public function test_missing_fileinfo_builds_the_configured_public_url_without_storage(): void
    {
        Storage::shouldReceive('disk')->never();
        $this->assertSame('https://pos.example.test/uploads/user_image/42/avatar.png', $this->generator()->getUrl());
    }

    public function test_versioning_is_preserved(): void
    {
        config(['media-library.version_urls' => true]);
        $media = $this->media();
        $this->assertSame(
            'https://pos.example.test/uploads/user_image/42/avatar.png?v='.$media->updated_at->timestamp,
            $this->generator($media)->getUrl()
        );
    }

    public function test_conversion_uses_its_own_disk_and_configured_path(): void
    {
        config(['filesystems.disks.conversions' => [
            'driver' => 'local', 'visibility' => 'public',
            'root' => public_path('images'), 'url' => 'https://cdn.example.test/previews',
        ]]);
        $media = $this->media();
        $media->conversions_disk = 'conversions';
        $generator = $this->generator($media);
        $generator->setConversion(Conversion::create('thumb')->format('png'));
        $this->assertSame('https://cdn.example.test/previews/user_image/42/thumbnails/avatar-thumb.png', $generator->getUrl());
    }

    public function test_a_per_model_path_generator_is_respected(): void
    {
        config([
            'media-library.url_generator' => MissingFileinfoUrlGenerator::class,
            'media-library.custom_path_generators' => [User::class => AlternateMediaPath::class],
        ]);
        $this->assertSame('https://pos.example.test/uploads/accounts/42/avatar.png', $this->media()->getFullUrl());
    }

    /** @dataProvider unsafeDisks */
    public function test_unverified_storage_uses_an_empty_fallback_without_initializing_a_disk(array $changes): void
    {
        config(['media-library.url_generator' => MissingFileinfoUrlGenerator::class]);
        $disk = array_merge(config('filesystems.disks.public'), $changes);
        config(['filesystems.disks.public' => $disk]);
        Storage::shouldReceive('disk')->never();
        Log::shouldReceive('warning')->atLeast()->once();
        $this->assertSame('', $this->media()->getFullUrl());
        $this->assertSame('', $this->media()->toArray()['original_url']);
    }

    public static function unsafeDisks(): array
    {
        return [
            'private' => [['visibility' => 'private']],
            's3' => [['driver' => 's3']],
            'missing URL' => [['url' => null]],
            'unsafe scheme' => [['url' => 'javascript:alert(1)']],
            'credentials' => [['url' => 'https://user:secret@example.test/uploads']],
            'query string' => [['url' => 'https://example.test/uploads?key=secret']],
            'scoped prefix' => [['prefix' => 'private']],
            'nonexistent root' => [['root' => '/no-such-ecuapos-media-root']],
            'root outside public' => [['root' => __DIR__]],
        ];
    }

    /** @dataProvider invalidPaths */
    public function test_paths_that_cannot_be_safely_published_return_empty(string $filename): void
    {
        $media = $this->media();
        $media->file_name = $filename;
        Log::shouldReceive('warning')->once();
        $this->assertSame('', $this->generator($media)->getUrl());
    }

    public static function invalidPaths(): array
    {
        return [['../secret.png'], ['%2e%2e/secret.png'], ['bad\\file.png'], ['avatar.png?secret=1'], ["bad\0.png"]];
    }

    public function test_fileinfo_available_delegates_to_the_default_generator(): void
    {
        $disk = Mockery::mock(Filesystem::class);
        $disk->shouldReceive('url')->once()->with('user_image/42/avatar.png')->andReturn('https://normal.test/avatar.png');
        Storage::shouldReceive('disk')->once()->with('public')->andReturn($disk);
        $generator = new AvailableFileinfoUrlGenerator(app('config'));
        $generator->setMedia($this->media())->setPathGenerator(new CustomPathGenerator());
        $this->assertSame('https://normal.test/avatar.png', $generator->getUrl());
    }

    public function test_storage_exceptions_are_not_swallowed_when_fileinfo_is_available(): void
    {
        Storage::shouldReceive('disk')->once()->with('public')->andThrow(new \RuntimeException('Disk misconfigured'));
        $generator = new AvailableFileinfoUrlGenerator(app('config'));
        $generator->setMedia($this->media())->setPathGenerator(new CustomPathGenerator());
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Disk misconfigured');
        $generator->getUrl();
    }

    public function test_real_runtime_returns_the_same_url_as_spatie_when_fileinfo_is_loaded(): void
    {
        if (! extension_loaded('fileinfo')) $this->markTestSkipped('Fileinfo is genuinely disabled in this test process.');
        $generator = new DefaultUrlGenerator(app('config'));
        $generator->setMedia($this->media())->setPathGenerator(new CustomPathGenerator());
        $this->assertSame($generator->getUrl(), $this->media()->getUrl());
    }

    public function test_user_serialization_including_media_does_not_need_fileinfo(): void
    {
        config(['media-library.url_generator' => MissingFileinfoUrlGenerator::class]);
        Storage::shouldReceive('disk')->never();
        $user = new User(['first_name' => 'Prueba', 'password' => 'hidden']);
        $user->exists = true;
        $user->setRelation('media', new Collection([$this->media()]));
        $json = json_decode($user->toJson(), true, 512, JSON_THROW_ON_ERROR);
        $this->assertSame('https://pos.example.test/uploads/user_image/42/avatar.png', $json['image_url']);
        $this->assertSame($json['image_url'], $json['media'][0]['original_url']);
        $this->assertArrayNotHasKey('password', $json);
    }

    public function test_serialization_of_a_user_without_image_returns_empty(): void
    {
        $user = new User(['first_name' => 'Sin imagen']);
        $user->setRelation('media', new Collection());
        $this->assertSame('', json_decode($user->toJson(), true)['image_url']);
    }

    /** @dataProvider mediaModels */
    public function test_existing_product_brand_category_and_store_logos_share_the_compatibility_layer(string $modelClass, string $collection, string $attribute): void
    {
        config(['media-library.url_generator' => MissingFileinfoUrlGenerator::class]);
        Storage::shouldReceive('disk')->never();
        $model = new $modelClass();
        $model->exists = true;
        $media = $this->media();
        $media->collection_name = $collection;
        $media->model_type = $modelClass;
        $model->setRelation('media', new Collection([$media]));
        $value = $model->$attribute;
        $url = is_array($value) ? $value['imageUrls'][0] : $value;
        $this->assertSame("https://pos.example.test/uploads/{$collection}/42/avatar.png", $url);
    }

    public static function mediaModels(): array
    {
        return [
            [Product::class, Product::PATH, 'image_url'],
            [MainProduct::class, MainProduct::PATH, 'image_url'],
            [Brand::class, Brand::PATH, 'image_url'],
            [ProductCategory::class, ProductCategory::PATH, 'image_url'],
            [Setting::class, Setting::PATH, 'logo'],
        ];
    }

    private function media(): Media
    {
        return new Media([
            'id' => 42, 'model_type' => User::class, 'model_id' => 1,
            'collection_name' => User::PATH, 'disk' => 'public', 'conversions_disk' => 'public',
            'file_name' => 'avatar.png', 'updated_at' => '2026-10-08 12:00:00',
            'generated_conversions' => [], 'custom_properties' => [],
        ]);
    }

    private function generator(?Media $media = null): MissingFileinfoUrlGenerator
    {
        $generator = new MissingFileinfoUrlGenerator(app('config'));
        $generator->setMedia($media ?? $this->media())->setPathGenerator(new CustomPathGenerator());
        return $generator;
    }
}

class MissingFileinfoUrlGenerator extends FileinfoCompatibleUrlGenerator
{
    protected function hasFileinfo(): bool { return false; }
}

class AvailableFileinfoUrlGenerator extends FileinfoCompatibleUrlGenerator
{
    protected function hasFileinfo(): bool { return true; }
}

class AlternateMediaPath extends CustomPathGenerator
{
    public function getPath(\Spatie\MediaLibrary\MediaCollections\Models\Media $media): string
    {
        return 'accounts/'.$media->id.'/';
    }
}

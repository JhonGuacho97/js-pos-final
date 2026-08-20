<?php

namespace Tests\Unit;

use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserLanguageDefaultTest extends TestCase
{
    public function test_new_users_use_spanish_as_the_model_fallback(): void
    {
        $this->assertSame('sp', (new User())->language);
    }
}

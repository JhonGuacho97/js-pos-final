<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthEndpointTest extends TestCase
{
    /** @test */
    public function it_reports_server_connectivity_without_authentication(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertNoContent();
        $this->assertStringContainsString(
            'no-store',
            (string) $response->headers->get('Cache-Control')
        );
    }
}

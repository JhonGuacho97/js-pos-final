<?php

namespace Tests\Feature;

use Tests\TestCase;

class PublicRoutesHardeningTest extends TestCase
{
    public function test_no_hay_rutas_web_que_ejecuten_migraciones(): void
    {
        $this->get('/upgrade-to-v1-2-0')->assertNotFound();
        $this->get('/upgrade/database')->assertNotFound();
    }

    public function test_la_consulta_de_cedula_exige_sesion(): void
    {
        $this->getJson('/api/sri/lookup?identification=1317342465')->assertUnauthorized();
    }
}

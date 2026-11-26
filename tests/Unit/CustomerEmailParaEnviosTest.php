<?php

namespace Tests\Unit;

use App\Models\Customer;
use Tests\TestCase;

class CustomerEmailParaEnviosTest extends TestCase
{
    public function test_consumidor_final_nunca_recibe_correos(): void
    {
        $porBandera = new Customer(['name' => 'Cliente', 'email' => 'consumidorfinal@gmail.com', 'es_consumidor_final' => true]);
        $porNombre = new Customer(['name' => ' Consumidor Final ', 'email' => 'consumidorfinal@gmail.com']);
        $porIdentificacion = new Customer(['name' => 'X', 'identification' => '9999999999999', 'email' => 'x@example.com']);

        $this->assertNull($porBandera->emailParaEnvios());
        $this->assertNull($porNombre->emailParaEnvios());
        $this->assertNull($porIdentificacion->emailParaEnvios());
    }

    public function test_cliente_normal_recibe_su_correo_valido(): void
    {
        $cliente = new Customer(['name' => 'Maria', 'identification' => '1317342465', 'email' => ' maria@example.com ']);

        $this->assertSame('maria@example.com', $cliente->emailParaEnvios());
    }

    public function test_correo_vacio_o_invalido_no_se_usa(): void
    {
        $this->assertNull((new Customer(['name' => 'A', 'email' => null]))->emailParaEnvios());
        $this->assertNull((new Customer(['name' => 'B', 'email' => 'no-es-correo']))->emailParaEnvios());
    }
}

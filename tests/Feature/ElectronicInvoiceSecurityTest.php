<?php

namespace Tests\Feature;

use Tests\TestCase;

class ElectronicInvoiceSecurityTest extends TestCase
{
    public function test_ride_is_not_publicly_accessible(): void
    {
        $this->get('/api/electronic-invoices/1/ride')->assertUnauthorized();
    }

    public function test_xml_is_not_publicly_accessible(): void
    {
        $this->get('/api/electronic-invoices/1/xml')->assertUnauthorized();
    }
}

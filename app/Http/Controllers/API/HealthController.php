<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use Illuminate\Http\Response;

class HealthController extends AppBaseController
{
    public function __invoke(): Response
    {
        return response()->noContent()->withHeaders([
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
        ]);
    }
}

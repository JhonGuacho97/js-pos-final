<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\SaaS\CreateOrganizationRequest;
use App\Services\SaaS\OnboardingEmailVerification;
use App\Services\SaaS\OnboardingService;
use App\Services\SaaS\EntitlementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SaaSOnboardingController extends AppBaseController
{
    /**
     * Envía el código de verificación al correo del futuro propietario.
     * Se valida igual que en el registro (formato y que no exista ya una
     * cuenta) para no mandar códigos que después no servirían.
     */
    public function sendCode(Request $request, OnboardingEmailVerification $verification): JsonResponse
    {
        if (! config('saas.self_registration_enabled')) {
            return $this->sendError('El registro de nuevas organizaciones no está disponible.', 403);
        }

        $data = $request->validate([
            'email' => ['required', 'email:rfc', 'max:255', 'unique:users,email'],
            'website' => ['prohibited'],
        ], [
            'email.unique' => 'Ya existe una cuenta con este correo electrónico.',
        ]);

        $verification->send($data['email']);

        return response()->json([
            'success' => true,
            'message' => 'Te enviamos un código de 6 dígitos a tu correo.',
            'data' => [
                'expires_in_minutes' => OnboardingEmailVerification::TTL_MINUTES,
                'resend_in_seconds' => OnboardingEmailVerification::RESEND_SECONDS,
            ],
        ]);
    }

    public function store(
        CreateOrganizationRequest $request,
        OnboardingService $onboarding,
        EntitlementService $entitlements,
        OnboardingEmailVerification $verification
    ): JsonResponse {
        if (! config('saas.self_registration_enabled')) {
            return $this->sendError('El registro de nuevas organizaciones no está disponible.', 403);
        }

        $input = $request->validated();
        // Sin el código que llegó al correo no se crea nada.
        $verification->verify($input['email'], $input['email_code']);

        $result = $onboarding->create($input);
        $verification->consume($input['email']);

        return response()->json([
            'success' => true,
            'message' => 'Tu cuenta EcuaPos fue creada correctamente.',
            'data' => [
                'organization' => $result['organization']->only(['id', 'name', 'slug']),
                'store' => $result['store']->only(['id', 'name', 'slug']),
                'warehouse' => $result['warehouse']->only(['id', 'name']),
                'user' => $result['user']->only(['id', 'first_name', 'last_name', 'email']),
                'subscription' => $entitlements->summary($result['organization']->id),
            ],
        ], 201);
    }
}

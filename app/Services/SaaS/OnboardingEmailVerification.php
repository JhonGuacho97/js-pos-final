<?php

namespace App\Services\SaaS;

use App\Mail\OnboardingVerificationCodeMail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

/**
 * Código de 6 dígitos que confirma que quien registra una empresa es dueño
 * del correo. Sin él, cualquiera podía crear cuentas con correos ajenos o
 * inventados.
 *
 * El código vive en la caché (no en la base): dura 15 minutos, admite 5
 * intentos y se guarda como HMAC con la APP_KEY, nunca en claro. Un correo
 * solo puede pedir un código nuevo cada 60 segundos.
 */
class OnboardingEmailVerification
{
    public const TTL_MINUTES = 15;

    public const MAX_ATTEMPTS = 5;

    public const RESEND_SECONDS = 60;

    public function send(string $email): void
    {
        $email = $this->normalize($email);
        $cooldownKey = $this->key($email, 'cooldown');

        $availableAt = Cache::get($cooldownKey);
        if ($availableAt && $availableAt > now()->timestamp) {
            $wait = $availableAt - now()->timestamp;
            throw ValidationException::withMessages([
                'email' => "Ya enviamos un código a este correo. Puede pedir otro en {$wait} segundos.",
            ]);
        }

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(self::TTL_MINUTES);

        Cache::put($this->key($email, 'code'), [
            'hash' => $this->hash($email, $code),
            'attempts' => 0,
            'expires_at' => $expiresAt->timestamp,
        ], $expiresAt);
        Cache::put($cooldownKey, now()->addSeconds(self::RESEND_SECONDS)->timestamp, now()->addSeconds(self::RESEND_SECONDS));

        try {
            // Se envía en la misma petición (no en la cola): si el correo no
            // sale, la persona lo sabe de inmediato en vez de esperar un
            // código que nunca llega.
            Mail::to($email)->send(new OnboardingVerificationCodeMail($code, self::TTL_MINUTES));
        } catch (\Throwable $e) {
            Cache::forget($this->key($email, 'code'));
            Cache::forget($cooldownKey);
            Log::warning('No se pudo enviar el código de registro', ['error' => $e->getMessage()]);

            throw ValidationException::withMessages([
                'email' => 'No pudimos enviar el código a este correo. Revíselo e inténtelo nuevamente.',
            ]);
        }
    }

    /**
     * Lanza ValidationException (campo email_code) si el código no sirve.
     * No lo consume: eso lo hace consume() cuando la cuenta ya se creó, para
     * que un error posterior (p. ej. de validación) no obligue a pedir otro.
     */
    public function verify(string $email, string $code): void
    {
        $email = $this->normalize($email);
        $key = $this->key($email, 'code');
        $entry = Cache::get($key);

        if (! $entry || ($entry['expires_at'] ?? 0) <= now()->timestamp) {
            Cache::forget($key);
            $this->fail('El código venció o no fue solicitado. Pida uno nuevo.');
        }

        if ($entry['attempts'] >= self::MAX_ATTEMPTS) {
            Cache::forget($key);
            $this->fail('Demasiados intentos con este código. Pida uno nuevo.');
        }

        if (! hash_equals($entry['hash'], $this->hash($email, trim($code)))) {
            $entry['attempts']++;
            Cache::put($key, $entry, now()->setTimestamp($entry['expires_at']));
            $left = self::MAX_ATTEMPTS - $entry['attempts'];
            $this->fail($left > 0
                ? "El código no es correcto. Le quedan {$left} intentos."
                : 'Demasiados intentos con este código. Pida uno nuevo.');
        }
    }

    public function consume(string $email): void
    {
        $email = $this->normalize($email);
        Cache::forget($this->key($email, 'code'));
        Cache::forget($this->key($email, 'cooldown'));
    }

    private function fail(string $message): never
    {
        throw ValidationException::withMessages(['email_code' => $message]);
    }

    private function normalize(string $email): string
    {
        return mb_strtolower(trim($email));
    }

    private function key(string $email, string $kind): string
    {
        return 'saas-onboarding-'.$kind.':'.hash('sha256', $email);
    }

    private function hash(string $email, string $code): string
    {
        return hash_hmac('sha256', $email.'|'.$code, (string) config('app.key'));
    }
}

<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OnboardingVerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $code, public int $minutes)
    {
    }

    public function build(): self
    {
        return $this->subject("Tu código de verificación de EcuaPOS: {$this->code}")
            ->markdown('emails.onboarding-code', [
                'code' => $this->code,
                'minutes' => $this->minutes,
            ]);
    }
}

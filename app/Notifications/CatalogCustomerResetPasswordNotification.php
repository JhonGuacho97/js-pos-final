<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CatalogCustomerResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly string $url,
        public readonly string $storeName,
    ) {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Recupera tu contraseña de {$this->storeName}")
            ->greeting('Hola')
            ->line("Recibimos una solicitud para cambiar la contraseña de tu cuenta en {$this->storeName}.")
            ->action('Crear una nueva contraseña', $this->url)
            ->line('Este enlace estará disponible durante 60 minutos y solo puede utilizarse una vez.')
            ->line('Si no solicitaste este cambio, puedes ignorar este mensaje; tu contraseña seguirá siendo la misma.')
            ->salutation('EcuaPos');
    }
}

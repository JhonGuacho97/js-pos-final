<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public $url;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(string $url)
    {
        $this->url = $url;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     */
    public function toMail($notifiable): MailMessage
    {
        $this->url = $this->url.'/'.$notifiable->email;

    return (new MailMessage)
        ->subject('Solicitud de restablecimiento de contraseña')
        ->greeting('Estimado(a) usuario(a),')
        ->line('Recibimos una solicitud para restablecer la contraseña asociada a tu cuenta.')
        ->line('Para continuar con el proceso, haz clic en el siguiente botón:')
        ->action('Restablecer mi contraseña', $this->url)
        ->line('Este enlace de seguridad expirará en :count minutos.', [
            'count' => config('auth.passwords.' . config('auth.defaults.passwords') . '.expire')
        ])
        ->line('Si no realizaste esta solicitud, no es necesario que hagas nada. Tu contraseña permanecerá sin cambios y tu cuenta seguirá protegida.')
        ->line('Gracias por confiar en nosotros.')
        ->salutation('Atentamente,' . PHP_EOL . config('app.name'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     */
    public function toArray($notifiable): array
    {
        return [
            //
        ];
    }
}

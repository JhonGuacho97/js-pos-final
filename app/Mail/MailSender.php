<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailSender extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var array
     */
    private $data;

    /**
     * Adjuntos: array de ['path' => ..., 'name' => ..., 'mime' => ...]
     *
     * Ojo: NO se llama $attachments -- la clase base Mailable de
     * Laravel ya declara una propiedad pública con ese nombre, y PHP no
     * permite que una clase hija la vuelva privada.
     *
     * @var array
     */
    private $adjuntosPersonalizados;

    /**
     * MailSender constructor.
     */
    public function __construct($view, $subject, array $data = [], array $attachments = [])
    {
        $this->view = $view;
        $this->subject = $subject;
        $this->data = $data;
        $this->adjuntosPersonalizados = $attachments;
    }

    public function build(): MailSender
    {
        $mail = $this->subject($this->subject)
            ->markdown($this->view)
            ->with($this->data);

        foreach ($this->adjuntosPersonalizados as $adjunto) {
            if (!empty($adjunto['path']) && file_exists($adjunto['path'])) {
                $mail->attach($adjunto['path'], [
                    'as' => $adjunto['name'] ?? basename($adjunto['path']),
                    'mime' => $adjunto['mime'] ?? null,
                ]);
            }
        }

        return $mail;
    }
}

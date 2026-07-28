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
     * @var array
     */
    private $attachments;

    /**
     * MailSender constructor.
     */
    public function __construct($view, $subject, array $data = [], array $attachments = [])
    {
        $this->view = $view;
        $this->subject = $subject;
        $this->data = $data;
        $this->attachments = $attachments;
    }

    public function build(): MailSender
    {
        $mail = $this->subject($this->subject)
            ->markdown($this->view)
            ->with($this->data);

        foreach ($this->attachments as $adjunto) {
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

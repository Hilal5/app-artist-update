<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        // **URL HARUS PERSIS SEPERTI INI**
        $url = url('/reset-password/' . $this->token . '?email=' . urlencode($notifiable->email));

        \Log::info('=== CUSTOM NOTIFICATION URL ===');
        \Log::info('Generated URL: ' . $url);
        \Log::info('============================');

        return (new MailMessage)
            ->subject('Reset Password - ' . config('app.name'))
            ->greeting('Halo!')
            ->line('Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.')
            ->action('Reset Password', $url)
            ->line('Link reset password ini akan kadaluarsa dalam 60 menit.')
            ->line('Jika Anda tidak meminta reset password, abaikan email ini.')
            ->salutation('Salam, ' . config('app.name'));
    }
}
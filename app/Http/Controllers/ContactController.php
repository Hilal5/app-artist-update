<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email',
            'subject' => 'required',
            'message' => 'required|min:10'
        ]);

        try {
            $emailBody = "
    =================================
    CONTACT FORM SUBMISSION
    =================================

    From: {$validated['name']}
    Email: {$validated['email']}
    Subject: {$validated['subject']}

    Message:
    {$validated['message']}

    =================================
            ";

            Mail::raw($emailBody, function ($message) use ($validated) {
                $message->from(config('mail.from.address'), '💌 Surat Cinta Developer')
                        ->replyTo($validated['email'], $validated['name'])
                        ->to('hilalprayogi42@gmail.com')
                        ->subject('[Contact Form] ' . $validated['subject']);
            });

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
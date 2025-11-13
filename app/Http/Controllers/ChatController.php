<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Models\Commission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    /**
     * Get admin for chat (first admin user)
     */
    public function getAdmin()
    {
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'No admin available'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'avatar' => $admin->avatar,
            ]
        ]);
    }
    

    /**
     * Get all conversations (Admin only)
     */
    public function getConversations()
{
    if (!Auth::check() || Auth::user()->role !== 'admin') {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }

    // ✅ Update last_seen admin
    Auth::user()->update(['last_seen' => now()]);

    $adminId = Auth::id();
    
    $conversations = Message::where(function($query) use ($adminId) {
        $query->where('sender_id', $adminId)
              ->orWhere('receiver_id', $adminId);
    })
    ->with(['sender', 'receiver'])
    ->orderBy('created_at', 'desc')
    ->get()
    ->map(function($message) use ($adminId) {
        return $message->sender_id == $adminId ? $message->receiver : $message->sender;
    })
    ->unique('id')
    ->map(function($user) use ($adminId) {
        $lastMessage = Message::where(function($query) use ($user, $adminId) {
            $query->where('sender_id', $user->id)->where('receiver_id', $adminId)
                  ->orWhere('sender_id', $adminId)->where('receiver_id', $user->id);
        })
        ->orderBy('created_at', 'desc')
        ->first();
        
        $unreadCount = Message::where('sender_id', $user->id)
                              ->where('receiver_id', $adminId)
                              ->where('is_read', false)
                              ->count();
        
        // ✅ CHECK: User online jika last_seen dalam 5 menit terakhir
        $isOnline = $user->last_seen && $user->last_seen->gt(now()->subSeconds(10));
        
        return [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'user_email' => $user->email,
            'user_avatar' => $user->getAvatarUrl(), // ✅ PAKAI getAvatarUrl()
            'user_role' => $user->role, // ✅ TAMBAH ROLE
            'is_blocked' => $user->is_blocked, // ✅ TAMBAHKAN INI
            'user_avatar' => $user->avatar,
            'is_online' => $isOnline, // ✅ TAMBAHKAN INI
            'last_seen' => $user->last_seen, // ✅ TAMBAHKAN INI
            'last_message' => $lastMessage ? $lastMessage->message : 'No messages yet',
            'last_message_at' => $lastMessage ? $lastMessage->created_at->diffForHumans() : '',
            'last_message_time' => $lastMessage ? $lastMessage->created_at : null,
            'unread_count' => $unreadCount,
        ];
    })
    ->sortByDesc('last_message_time')
    ->values()
    ->toArray();

    return response()->json([
        'success' => true,
        'conversations' => $conversations
    ]);
}
    

    public function getMessages(Request $request)
{
    if (!Auth::check()) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 401);
    }

    // ✅ CHECK: User blocked tidak bisa load messages
    if (Auth::user()->is_blocked) {
        return response()->json([
            'success' => false,
            'message' => 'Your account has been blocked.'
        ], 403);
    }

    // ✅ Update last_seen user yang buka chat
    Auth::user()->update(['last_seen' => now()]);

    $userId = Auth::id();
    $otherUserId = $request->query('user_id');

    if (!$otherUserId) {
        return response()->json([
            'success' => false,
            'message' => 'User ID required'
        ], 422);
    }

    // ✅ Get other user info untuk status online
    $otherUser = User::find($otherUserId);
    $isOnline = $otherUser && $otherUser->last_seen && $otherUser->last_seen->gt(now()->subSeconds(10));

    $messages = Message::where(function($query) use ($userId, $otherUserId) {
        $query->where('sender_id', $userId)
              ->where('receiver_id', $otherUserId);
    })
    ->orWhere(function($query) use ($userId, $otherUserId) {
        $query->where('sender_id', $otherUserId)
              ->where('receiver_id', $userId);
    })
    ->with(['sender', 'receiver', 'commission'])
    ->orderBy('created_at', 'asc')
    ->get()
    ->map(function($message) use ($userId) {
        $data = [
            'id' => $message->id,
            'message' => $message->message,
            'attachment' => $message->attachment,
            'sender_id' => $message->sender_id,
            'sender_name' => $message->sender->name,
            'sender_avatar' => $message->sender->avatar,
            'is_own' => $message->sender_id == $userId,
            'is_read' => $message->is_read,
            'created_at' => $message->created_at->format('H:i'),
            'created_at_full' => $message->created_at->format('Y-m-d H:i:s'),
        ];

if ($message->commission) {
    $commission = $message->commission;
    $originalPrice = $commission->price;
    $discountedPrice = $originalPrice;
    
    // Hitung harga diskon jika ada
    if ($commission->discount_percentage > 0) {
        $discountedPrice = $originalPrice - ($originalPrice * $commission->discount_percentage / 100);
    }
    
    $data['commission'] = [  // ✅ BENAR - pakai $data bukan $responseData
        'id' => $commission->id,
        'name' => $commission->name,
        'description' => $commission->description,
        'price' => $originalPrice,
        'discount_percentage' => $commission->discount_percentage,
        'discounted_price' => $discountedPrice,
        'delivery_time' => $commission->delivery_time,
    ];
}

        return $data;
    });

    Message::where('sender_id', $otherUserId)
           ->where('receiver_id', $userId)
           ->where('is_read', false)
           ->update(['is_read' => true]);

    return response()->json([
        'success' => true,
        'messages' => $messages,
        'other_user' => [
            'id' => $otherUser->id,
            'name' => $otherUser->name,
            'is_online' => $isOnline,
            'last_seen' => $otherUser->last_seen,
            'avatar_url' => $otherUser->getAvatarUrl(), // ✅ TAMBAH INI!
            'role' => $otherUser->role, // ✅ TAMBAH INI JUGA!
        ]
    ]);
}

    /**
     * Send a message
     */
public function sendMessage(Request $request)
{
    if (!Auth::check()) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 401);
    }

    // ✅ CHECK: Apakah user ter-block
    if (Auth::user()->is_blocked) {
        return response()->json([
            'success' => false,
            'message' => 'Your account has been blocked. You cannot send messages.'
        ], 403);
    }

    $receiver = User::find($request->receiver_id);
    if ($receiver && $receiver->is_blocked && Auth::user()->role === 'admin') {
        return response()->json([
            'success' => false,
            'message' => 'This user is blocked. Unblock them first to send messages.'
        ], 403);
    }

    Auth::user()->update(['last_seen' => now()]);

    $validator = Validator::make($request->all(), [
        'receiver_id' => 'required|exists:users,id',
        'message' => 'nullable|string|max:5000',
        'attachment' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,webm,mov,psd|max:51200', // 50MB
        'commission_id' => 'nullable|exists:commissions,id',
    ]);

    if (!$request->message && !$request->hasFile('attachment') && !$request->commission_id) {
        return response()->json([
            'success' => false,
            'message' => 'Message, attachment, or commission is required'
        ], 422);
    }

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()->first()
        ], 422);
    }

    // ✅ CHECK: Jika ada commission_id, cek slot availability
    if ($request->commission_id) {
        $commission = Commission::find($request->commission_id);
        
        if (!$commission) {
            return response()->json([
                'success' => false,
                'message' => 'Commission not found'
            ], 404);
        }

        // ✅ Validasi slot masih available
        if ($commission->slots_available <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, this commission is fully booked!'
            ], 422);
        }

    }

    $data = [
        'sender_id' => Auth::id(),
        'receiver_id' => $request->receiver_id,
        'message' => $request->message,
        'commission_id' => $request->commission_id,
    ];

    // Handle attachment
    if ($request->hasFile('attachment')) {
        try {
            $file = $request->file('attachment');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            $destinationPath = public_path('storage/chat_attachments');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            $file->move($destinationPath, $fileName);
            $data['attachment'] = $fileName;
            
            \Log::info('Chat attachment uploaded:', ['file' => $fileName]);
            
        } catch (\Exception $e) {
            \Log::error('Upload attachment error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload attachment: ' . $e->getMessage()
            ], 500);
        }
    }

    try {
        // ✅ START TRANSACTION
        \DB::beginTransaction();

        if (isset($data['message'])) {
            $data['message'] = $this->cleanMessageFormat($data['message']);
        }

        $message = Message::create($data);
        $message->load(['sender', 'commission']);

        // ✅ DECREASE SLOT jika ada commission_id
        if ($request->commission_id) {
            $commission = Commission::find($request->commission_id);
            $commission->decrement('slots_available'); // Kurangi 1 slot
            
            \Log::info('Commission slot decreased:', [
                'commission_id' => $commission->id,
                'remaining_slots' => $commission->slots_available
            ]);
        }

        \DB::commit();

        // ✅ AUTO-REPLY untuk commission order
        if ($request->commission_id && Auth::id() !== $request->receiver_id) {
            // Delay 3 detik
            sleep(3);
            
            $autoReplyMessage = $this->generateCommissionAutoReply($commission);
            
            // Kirim auto-reply dari admin
            Message::create([
                'sender_id' => $request->receiver_id, // Admin
                'receiver_id' => Auth::id(), // User yang order
                'message' => $autoReplyMessage,
            ]);
        }

        $responseData = [
            'id' => $message->id,
            'message' => $message->message,
            'attachment' => $message->attachment,
            'sender_id' => $message->sender_id,
            'sender_name' => Auth::user()->name,
            'sender_avatar' => Auth::user()->avatar,
            'is_own' => true,
            'is_read' => false,
            'created_at' => $message->created_at->format('H:i'),
            'created_at_full' => $message->created_at->format('Y-m-d H:i:s'),
        ];

if ($message->commission) {
    $commission = $message->commission;
    $originalPrice = $commission->price;
    $discountedPrice = $originalPrice;
    
    if ($commission->discount_percentage > 0) {
        $discountedPrice = $originalPrice - ($originalPrice * $commission->discount_percentage / 100);
    }
    
    $responseData['commission'] = [  // ✅ BENAR - pakai $responseData
        'id' => $commission->id,
        'name' => $commission->name,
        'description' => $commission->description,
        'price' => $originalPrice,
        'discount_percentage' => $commission->discount_percentage,
        'discounted_price' => $discountedPrice,
        'delivery_time' => $commission->delivery_time,
    ];
}

        return response()->json([
            'success' => true,
            'message' => 'Order sent successfully! Slot reserved.',
            'data' => $responseData
        ]);
        
    } catch (\Exception $e) {
        \DB::rollBack();
        \Log::error('Send message error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to send message: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Get unread count
     */
    public function getUnreadCount()
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $count = Message::where('receiver_id', Auth::id())
                       ->where('is_read', false)
                       ->count();

        return response()->json([
            'success' => true,
            'unread_count' => $count
        ]);
    }

    /**
     * Mark all messages as read
     */
    public function markAsRead(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $senderId = $request->input('sender_id');

        Message::where('sender_id', $senderId)
               ->where('receiver_id', Auth::id())
               ->where('is_read', false)
               ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Messages marked as read'
        ]);
    }

    /**
 * Check if user is online
 */
public function checkOnlineStatus(Request $request)
{
    if (!Auth::check()) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 401);
    }

    $userId = $request->query('user_id');
    
    if (!$userId) {
        return response()->json([
            'success' => false,
            'message' => 'User ID required'
        ], 422);
    }

    $user = User::find($userId);
    
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 404);
    }

    $isOnline = $user->last_seen && $user->last_seen->gt(now()->subSeconds(10));

    return response()->json([
        'success' => true,
        'is_online' => $isOnline,
        'last_seen' => $user->last_seen ? $user->last_seen->diffForHumans() : null
    ]);
}

// Di ChatController.php tambahkan:

/**
 * Delete message (Admin only)
 */
public function deleteMessage($id)
{
    if (!Auth::check() || Auth::user()->role !== 'admin') {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
    }

    $message = Message::find($id);
    
    if (!$message) {
        return response()->json(['success' => false, 'message' => 'Message not found'], 404);
    }

    // Hapus attachment jika ada
    if ($message->attachment) {
        $filePath = public_path('storage/chat_attachments/' . $message->attachment);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    $message->delete();

    return response()->json(['success' => true, 'message' => 'Message deleted']);
}

/**
 * Block/Unblock user (Admin only)
 */
public function blockUser(Request $request)
{
    if (!Auth::check() || Auth::user()->role !== 'admin') {
        return response()->json([
            'success' => false, 
            'message' => 'Unauthorized'
        ], 403);
    }

    $userId = $request->input('user_id');
    $user = User::find($userId);

    if (!$user) {
        return response()->json([
            'success' => false, 
            'message' => 'User not found'
        ], 404);
    }

    // ✅ TOGGLE BLOCK STATUS
    $user->is_blocked = !$user->is_blocked;
    $user->save();

    $status = $user->is_blocked ? 'blocked' : 'unblocked';

    return response()->json([
        'success' => true, 
        'message' => "User {$status} successfully",
        'is_blocked' => $user->is_blocked
    ]);
}

/**
 * Delete conversation (Admin only)
 */
public function deleteConversation(Request $request)
{
    if (!Auth::check() || Auth::user()->role !== 'admin') {
        return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
    }

    $userId = $request->input('user_id');
    $adminId = Auth::id();

    // Hapus semua messages antara admin & user ini
    Message::where(function($q) use ($adminId, $userId) {
        $q->where('sender_id', $adminId)->where('receiver_id', $userId);
    })->orWhere(function($q) use ($adminId, $userId) {
        $q->where('sender_id', $userId)->where('receiver_id', $adminId);
    })->delete();

    return response()->json(['success' => true, 'message' => 'Conversation deleted']);
}

/**
 * Generate auto-reply message for commission order
 */
private function generateCommissionAutoReply($commission)
{
    $originalPrice = $commission->price;
    $discountedPrice = $originalPrice;
    $discountText = "";
    
    if ($commission->discount_percentage > 0) {
        $discountedPrice = $originalPrice - ($originalPrice * $commission->discount_percentage / 100);
        $discountText = "\n~~IDR " . number_format($originalPrice, 0, ',', '.') . "~~ **-{$commission->discount_percentage}%**";
    }
    
    $message = "🎉 **Thank you for ordering!**\n";
    $message .= "🎉 **this automatic message**\n\n";
    $message .= "Your commission has been confirmed:\n";
    $message .= "📦 **{$commission->name}**\n";
    $message .= "💰 **IDR " . number_format($discountedPrice, 0, ',', '.') . "**{$discountText}\n\n";
    
    $message .= "📋 **TRANSACTION DETAILS:**\n";
    $message .= "• Estimated delivery: {$commission->delivery_time}\n";
    $message .= "• Order ID: #" . time() . "\n";
    $message .= "• Status: Waiting for payment\n\n";
    
    $message .= "✨ **FREE REVISION:**\n";
    $message .= "• First 5 revisions: **FREE**\n";
    $message .= "• Additional revisions: **+Rp 5,000** per revision\n\n";
    
    $message .= "💳 **STEPS COMMISSION:**\n";
    $message .= "1. Wait for admin's reply\n";
    $message .= "2. Send proof of payment of 20% down payment\n";
    $message .= "3. Provide detailed requirements/references\n";
    $message .= "4. After the sketch is completed and the 50% down payment is approved, please send proof of payment\n";
    $message .= "5. Free 5x revisions, more than that will be charged an additional fee of Rp5.000\n";
    $message .= "5. Finally, if everything has been approved, please pay the final down payment of 30%\n";
    $message .= "6. Thank you.\n\n";
    
    $message .= "Need help? Just reply to this message! 😊";
    
    return $message;
}

/**
 * Clean message formatting (remove extra spaces)
 */
private function cleanMessageFormat($message)
{
    // Split by line, trim each line, then join back
    $lines = explode("\n", $message);
    $cleanedLines = array_map('trim', $lines);
    return implode("\n", $cleanedLines);
}

}

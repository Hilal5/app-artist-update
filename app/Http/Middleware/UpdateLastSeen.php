<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UpdateLastSeen
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $userId = Auth::id();
            
            // ✅ Direct DB update (lebih reliable)
            DB::table('users')
                ->where('id', $userId)
                ->update(['last_seen' => now(), 'updated_at' => now()]);
            
            Log::info('UpdateLastSeen: User ' . $userId . ' updated to ' . now());
        }

        return $next($request);
    }
}
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CommissionController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\WorkController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;


// Home
Route::get('/', function () {
    return view('home');
})->name('home');

// ================================================
// COMMISSION ROUTES - HARUS SEBELUM {id} ROUTE!
// ================================================
Route::get('/commissions/status', [CommissionController::class, 'getStatus']);
Route::post('/commissions/status', [CommissionController::class, 'updateStatus'])->middleware('auth');

// Public commission routes
Route::get('/commissions', [CommissionController::class, 'index']);
Route::get('/commissions/{id}', [CommissionController::class, 'show']);

// ================================================
// AUTHENTICATION ROUTES
// ================================================
Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/register', [RegisterController::class, 'register'])->name('register');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Redirect GET requests to home
Route::get('/login', fn() => redirect('/'));
Route::get('/register', fn() => redirect('/'));

// Google OAuth
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('google.login');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

// ================================================
// PUBLIC ROUTES
// ================================================
Route::post('/contact/send', [ContactController::class, 'send'])->name('contact.send');

// Public - Get reviews
Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews.index');
Route::get('/reviews/statistics', [ReviewController::class, 'statistics'])->name('reviews.statistics');

// Works routes
Route::get('/works', [WorkController::class, 'index']);
Route::get('/works/{id}', [WorkController::class, 'show']);

// ================================================
// PROTECTED ROUTES (Require Login)
// ================================================
Route::middleware('auth')->group(function () {    
    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    
    // Commissions (Admin only via middleware check in controller)
    Route::post('/commissions', [CommissionController::class, 'store'])->name('commissions.store');
    Route::put('/commissions/{id}', [CommissionController::class, 'update'])->name('commissions.update');
    Route::post('/commissions/{id}', [CommissionController::class, 'update'])->name('commissions.update.post');
    Route::delete('/commissions/{id}', [CommissionController::class, 'destroy'])->name('commissions.destroy');
    
    // Works (Admin only)
    Route::post('/works', [WorkController::class, 'store']);
    Route::put('/works/{id}', [WorkController::class, 'update']);
    Route::delete('/works/{id}', [WorkController::class, 'destroy']);
    
    // Chat Routes
    Route::get('/chat/admin', [ChatController::class, 'getAdmin'])->name('chat.admin');
    Route::get('/chat/conversations', [ChatController::class, 'getConversations'])->name('chat.conversations');
    Route::get('/chat/messages', [ChatController::class, 'getMessages'])->name('chat.messages');
    Route::post('/chat/send', [ChatController::class, 'sendMessage'])->name('chat.send');
    Route::get('/chat/unread-count', [ChatController::class, 'getUnreadCount'])->name('chat.unread-count');
    Route::post('/chat/mark-read', [ChatController::class, 'markAsRead'])->name('chat.mark-read');
    Route::get('/chat/online-status', [ChatController::class, 'checkOnlineStatus']);
});

// ================================================
// ADMIN ONLY ROUTES
// ================================================
Route::middleware(['auth'])->group(function () {
    Route::get('/reviews/pending', [ReviewController::class, 'pending']);
    Route::post('/reviews/{id}/approve', [ReviewController::class, 'approve']);
    Route::post('/reviews/{id}/toggle-verified', [ReviewController::class, 'toggleVerified']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
});

Route::middleware('guest')->group(function () {
    Route::get('/forgot-password', [ForgotPasswordController::class, 'showLinkRequestForm'])
        ->name('password.request');
    
    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])
        ->name('password.email');
    
    Route::get('/reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])
        ->name('password.reset');
    
    Route::post('/reset-password', [ResetPasswordController::class, 'reset'])
        ->name('password.update');
});

// routes/web.php
Route::get('/profile/photo', [ProfileController::class, 'getProfilePhoto']); // Public access
Route::middleware(['auth'])->group(function () {
    Route::post('/profile/upload-photo', [ProfileController::class, 'uploadPhoto']);
});

Route::get('/reviews/user-status', [ReviewController::class, 'userReviewStatus'])->name('reviews.user-status');

Route::middleware('auth')->group(function () {
    Route::delete('/chat/message/{id}', [ChatController::class, 'deleteMessage']);
    Route::post('/chat/block-user', [ChatController::class, 'blockUser']);
    Route::delete('/chat/conversation', [ChatController::class, 'deleteConversation']);
});
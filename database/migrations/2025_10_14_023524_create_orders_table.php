<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('commission_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->integer('price');
            $table->text('details')->nullable()->comment('Detail permintaan client');
            $table->string('payment_method')->nullable()->comment('DANA, Bank Transfer, GoPay');
            $table->string('payment_proof')->nullable()->comment('Path to payment proof image');
            $table->enum('status', [
                'pending',      // Menunggu pembayaran
                'paid',         // Sudah bayar, belum dikerjakan
                'in_progress',  // Sedang dikerjakan
                'revision',     // Revisi
                'completed',    // Selesai
                'cancelled'     // Dibatalkan
            ])->default('pending');
            $table->boolean('can_review')->default(false)->comment('Dapat memberikan review setelah completed');
            $table->text('admin_notes')->nullable()->comment('Catatan dari admin');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
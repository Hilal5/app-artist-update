<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->nullable()->constrained()->onDelete('set null'); // ✅ NULLABLE
            $table->integer('rating')->comment('1-5 stars');
            $table->text('comment');
            $table->string('commission_type')->nullable()->comment('Character Design, Animation, etc');
            $table->json('images')->nullable()->comment('Array of image paths');
            $table->boolean('verified')->default(false)->comment('Verified purchase badge');
            $table->boolean('is_approved')->default(false)->comment('Admin approval status');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
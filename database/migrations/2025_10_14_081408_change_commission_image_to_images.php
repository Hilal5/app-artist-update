<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commissions', function (Blueprint $table) {
            // Check if 'image' column exists before dropping
            if (Schema::hasColumn('commissions', 'image')) {
                $table->dropColumn('image');
            }
            
            // Add 'images' column if it doesn't exist
            if (!Schema::hasColumn('commissions', 'images')) {
                $table->json('images')->nullable()->after('slots_available');
            }
        });
    }

    public function down(): void
    {
        Schema::table('commissions', function (Blueprint $table) {
            if (Schema::hasColumn('commissions', 'images')) {
                $table->dropColumn('images');
            }
            
            if (!Schema::hasColumn('commissions', 'image')) {
                $table->string('image')->nullable();
            }
        });
    }
};
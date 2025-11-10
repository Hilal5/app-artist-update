<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('works', function (Blueprint $table) {
            // Hapus kolom video lama (single)
            if (Schema::hasColumn('works', 'video')) {
                $table->dropColumn('video');
            }
            
            // Tambah kolom videos sebagai JSON
            $table->json('videos')->nullable()->after('images');
        });
    }

    public function down()
    {
        Schema::table('works', function (Blueprint $table) {
            $table->dropColumn('videos');
            // Optional: tambah kembali kolom video lama jika rollback
            $table->string('video')->nullable()->after('images');
        });
    }
};
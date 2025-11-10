<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * 
     * PENTING: User admin HARUS sudah ada!
     */
    public function run(): void
    {
        // Only run WorkSeeder
        $this->call(WorkSeeder::class);
    }
}
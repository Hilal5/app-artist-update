<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@hilal.dev',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        echo "Admin user created!\n";
        echo "Email: admin@hilal.dev\n";
        echo "Password: admin123\n";
    }
}
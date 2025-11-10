<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // Create test users
        $users = [];
        for ($i = 1; $i <= 5; $i++) {
            $user = User::create([
                'name' => "Test User $i",
                'email' => "user$i@example.com",
                'password' => bcrypt('password'),
                'role' => 'client',
            ]);
            
            // Create completed order for each user
            Order::create([
                'user_id' => $user->id,
                'commission_type' => ['Character Design', 'Illustration', 'Animation'][rand(0, 2)],
                'status' => 'completed',
                'price' => rand(50, 300),
                'description' => 'Test order',
                'can_review' => true,
            ]);
            
            $users[] = $user;
        }

        // Create reviews
        $comments = [
            "Absolutely amazing work! Hilal captured exactly what I envisioned for my character design. The communication was excellent throughout the process, and the final result exceeded my expectations. Highly recommend! 🌟",
            "Professional, responsive, and talented! The animation work was smooth and polished. Will definitely commission again for future projects.",
            "Great artwork! Took a bit longer than expected but the quality made up for it. Good communication overall.",
            "Excellent service and incredible attention to detail. The illustration turned out even better than I imagined!",
            "Very happy with the final product. Hilal was patient with my revisions and really understood the vision I had.",
        ];

        $commissionTypes = ['Character Design', 'Animation', 'Illustration', 'Concept Art'];

        foreach ($users as $index => $user) {
            Review::create([
                'user_id' => $user->id,
                'rating' => [5, 5, 4, 5, 5][$index],
                'comment' => $comments[$index],
                'commission_type' => $commissionTypes[array_rand($commissionTypes)],
                'images' => $index === 0 ? ['sample1.jpg', 'sample2.jpg'] : null,
                'verified' => true,
                'is_approved' => true,
            ]);
        }

        $this->command->info('Reviews seeded successfully!');
    }
}
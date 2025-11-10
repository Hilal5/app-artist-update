<?php

namespace Database\Seeders;

use App\Models\Work;
use App\Models\WorkMedia;
use Illuminate\Database\Seeder;

class WorkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * CATATAN: User admin harus sudah ada di database!
     */
    public function run(): void
    {
        // Get existing admin user
        $admin = \App\Models\User::where('role', 'admin')->first();
        
        if (!$admin) {
            echo "❌ ERROR: Admin user tidak ditemukan!\n";
            echo "⚠️  Silahkan buat user admin dulu di database\n";
            return;
        }
        
        echo "✅ Using admin user: {$admin->email}\n";

        // Sample works data
        $works = [
            [
                'title' => 'Modern UI Dashboard Design',
                'description' => 'A comprehensive dashboard design featuring real-time analytics, charts, and data visualization. Built with modern design principles and user-centric approach.',
                'category' => 'ui-ux',
                'images' => [
                    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
                ],
            ],
            [
                'title' => 'Brand Identity System',
                'description' => 'Complete branding solution including logo design, color palette, typography guidelines, and brand usage rules. Perfect for startups and established businesses.',
                'category' => 'branding',
                'images' => [
                    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
                ],
            ],
            [
                'title' => 'Web Design for Tech Startup',
                'description' => 'Responsive web design for a tech startup focusing on product showcase, user engagement, and conversion optimization. Includes desktop and mobile layouts.',
                'category' => 'web-design',
                'images' => [
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
                ],
            ],
            [
                'title' => 'Character Illustration Collection',
                'description' => 'Hand-drawn character illustrations for mobile app. Includes various poses, expressions, and character archetypes suitable for gaming or educational apps.',
                'category' => 'illustration',
                'images' => [
                    'https://images.unsplash.com/photo-1578321272176-b7899b012ed2?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1551621521-c307667f4728?w=600&h=400&fit=crop',
                ],
            ],
            [
                'title' => 'Product Animation - Loading States',
                'description' => 'Smooth loading animations and transition effects for web applications. Includes skeleton screens, progress indicators, and state transitions.',
                'category' => 'animation',
                'images' => [
                    'https://images.unsplash.com/photo-1626814026875-db7f7b1b66a3?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1555949519-68b22feddc8b?w=600&h=400&fit=crop',
                ],
            ],
            [
                'title' => 'E-Commerce Platform Design',
                'description' => 'Full e-commerce platform design including product listing, detail pages, cart, checkout, and user profile. Mobile-first approach with accessibility considerations.',
                'category' => 'web-design',
                'images' => [
                    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
                ],
            ],
            [
                'title' => 'Mobile App UI Kit',
                'description' => 'Complete UI kit for mobile applications with 200+ components. Includes buttons, cards, navigation, forms, and custom elements. Fully documented and organized.',
                'category' => 'ui-ux',
                'images' => [
                    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
                ],
            ],
            [
                'title' => 'Landscape Illustration Series',
                'description' => 'Beautiful landscape illustrations inspired by nature. Perfect for travel blogs, tourism websites, and environmental projects. High-resolution digital paintings.',
                'category' => 'illustration',
                'images' => [
                    'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1578321272176-b7899b012ed2?w=600&h=400&fit=crop',
                ],
            ],
            [
                'title' => 'Social Media Branding Package',
                'description' => 'Complete social media branding including profile templates, post layouts, stories, and cover designs. Consistent across all platforms - Instagram, Facebook, Twitter, LinkedIn.',
                'category' => 'branding',
                'images' => [
                    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
                ],
            ],
            [
                'title' => '3D Animation - Product Demo',
                'description' => '3D product animation and demonstration video. Shows product features, specifications, and benefits in an engaging animated format. Perfect for marketing and presentations.',
                'category' => 'animation',
                'images' => [
                    'https://images.unsplash.com/photo-1626814026875-db7f7b1b66a3?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1555949519-68b22feddc8b?w=600&h=400&fit=crop',
                ],
            ],
            [
                'title' => 'SaaS Dashboard Interface',
                'description' => 'Professional SaaS dashboard with data visualization, user management, and analytics. Includes dark mode, responsive design, and real-time updates capability.',
                'category' => 'ui-ux',
                'images' => [
                    'https://images.unsplash.com/photo-1551621521-c307667f4728?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1578321272176-b7899b012ed2?w=600&h=400&fit=crop',
                ],
            ],
            [
                'title' => 'Icon Design System',
                'description' => 'Comprehensive icon design system with 500+ icons. Includes multiple styles - outlined, filled, and solid. Perfect for web, mobile, and desktop applications.',
                'category' => 'other',
                'images' => [
                    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
                ],
            ],
        ];

        // Create works with media
        foreach ($works as $workData) {
            $work = Work::create([
                'user_id' => $admin->id,
                'title' => $workData['title'],
                'description' => $workData['description'],
                'category' => $workData['category'],
                'likes_count' => rand(5, 50),
                'comments_count' => rand(1, 15),
            ]);

            // Add media
            foreach ($workData['images'] as $imageUrl) {
                WorkMedia::create([
                    'work_id' => $work->id,
                    'media_path' => $imageUrl,
                    'media_type' => 'image',
                ]);
            }

            echo "✅ Created: {$work->title}\n";
        }

        echo "\n🎉 Works seeder completed! Total: " . Work::count() . " works\n";
    }
}
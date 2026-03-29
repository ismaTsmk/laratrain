<?php

namespace Database\Seeders;

use App\Modules\Catalog\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Category 1: Tech
        Product::factory()->create([
            'name' => 'Smartphone Ultra Pro',
            'image_url' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
        ]);

        // Category 2: Watch
        Product::factory()->create([
            'name' => 'Montre Connectée Sport',
            'image_url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        ]);

        // Category 3: Headphones
        Product::factory()->create([
            'name' => 'Casque Audio Noise Cancelling',
            'image_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
        ]);

        // Category 4: Camera
        Product::factory()->create([
            'name' => 'Appareil Photo Mirrorless',
            'image_url' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
        ]);

        // More products via factory
        Product::factory()->count(6)->create();
    }
}

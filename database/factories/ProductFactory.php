<?php

namespace Database\Factories;

use App\Modules\Catalog\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Catalog\Models\Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function RiverState(): array
    {
        $name = $this->faker->words(3, true);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph(),
            'image_url' => "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800", // Default beautiful product image
            'price' => $this->faker->numberBetween(1000, 100000), // 10€ to 1000€
            'stock' => $this->faker->numberBetween(0, 100),
        ];
    }

    public function definition(): array
    {
        return $this->RiverState();
    }
}

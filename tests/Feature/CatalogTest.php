<?php

namespace Tests\Feature;

use App\Modules\Catalog\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_it_can_list_products()
    {
        Product::factory()->count(3)->create();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    /** @test */
    public function test_it_can_create_a_product()
    {
        $response = $this->postJson('/api/products', [
            'name' => 'New Product',
            'slug' => 'new-product',
            'description' => 'Product Description',
            'price' => 1999,
            'stock' => 10,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'New Product')
            ->assertJsonPath('data.price', 19.99);

        $this->assertDatabaseHas('products', [
            'slug' => 'new-product',
        ]);
    }

    /** @test */
    public function test_it_can_show_a_product()
    {
        $product = Product::factory()->create();

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.name', $product->name);
    }

    /** @test */
    public function test_it_can_update_a_product()
    {
        $product = Product::factory()->create();

        $response = $this->putJson("/api/products/{$product->id}", [
            'name' => 'Updated Name',
            'slug' => 'updated-slug',
            'description' => 'Updated Description',
            'price' => 2999,
            'stock' => 5,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Updated Name');

        $this->assertDatabaseHas('products', [
            'slug' => 'updated-slug',
        ]);
    }

    /** @test */
    public function test_it_can_delete_a_product()
    {
        $product = Product::factory()->create();

        $response = $this->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }
}

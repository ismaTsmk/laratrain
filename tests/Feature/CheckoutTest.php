<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Catalog\Models\Product;
use App\Modules\Checkout\Events\OrderCreated;
use App\Modules\Checkout\Models\Cart;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function test_it_can_add_product_to_cart()
    {
        Sanctum::actingAs($this->user);
        $product = Product::factory()->create(['price' => 1000]);

        $response = $this->postJson('/api/cart/add', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.total_amount', 20);

        $this->assertDatabaseHas('cart_items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);
    }

    /** @test */
    public function test_it_can_view_cart()
    {
        Sanctum::actingAs($this->user);
        $cart = Cart::create(['user_id' => $this->user->id]);
        $product = Product::factory()->create(['price' => 1000]);
        $cart->items()->create(['product_id' => $product->id, 'quantity' => 1]);

        $response = $this->getJson('/api/cart');

        $response->assertStatus(200)
            ->assertJsonPath('data.total_amount', 10)
            ->assertJsonCount(1, 'data.items');
    }

    /** @test */
    public function test_it_can_checkout_and_create_order()
    {
        Event::fake();
        Sanctum::actingAs($this->user);
        
        $cart = Cart::create(['user_id' => $this->user->id]);
        $product = Product::factory()->create(['price' => 5000]);
        $cart->items()->create(['product_id' => $product->id, 'quantity' => 1]);

        $response = $this->postJson('/api/checkout');

        $response->assertStatus(201)
            ->assertJsonPath('data.total_amount', 50)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->user->id,
            'total_amount' => 5000,
        ]);

        $this->assertDatabaseHas('carts', [
            'id' => $cart->id,
            'status' => 'converted',
        ]);

        Event::assertDispatched(OrderCreated::class);
    }
}

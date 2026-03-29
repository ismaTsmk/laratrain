<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Catalog\Models\Product;
use App\Modules\Checkout\Models\Cart;
use App\Modules\Checkout\Models\Order;
use App\Modules\Checkout\Jobs\ProcessPaymentJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function test_order_creation_dispatches_payment_job()
    {
        Queue::fake();
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        
        $cart = Cart::create(['user_id' => $user->id]);
        $product = Product::factory()->create();
        $cart->items()->create(['product_id' => $product->id, 'quantity' => 1]);

        $this->postJson('/api/checkout');

        Queue::assertPushed(ProcessPaymentJob::class);
    }

    /** @test */
    public function test_payment_job_updates_order_status()
    {
        $order = Order::create([
            'user_id' => User::factory()->create()->id,
            'total_amount' => 1000,
            'status' => 'pending',
        ]);

        $job = new ProcessPaymentJob($order);
        $job->handle(app(\App\Modules\Common\Payment\PaymentGatewayInterface::class));

        $this->assertEquals('paid', $order->fresh()->status);
    }
}

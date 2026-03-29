<?php

namespace App\Modules\Checkout\Actions;

use App\Modules\Checkout\Events\OrderCreated;
use App\Modules\Checkout\Models\Cart;
use App\Modules\Checkout\Models\Order;
use App\Modules\Checkout\Models\OrderItem;
use Illuminate\Support\Facades\DB;

final readonly class PlaceOrderAction
{
    public function execute(Cart $cart): Order
    {
        return DB::transaction(function () use ($cart) {
            $cart->load('items.product');

            $totalAmount = $cart->items->sum(function ($item) {
                return $item->quantity * $item->product->price;
            });

            $order = Order::create([
                'user_id' => $cart->user_id,
                'total_amount' => $totalAmount,
                'status' => 'pending',
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                ]);
            }

            // Mark cart as converted
            $cart->update(['status' => 'converted']);

            event(new OrderCreated($order));

            return $order->load('items.product');
        });
    }
}

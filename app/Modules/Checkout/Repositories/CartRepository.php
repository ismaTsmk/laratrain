<?php

namespace App\Modules\Checkout\Repositories;

use App\Modules\Checkout\Models\Cart;
use App\Modules\Checkout\Models\CartItem;

class CartRepository
{
    /**
     * Get the active cart for a user, optionally eager-loading items and products.
     */
    public function getActiveCartForUser(int $userId, bool $withItems = false): Cart
    {
        $query = Cart::query()->activeForUser($userId);

        if ($withItems) {
            $query->with('items.product');
        }

        return $query->firstOrFail();
    }

    /**
     * Find the active cart for a user, or create one if it doesn't exist.
     */
    public function findOrCreateActiveCart(int $userId): Cart
    {
        return Cart::firstOrCreate(
            ['user_id' => $userId, 'status' => 'active']
        );
    }

    /**
     * Find an existing cart item for the given product, or return null.
     */
    public function findExistingItem(Cart $cart, int $productId): ?CartItem
    {
        return $cart->items()->where('product_id', $productId)->first();
    }
}

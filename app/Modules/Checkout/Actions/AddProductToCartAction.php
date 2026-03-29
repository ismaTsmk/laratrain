<?php

namespace App\Modules\Checkout\Actions;

use App\Modules\Checkout\DTOs\AddToCartData;
use App\Modules\Checkout\Models\Cart;
use App\Modules\Checkout\Repositories\CartRepository;
use Illuminate\Support\Facades\Auth;

final readonly class AddProductToCartAction
{
    public function __construct(
        private CartRepository $cartRepository,
    ) {}

    public function execute(AddToCartData $data): Cart
    {
        $userId = Auth::id();

        $cart = $this->cartRepository->findOrCreateActiveCart($userId);

        $item = $this->cartRepository->findExistingItem($cart, $data->productId);

        if ($item) {
            $item->update(['quantity' => $item->quantity + $data->quantity]);
        } else {
            $cart->items()->create([
                'product_id' => $data->productId,
                'quantity' => $data->quantity,
            ]);
        }

        return $cart->load('items.product');
    }
}

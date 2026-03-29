<?php

namespace App\Modules\Checkout\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Checkout\Actions\AddProductToCartAction;
use App\Modules\Checkout\Actions\PlaceOrderAction;
use App\Modules\Checkout\DTOs\AddToCartData;
use App\Modules\Checkout\Repositories\CartRepository;
use App\Modules\Checkout\Resources\CartResource;
use App\Modules\Checkout\Resources\OrderResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CartRepository $cartRepository,
    ) {}

    public function viewCart(): CartResource
    {
        $cart = $this->cartRepository->getActiveCartForUser(Auth::id(), withItems: true);

        return new CartResource($cart);
    }

    public function addToCart(\App\Modules\Checkout\Requests\AddToCartRequest $request, AddProductToCartAction $action): CartResource
    {
        $data = AddToCartData::fromRequest($request);
        $cart = $action->execute($data);

        return new CartResource($cart);
    }

    public function checkout(PlaceOrderAction $action): OrderResource
    {
        $cart = $this->cartRepository->getActiveCartForUser(Auth::id());

        $order = $action->execute($cart);

        return new OrderResource($order);
    }
}

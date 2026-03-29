<?php

namespace App\Modules\Checkout\DTOs;

final readonly class AddToCartData
{
    public function __construct(
        public int $productId,
        public int $quantity = 1,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            productId: (int) $data['product_id'],
            quantity: (int) ($data['quantity'] ?? 1),
        );
    }

    public static function fromRequest(\App\Modules\Checkout\Requests\AddToCartRequest $request): self
    {
        return self::fromArray($request->validated());
    }
}

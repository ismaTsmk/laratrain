<?php

namespace App\Modules\Checkout\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Modules\Catalog\Resources\ProductResource;

/** @mixin \App\Modules\Checkout\Models\CartItem */
class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => new ProductResource($this->whenLoaded('product')),
            'quantity' => $this->quantity,
            'subtotal' => ($this->quantity * ($this->product?->price ?? 0)) / 100,
        ];
    }
}

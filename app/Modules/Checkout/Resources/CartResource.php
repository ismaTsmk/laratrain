<?php

namespace App\Modules\Checkout\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Modules\Checkout\Models\Cart */
class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'total_amount' => $this->items?->sum(function ($item) {
                return $item->quantity * ($item->product?->price ?? 0);
            }) / 100,
        ];
    }
}

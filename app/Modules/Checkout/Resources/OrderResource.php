<?php

namespace App\Modules\Checkout\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Modules\Checkout\Models\Order */
class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'total_amount' => $this->total_amount / 100,
            'items_count' => $this->items_count ?? $this->items?->count(),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}

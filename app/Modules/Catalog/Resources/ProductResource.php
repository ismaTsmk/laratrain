<?php

namespace App\Modules\Catalog\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Modules\Catalog\Models\Product */
class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'price' => $this->price / 100, // Display in major currency unit
            'price_raw' => $this->price,   // Cent value for API consumers if needed
            'stock' => $this->stock,
            'is_available' => $this->stock > 0,
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}

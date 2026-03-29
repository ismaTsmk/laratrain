<?php

namespace App\Modules\Catalog\Actions;

use App\Modules\Catalog\DTOs\ProductData;
use App\Modules\Catalog\Models\Product;

final readonly class CreateProductAction
{
    public function execute(ProductData $data): Product
    {
        return Product::create([
            'name' => $data->name,
            'slug' => $data->slug,
            'description' => $data->description,
            'price' => $data->price,
            'stock' => $data->stock,
        ]);
    }
}

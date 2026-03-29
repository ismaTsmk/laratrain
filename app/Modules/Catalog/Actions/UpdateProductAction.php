<?php

namespace App\Modules\Catalog\Actions;

use App\Modules\Catalog\DTOs\ProductData;
use App\Modules\Catalog\Models\Product;

final readonly class UpdateProductAction
{
    public function execute(Product $product, ProductData $data): Product
    {
        $product->update([
            'name' => $data->name,
            'slug' => $data->slug,
            'description' => $data->description,
            'price' => $data->price,
            'stock' => $data->stock,
        ]);

        return $product;
    }
}

<?php

namespace App\Modules\Catalog\Actions;

use App\Modules\Catalog\Models\Product;

final readonly class DeleteProductAction
{
    public function execute(Product $product): bool
    {
        return $product->delete();
    }
}

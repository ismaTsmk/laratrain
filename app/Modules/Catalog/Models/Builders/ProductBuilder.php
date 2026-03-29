<?php

namespace App\Modules\Catalog\Models\Builders;

use Illuminate\Database\Eloquent\Builder;

/**
 * @template TModelClass of \App\Modules\Catalog\Models\Product
 * @extends Builder<TModelClass>
 */
class ProductBuilder extends Builder
{
    public function available(): self
    {
        return $this->where('stock', '>', 0);
    }

    public function search(string $term): self
    {
        return $this->where('name', 'like', "%{$term}%")
            ->orWhere('description', 'like', "%{$term}%");
    }

    public function priceUnder(int $amount): self
    {
        return $this->where('price', '<=', $amount);
    }
}

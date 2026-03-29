<?php

namespace App\Modules\Catalog\Repositories;

use App\Modules\Catalog\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class ProductRepository
{
    /**
     * Return a paginated or limited list of products, with optional search filtering.
     *
     * @return LengthAwarePaginator|Collection<int, Product>
     */
    public function list(Request $request): LengthAwarePaginator|Collection
    {
        $query = Product::query()
            ->when($request->search, fn ($query, $term) => $query->search($term))
            ->latest();

        if ($request->has('limit')) {
            return $query->limit($request->limit)->get();
        }

        return $query->paginate();
    }
}

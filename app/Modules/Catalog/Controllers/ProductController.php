<?php

namespace App\Modules\Catalog\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Actions\CreateProductAction;
use App\Modules\Catalog\Actions\DeleteProductAction;
use App\Modules\Catalog\Actions\UpdateProductAction;
use App\Modules\Catalog\DTOs\ProductData;
use App\Modules\Catalog\Models\Product;
use App\Modules\Catalog\Repositories\ProductRepository;
use App\Modules\Catalog\Requests\ProductRequest;
use App\Modules\Catalog\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductRepository $productRepository,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return ProductResource::collection(
            $this->productRepository->list($request)
        );
    }

    public function store(ProductRequest $request, CreateProductAction $action): ProductResource
    {
        $data = ProductData::fromRequest($request);
        $product = $action->execute($data);

        return new ProductResource($product);
    }

    public function show(Product $product): ProductResource
    {
        return new ProductResource($product);
    }

    public function update(ProductRequest $request, Product $product, UpdateProductAction $action): ProductResource
    {
        $data = ProductData::fromRequest($request);
        $product = $action->execute($product, $data);

        return new ProductResource($product);
    }

    public function destroy(Product $product, DeleteProductAction $action): Response
    {
        $action->execute($product);

        return response()->noContent();
    }
}

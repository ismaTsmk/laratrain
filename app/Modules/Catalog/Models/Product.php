<?php

namespace App\Modules\Catalog\Models;

use App\Modules\Catalog\Models\Builders\ProductBuilder;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    protected static function newFactory(): ProductFactory
    {
        return ProductFactory::new();
    }

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image_url',
        'price',
        'stock',
    ];

    protected $casts = [
        'price' => 'integer',
        'stock' => 'integer',
    ];

    /**
     * @param  \Illuminate\Database\Query\Builder  $query
     * @return ProductBuilder<Product>
     */
    public function newEloquentBuilder($query): ProductBuilder
    {
        return new ProductBuilder($query);
    }
}

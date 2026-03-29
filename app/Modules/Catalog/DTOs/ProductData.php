<?php

namespace App\Modules\Catalog\DTOs;

final readonly class ProductData
{
    public function __construct(
        public string $name,
        public string $slug,
        public string $description,
        public int $price,
        public int $stock,
    ) {}

    /**
     * Create a DTO from an array (e.g. from a FormRequest)
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            slug: $data['slug'],
            description: $data['description'] ?? '',
            price: (int) $data['price'],
            stock: (int) ($data['stock'] ?? 0),
        );
    }

    public static function fromRequest(\App\Modules\Catalog\Requests\ProductRequest $request): self
    {
        return self::fromArray($request->validated());
    }
}

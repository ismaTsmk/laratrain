<?php

namespace App\Modules\Checkout\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'status',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function newEloquentBuilder($query): Builders\CartBuilder
    {
        return new Builders\CartBuilder($query);
    }
}

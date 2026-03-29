<?php

namespace App\Modules\Checkout\Models\Builders;

use Illuminate\Database\Eloquent\Builder;

class CartBuilder extends Builder
{
    public function active(): self
    {
        return $this->where('status', 'active');
    }

    public function forUser(int $userId): self
    {
        return $this->where('user_id', $userId);
    }

    public function activeForUser(int $userId): self
    {
        return $this->active()->forUser($userId);
    }
}

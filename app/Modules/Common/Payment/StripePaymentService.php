<?php

namespace App\Modules\Common\Payment;

use Illuminate\Support\Facades\Log;

final readonly class StripePaymentService implements PaymentGatewayInterface
{
    public function charge(int $amount, string $currency = 'EUR', array $options = []): bool
    {
        // Fictional Stripe implementation for learning purposes
        Log::info("Simulating Stripe charge of {$amount} {$currency}");

        // Return true randomly or based on options for testing
        return true;
    }
}

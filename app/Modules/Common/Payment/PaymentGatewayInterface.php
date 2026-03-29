<?php

namespace App\Modules\Common\Payment;

interface PaymentGatewayInterface
{
    /**
     * @param  int  $amount  Amount in cents
     * @param  array<string, mixed>  $options
     */
    public function charge(int $amount, string $currency = 'EUR', array $options = []): bool;
}

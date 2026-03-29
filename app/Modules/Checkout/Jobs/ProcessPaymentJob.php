<?php

namespace App\Modules\Checkout\Jobs;

use App\Modules\Checkout\Models\Order;
use App\Modules\Common\Payment\PaymentGatewayInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessPaymentJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Order $order
    ) {}

    public function handle(PaymentGatewayInterface $paymentGateway): void
    {
        Log::info("Starting payment processing for Order #{$this->order->id}");

        $success = $paymentGateway->charge($this->order->total_amount, 'EUR', [
            'order_id' => $this->order->id
        ]);

        if ($success) {
            $this->order->update(['status' => 'paid']);
            Log::info("Payment successful for Order #{$this->order->id}");
        } else {
            $this->order->update(['status' => 'failed']);
            Log::error("Payment failed for Order #{$this->order->id}");
        }
    }
}

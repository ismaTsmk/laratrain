<?php

namespace App\Modules\Checkout\Listeners;

use App\Modules\Checkout\Events\OrderCreated;
use App\Modules\Checkout\Jobs\ProcessPaymentJob;

class HandleOrderCreated
{
    public function handle(OrderCreated $event): void
    {
        // Dispatch the payment processing job as soon as an order is created
        ProcessPaymentJob::dispatch($event->order);
    }
}

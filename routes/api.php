<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use App\Modules\Catalog\Controllers\ProductController;
use App\Modules\Checkout\Controllers\CheckoutController;

Route::apiResource('products', ProductController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CheckoutController::class, 'viewCart']);
    Route::post('/cart/add', [CheckoutController::class, 'addToCart']);
    Route::post('/checkout', [CheckoutController::class, 'checkout']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
Route::get('/health', function () {
    $status = [
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'services' => [
            'app' => 'ok',
            'database' => 'ok',
            'redis' => 'ok',
        ],
    ];

    try {
        DB::connection()->getPdo();
    } catch (\Exception $e) {
        $status['services']['database'] = 'error: ' . $e->getMessage();
        $status['status'] = 'degraded';
    }

    try {
        Redis::ping();
    } catch (\Exception $e) {
        $status['services']['redis'] = 'error: ' . $e->getMessage();
        $status['status'] = 'degraded';
    }

    $httpCode = $status['status'] === 'ok' ? 200 : 503;

    return response()->json($status, $httpCode);
});

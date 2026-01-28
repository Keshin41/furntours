<?php

use App\Models\FurMeet;
use App\Models\User;
use App\Models\Statistic;
use App\Http\Controllers\ReglementController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\CguController;
use App\Http\Controllers\RgpdController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    $furMeets = FurMeet::published()
        ->orderBy('date', 'desc')
        ->limit(3)
        ->get();

    $statistics = Statistic::current();

    $staff = User::publicStaff()->get();

    return Inertia::render('Acceuil', [
        'furMeets' => $furMeets,
        'statistics' => $statistics,
        'staff' => $staff,
    ]);
})->name('acceuil');

Route::prefix('boutique')->name('boutique.')->group(function () {
    Route::get('/', [App\Http\Controllers\ShopController::class, 'index'])->name('index');

    Route::get('/checkout', function () { 
        return Inertia::render('Checkout'); 
    })->name('checkout');

    Route::post('/checkout', [App\Http\Controllers\CheckoutController::class, 'store'])->name('checkout.store');

    Route::get('/paiement', function () {
        return Inertia::render('Payment');
    })->name('payment');

    Route::get('/panier', function () {
        return Inertia::render('Cart');
    })->name('cart');

    Route::get('/{product:slug}', [App\Http\Controllers\ShopController::class, 'show'])->name('product');
});

// Routes des factures
Route::get('/invoice/{invoice}', [App\Http\Controllers\InvoiceController::class, 'show'])->name('invoice.show');
Route::get('/invoice/{invoice}/download', [App\Http\Controllers\InvoiceController::class, 'download'])->name('invoice.download');

// Routes de paiement
Route::prefix('api/payment')->name('payment.')->group(function () {
    Route::post('/create-payment-intent', [PaymentController::class, 'createPaymentIntent'])->name('create');
    Route::post('/confirm-payment', [PaymentController::class, 'confirmPayment'])->name('confirm');
    Route::post('/webhook', [PaymentController::class, 'handleWebhook'])->name('webhook');
});




Route::get('explication', function () {
    return Inertia::render('Explication');
})->name('explication');

Route::get('status', [StatusController::class, 'show'])->name('status');

Route::get('reglement-interieur', [ReglementController::class, 'show'])->name('reglement');

Route::get('cgu', [CguController::class, 'show'])->name('cgu');

Route::get('rgpd', [RgpdController::class, 'show'])->name('rgpd');

Route::get('furmeets', function () {

    $furMeets = FurMeet::published()
        ->orderBy('date', 'desc')
        ->get();

    return Inertia::render('Furmeets', [
        'furMeets' => $furMeets,
    ]);
})->name('furmeets');

Route::get('furmeets/{furMeet}', function (FurMeet $furMeet) {
    // Afficher uniquement les FurMeets publiés
    if (!$furMeet->is_published) {
        abort(404);
    }

    // Récupérer le FurMeet précédent (plus ancien)
    $previousFurMeet = FurMeet::published()
        ->where('date', '<', $furMeet->date)
        ->orderBy('date', 'desc')
        ->first();

    // Récupérer le FurMeet suivant (plus récent)
    $nextFurMeet = FurMeet::published()
        ->where('date', '>', $furMeet->date)
        ->orderBy('date', 'asc')
        ->first();

    return Inertia::render('FurmeetShow', [
        'furMeet' => $furMeet,
        'previousFurMeet' => $previousFurMeet,
        'nextFurMeet' => $nextFurMeet,
    ]);
})->name('furmeets.show');

Route::get('rcs', function () {
    return Inertia::render('RCS');
})->name('rcs');

Route::get('contact', function () {
    return Inertia::render('Contact');
})->name('contact');



// Password change routes (for forced password change)
Route::middleware([App\Http\Middleware\AdminAuth::class, 'force.password.change'])->group(function () {
    Route::get('/admin/change-password', [App\Http\Controllers\Admin\Auth\PasswordChangeController::class, 'show'])
        ->name('admin.auth.password.change');
    Route::post('/admin/change-password', [App\Http\Controllers\Admin\Auth\PasswordChangeController::class, 'change'])
        ->name('admin.auth.password.change.store');
});

// Admin authentication routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [App\Http\Controllers\Admin\Auth\AuthController::class, 'showLoginForm'])->name('auth.login');
    Route::post('/login', [App\Http\Controllers\Admin\Auth\AuthController::class, 'login']);
    Route::post('/logout', [App\Http\Controllers\Admin\Auth\AuthController::class, 'logout'])->name('auth.logout')->middleware('auth');
});

// Protected admin routes
Route::prefix('admin')->name('admin.')->middleware(App\Http\Middleware\AdminAuth::class)->group(function () {
    Route::get('/', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // Profile routes
    Route::get('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile');
    Route::post('/profile', [App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
    
    // FurMeets management routes
    Route::prefix('/furmeets')->name('furmeets.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\Furmeets\FurMeetController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\Furmeets\FurMeetController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\Admin\Furmeets\FurMeetController::class, 'store'])->name('store');
        Route::get('/{furMeet}/edit', [App\Http\Controllers\Admin\Furmeets\FurMeetController::class, 'edit'])->name('edit');
        Route::put('/{furMeet}', [App\Http\Controllers\Admin\Furmeets\FurMeetController::class, 'update'])->name('update');
        Route::delete('/{furMeet}', [App\Http\Controllers\Admin\Furmeets\FurMeetController::class, 'destroy'])->name('destroy');
    });

    // Settings routes
    Route::prefix('/settings')->name('settings.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\Settings\SettingsController::class, 'index'])->name('index');
        
        Route::get('/status', [App\Http\Controllers\Admin\Settings\StatusController::class, 'edit'])->name('status.edit');
        Route::put('/status', [App\Http\Controllers\Admin\Settings\StatusController::class, 'update'])->name('status.update');
        
        Route::get('/reglement', [App\Http\Controllers\Admin\Settings\ReglementController::class, 'edit'])->name('reglement.edit');
        Route::put('/reglement', [App\Http\Controllers\Admin\Settings\ReglementController::class, 'update'])->name('reglement.update');
        
        Route::get('/cgu', [App\Http\Controllers\Admin\Settings\CguController::class, 'edit'])->name('cgu.edit');
        Route::put('/cgu', [App\Http\Controllers\Admin\Settings\CguController::class, 'update'])->name('cgu.update');
        
        Route::get('/rgpd', [App\Http\Controllers\Admin\Settings\RgpdController::class, 'edit'])->name('rgpd.edit');
        Route::put('/rgpd', [App\Http\Controllers\Admin\Settings\RgpdController::class, 'update'])->name('rgpd.update');
    });
    
    // Staff management routes
    Route::prefix('/staff')->name('staff.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\Staff\StaffController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\Admin\Staff\StaffController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\Admin\Staff\StaffController::class, 'store'])->name('store');
        Route::get('/{staff}/edit', [App\Http\Controllers\Admin\Staff\StaffController::class, 'edit'])->name('edit');
        Route::post('/{staff}', [App\Http\Controllers\Admin\Staff\StaffController::class, 'update'])->name('update');
        Route::put('/{staff}', [App\Http\Controllers\Admin\Staff\StaffController::class, 'update']);
        Route::patch('/{staff}', [App\Http\Controllers\Admin\Staff\StaffController::class, 'update']);
        Route::post('/{staff}/regenerate-password', [App\Http\Controllers\Admin\Staff\StaffController::class, 'regeneratePassword'])->name('regenerate-password');
        Route::delete('/{staff}', [App\Http\Controllers\Admin\Staff\StaffController::class, 'destroy'])->name('destroy');
        });

    // Products management routes
    Route::resource('/products', App\Http\Controllers\Admin\Shop\ProductController::class)->names([
        'index' => 'products.index',
        'create' => 'products.create',
        'store' => 'products.store',
        'show' => 'products.show',
        'edit' => 'products.edit',
        'update' => 'products.update',
        'destroy' => 'products.destroy',
    ]);

    // Orders management routes
    Route::resource('/orders', App\Http\Controllers\Admin\Shop\OrderController::class)->names([
        'index' => 'orders.index',
        'create' => 'orders.create',
        'store' => 'orders.store',
        'show' => 'orders.show',
        'edit' => 'orders.edit',
        'update' => 'orders.update',
        'destroy' => 'orders.destroy',
    ])->only(['index','show','update']);

    // Invoices management routes
    Route::resource('/invoices', App\Http\Controllers\Admin\InvoiceController::class)->names([
        'index' => 'invoices.index',
        'show' => 'invoices.show',
    ])->only(['index','show']);
});


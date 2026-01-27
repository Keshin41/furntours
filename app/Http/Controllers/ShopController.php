<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::where('active', true);

        // Filtrer par catégorie si demandé
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $products = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Boutique', [
            'products' => $products,
            'selectedCategory' => $request->get('category', 'all'),
        ]);
    }

    public function show(Product $product)
    {
        if (!$product->active) {
            abort(404);
        }

        return Inertia::render('Shop/ProductDetail', [
            'product' => $product,
        ]);
    }
}


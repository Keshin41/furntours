<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FurMeet;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalFurMeets = FurMeet::count();
        $publishedFurMeets = FurMeet::where('is_published', true)->count();
        $draftFurMeets = FurMeet::where('is_published', false)->count();
        $recentFurMeets = FurMeet::orderBy('created_at', 'desc')->limit(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'totalFurMeets' => $totalFurMeets,
            'publishedFurMeets' => $publishedFurMeets,
            'draftFurMeets' => $draftFurMeets,
            'recentFurMeets' => $recentFurMeets,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin\Furmeets;

use App\Http\Controllers\Controller;
use App\Models\FurMeet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FurMeetController extends Controller
{
    /**
     * Show the form for creating a new FurMeet.
     */
    public function create(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->hasPermission('manage_furmeets')) {
            return redirect()->route('admin.furmeets.index')->with('error', 'Vous n\'avez pas la permission de créer un FurMeet.');
        }

        return Inertia::render('Admin/Furmeets/CreateFurmeet');
    }

    /**
     * Store a newly created FurMeet in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->hasPermission('manage_furmeets')) {
            return redirect()->route('admin.furmeets.index')->with('error', 'Vous n\'avez pas la permission de créer un FurMeet.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:500',
            'map_embed_url' => 'nullable|string',
            'image_url' => 'nullable|url|max:255',
            'is_published' => 'boolean',
        ]);

        FurMeet::create($validated);

        return redirect()->route('admin.furmeets.index')->with('success', 'FurMeet créé avec succès!');
    }

    /**
     * Display a listing of all FurMeets for admin.
     */
    public function index()
    {
        $furMeets = FurMeet::orderBy('date', 'desc')->get();

        return Inertia::render('Admin/Furmeets/FurmeetsList', [
            'furMeets' => $furMeets,
        ]);
    }

    /**
     * Show the form for editing the specified FurMeet.
     */
    public function edit(Request $request, FurMeet $furMeet)
    {
        $user = $request->user();

        if (!$user || !$user->hasPermission('manage_furmeets')) {
            return redirect()->route('admin.furmeets.index')->with('error', 'Vous n\'avez pas la permission de modifier ce FurMeet.');
        }

        return Inertia::render('Admin/Furmeets/EditFurmeet', [
            'furMeet' => $furMeet,
        ]);
    }

    /**
     * Update the specified FurMeet in storage.
     */
    public function update(Request $request, FurMeet $furMeet)
    {
        $user = $request->user();

        if (!$user || !$user->hasPermission('manage_furmeets')) {
            return redirect()->route('admin.furmeets.index')->with('error', 'Vous n\'avez pas la permission de modifier ce FurMeet.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:500',
            'map_embed_url' => 'nullable|string',
            'image_url' => 'nullable|url|max:255',
            'is_published' => 'boolean',
        ]);

        $furMeet->update($validated);

        return redirect()->route('admin.furmeets.index')->with('success', 'FurMeet mis à jour avec succès!');
    }

    /**
     * Remove the specified FurMeet from storage.
     */
    public function destroy(Request $request, FurMeet $furMeet)
    {
        $user = $request->user();

        if (!$user || !$user->hasPermission('manage_furmeets')) {
            return redirect()->route('admin.furmeets.index')->with('error', 'Vous n\'avez pas la permission de supprimer ce FurMeet.');
        }

        $furMeet->delete();

        return redirect()->route('admin.furmeets.index')->with('success', 'FurMeet supprimé avec succès!');
    }
}

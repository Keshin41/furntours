<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Cgu;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CguController extends Controller
{
    public function edit(Request $request): RedirectResponse|Response
    {
        $user = $request->user();

        if (!$user || (!$user->hasPermission('manage_settings') && $user->role_level !== 'master')) {
            return redirect()->route('admin.dashboard')->with('error', 'Vous n\'avez pas la permission d\'accéder à cette page.');
        }

        $cgu = Cgu::current();

        return Inertia::render('Admin/Settings/Cgu', [
            'cgu' => [
                'title' => $cgu->title,
                'content' => $cgu->content,
                'updated_at' => $cgu->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user || (!$user->hasPermission('manage_settings') && $user->role_level !== 'master')) {
            return redirect()->route('admin.dashboard')->with('error', 'Vous n\'avez pas la permission d\'effectuer cette action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $cgu = Cgu::current();
        $cgu->update($validated);

        return redirect()->route('admin.settings.index')->with('success', 'Les CGU ont été mises à jour avec succès.');
    }
}

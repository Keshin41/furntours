<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Rgpd;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RgpdController extends Controller
{
    public function edit(Request $request): RedirectResponse|Response
    {
        $user = $request->user();

        if (!$user || (!$user->hasPermission('manage_settings') && $user->role_level !== 'master')) {
            return redirect()->route('admin.dashboard')->with('error', 'Vous n\'avez pas la permission d\'accéder à cette page.');
        }

        $rgpd = Rgpd::current();

        return Inertia::render('Admin/Settings/Rgpd', [
            'rgpd' => [
                'title' => $rgpd->title,
                'content' => $rgpd->content,
                'updated_at' => $rgpd->updated_at?->toDateTimeString(),
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

        $rgpd = Rgpd::current();
        $rgpd->update($validated);

        return redirect()->route('admin.settings.index')->with('success', 'La politique RGPD a été mise à jour avec succès.');
    }
}

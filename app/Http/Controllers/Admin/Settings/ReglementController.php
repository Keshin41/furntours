<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Reglement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReglementController extends Controller
{
    public function edit(): Response
    {
        $reglement = Reglement::current();

        return Inertia::render('Admin/Settings/Reglement', [
            'reglement' => [
                'title' => $reglement->title,
                'content' => $reglement->content,
                'updated_at' => $reglement->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $reglement = Reglement::current();
        $reglement->update($validated);

        return redirect()->route('admin.settings.index')->with('success', 'Règlement intérieur mis à jour avec succès.');
    }
}

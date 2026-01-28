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
    public function edit(): RedirectResponse|Response
    {
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $cgu = Cgu::current();
        $cgu->update($validated);

        return redirect()->route('admin.settings.index')->with('success', 'Les CGU ont été mises à jour avec succès.');
    }
}

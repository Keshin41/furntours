<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Status;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StatusController extends Controller
{
    public function edit(): Response
    {
        $status = Status::current();

        return Inertia::render('Admin/Settings/Status', [
            'status' => [
                'title' => $status->title,
                'content' => $status->content,
                'updated_at' => $status->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $status = Status::current();
        $status->update($validated);

        return redirect()->route('admin.settings.index')->with('success', 'Status mis à jour avec succès.');
    }
}

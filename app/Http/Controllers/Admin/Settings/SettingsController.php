<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Check if user has permission (master always has it)
        if (!$user || ($user->role_level !== 'master' && !$user->hasPermission('manage_settings'))) {
            return redirect()->route('admin.dashboard')
                ->with('error', 'Vous n\'avez pas les permissions pour accéder aux paramètres.');
        }

        return Inertia::render('Admin/Settings/SettingsIndex');
    }
}

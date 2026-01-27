<?php

namespace App\Http\Controllers\Admin\Staff;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StaffController extends Controller
{
    /**
     * Get role level hierarchy (higher number = more privileges)
     */
    private function getRoleLevel(string $roleLevel): int
    {
        return match($roleLevel) {
            'master' => 4,
            'admin' => 3,
            'moderator' => 2,
            'user' => 1,
            default => 0,
        };
    }

    /**
     * Get available permissions based on current user's role level.
     */
    private function getAvailablePermissions($currentUser): array
    {
        $allPermissions = [
            'manage_users' => 'Gérer les utilisateurs',
            'manage_products' => 'Gérer les produits',
            'manage_orders' => 'Gérer les commandes',
            'manage_furmeets' => 'Gérer les furmeets',
            'manage_content' => 'Gérer le contenu',
            'manage_settings' => 'Gérer les paramètres',
            'view_statistics' => 'Voir les statistiques',
        ];

        return array_filter(
            $allPermissions,
            fn($permission) => $currentUser->role_level === 'master' || $currentUser->hasPermission($permission),
            ARRAY_FILTER_USE_KEY
        );
    }


    /**
     * Display a listing of staff members.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $currentUserLevel = $this->getRoleLevel($currentUser->role_level ?? 'user');

        // Check if user has permission (master always has it)
        if ($currentUser->role_level !== 'master' && !$currentUser->hasPermission('manage_users')) {
            return redirect()->route('admin.dashboard')
                ->with('error', 'Vous n\'avez pas les permissions pour gérer les utilisateurs.');
        }

        // Master sees everyone
        if ($currentUserLevel === 4 || $currentUser->role_level === 'master') {
            $staff = User::orderBy('staff_order')
                        ->orderBy('name')
                        ->get();
        } else {
            // Others see only users of equal or lower level
            $staff = User::query()
                ->where(function($query) use ($currentUserLevel) {
                    foreach (['user', 'moderator', 'admin', 'master'] as $role) {
                        if ($this->getRoleLevel($role) <= $currentUserLevel) {
                            $query->orWhere('role_level', $role)
                                  ->orWhereNull('role_level');
                        }
                    }
                })
                ->orderBy('staff_order')
                ->orderBy('name')
                ->get();
        }
        
        $availablePermissions = [
            'manage_users' => 'Gérer les utilisateurs',
            'manage_products' => 'Gérer les produits',
            'manage_orders' => 'Gérer les commandes',
            'manage_furmeets' => 'Gérer les furmeets',
            'manage_content' => 'Gérer le contenu',
            'manage_settings' => 'Gérer les paramètres',
            'view_statistics' => 'Voir les statistiques',
        ];

        return Inertia::render('Admin/Staff/StaffList', [
            'staff' => $staff,
            'availablePermissions' => $availablePermissions,
            'userLevel' => $currentUser->role_level === 'master' ? 'master' : ($currentUser->role_level ?? 'user'),
        ]);
    }

    /**
     * Show the form for creating a new staff member.
     */
    public function create(Request $request)
    {
        $currentUser = $request->user();
        $currentUserLevel = $this->getRoleLevel($currentUser->role_level ?? 'user');

        // Check if user has permission (master always has it)
        if ($currentUser->role_level !== 'master' && !$currentUser->hasPermission('manage_users')) {
            return redirect()->route('admin.staff.index')
                ->with('error', 'Vous n\'avez pas les permissions pour créer un utilisateur.');
        }

        // Get available role levels for current user (can only create users with lower level)
        $availableRoleLevels = [];
        foreach (['user', 'moderator', 'admin', 'master'] as $role) {
            if ($this->getRoleLevel($role) < $currentUserLevel || $currentUser->role_level === 'master') {
                $availableRoleLevels[] = $role;
            }
        }

        return Inertia::render('Admin/Staff/CreateStaff', [
            'availableRoleLevels' => $availableRoleLevels,
        ]);
    }

    /**
     * Store a newly created staff member in storage.
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();
        $currentUserLevel = $this->getRoleLevel($currentUser->role_level ?? 'user');

        // Check if user has permission (master always has it)
        if ($currentUser->role_level !== 'master' && !$currentUser->hasPermission('manage_users')) {
            return redirect()->route('admin.staff.index')
                ->with('error', 'Vous n\'avez pas les permissions pour créer un utilisateur.');
        }

        $requestedLevel = $this->getRoleLevel($request->input('role_level', 'user'));

        // Check if user can create this role level
        if ($currentUser->role_level !== 'master' && $requestedLevel >= $currentUserLevel) {
            return redirect()->back()
                ->withErrors(['role_level' => 'Vous ne pouvez pas créer un utilisateur de niveau égal ou supérieur au vôtre.']);
        }

        // Ensure is_staff_visible is treated as boolean (default to true for new staff)
        if (!$request->has('is_visible')) {
            $request->merge(['is_staff_visible' => true]);
        } else {
            $request->merge(['is_staff_visible' => $request->boolean('is_visible')]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'nullable|string|max:255',
            'role_level' => 'required|in:user,moderator,admin,master',
            'permissions' => 'nullable|array',
            'is_staff_visible' => 'nullable|boolean',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'nullable|string',
            'social_links.*.url' => 'nullable|url',
            'staff_order' => 'nullable|integer',
        ], [
            'name.required' => 'Le nom est obligatoire.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'L\'email n\'est pas valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'role.required' => 'Le rôle est obligatoire.',
            'role.max' => 'Le rôle ne peut pas dépasser 255 caractères.',
            'role_level.required' => 'Le niveau de rôle est obligatoire.',
            'role_level.in' => 'Le niveau de rôle doit être moderator ou admin.',
            'photo.image' => 'Le fichier doit être une image.',
            'photo.mimes' => 'L\'image doit être au format JPEG, JPG, PNG ou GIF.',
            'photo.max' => 'L\'image ne doit pas dépasser 2 Mo.',
            'social_links.*.url' => 'L\'URL du réseau social n\'est pas valide.',
            'staff_order.integer' => 'L\'ordre doit être un nombre entier.',
        ]);

        // Create user with temporary password
        $temporaryPassword = Str::random(12);
        
        // Handle photo upload
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('staff', 'public');
            $validated['photo'] = $path;
        }

        // Clean up social links
        if (isset($validated['social_links'])) {
            $validated['social_links'] = array_filter($validated['social_links'], function($link) {
                return !empty($link['platform']) && !empty($link['url']);
            });
        }

        // Create the user with staff fields
        $validated['password'] = Hash::make($temporaryPassword);
        $validated['force_password_change'] = true;

        User::create($validated);

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Membre du staff créé avec succès!')
            ->with('temporaryPassword', $temporaryPassword);
    }

    /**
     * Show the form for editing the specified staff member.
     */
    public function edit(Request $request, User $staff)
    {
        $currentUser = $request->user();
        $currentUserLevel = $this->getRoleLevel($currentUser->role_level ?? 'user');
        $staffLevel = $this->getRoleLevel($staff->role_level ?? 'user');

        // Check if user has permission (master always has it)
        if ($currentUser->role_level !== 'master' && !$currentUser->hasPermission('manage_users')) {
            return redirect()->route('admin.staff.index')
                ->with('error', 'Vous n\'avez pas les permissions pour éditer les utilisateurs.');
        }

        // Can only edit users with lower role level (except master can edit everyone)
        if ($currentUser->role_level !== 'master' && $staffLevel >= $currentUserLevel) {
            return redirect()->route('admin.staff.index')
                ->with('error', 'Vous ne pouvez pas modifier un utilisateur de niveau égal ou supérieur.');
        }


        $availablePermissions = $this->getAvailablePermissions($currentUser);
        
        // Get available role levels for current user
        $availableRoleLevels = [];
        foreach (['user', 'moderator', 'admin', 'master'] as $role) {
            if ($this->getRoleLevel($role) < $currentUserLevel || $currentUser->role_level === 'master') {
                $availableRoleLevels[] = $role;
            }
        }

        return Inertia::render('Admin/Staff/EditStaff', [
            'staff' => $staff,
            'availablePermissions' => $availablePermissions,
            'availableRoleLevels' => $availableRoleLevels,
            'canEditRoleLevel' => $currentUser->role_level === 'master' || $staffLevel < $currentUserLevel,
        ]);
    }

    /**
     * Update the specified staff member in storage.
     */
    public function update(Request $request, User $staff)
    {
        $currentUser = $request->user();
        $currentUserLevel = $this->getRoleLevel($currentUser->role_level ?? 'user');
        $staffLevel = $this->getRoleLevel($staff->role_level ?? 'user');

        // Check if user has permission (master always has it)
        if ($currentUser->role_level !== 'master' && !$currentUser->hasPermission('manage_users')) {
            return redirect()->route('admin.staff.index')
                ->with('error', 'Vous n\'avez pas les permissions pour modifier les utilisateurs.');
        }
        $requestedLevel = $this->getRoleLevel($request->input('role_level', $staff->role_level));

        // Check if user can edit this staff member
        if ($currentUser->role_level !== 'master' && $staffLevel >= $currentUserLevel) {
            return redirect()->route('admin.staff.index')
                ->with('error', 'Vous ne pouvez pas modifier un utilisateur de niveau égal ou supérieur.');
        }

        // Check if user can set this role level
        if ($currentUser->role_level !== 'master' && $requestedLevel >= $currentUserLevel) {
            return redirect()->back()
                ->withErrors(['role_level' => 'Vous ne pouvez pas définir un niveau égal ou supérieur au vôtre.']);
        }

        // Ensure is_staff_visible is treated as boolean
        $request->merge([
            'is_staff_visible' => $request->boolean('is_visible'),
        ]);

        $roleRule = 'required|in:user,moderator,admin,master';

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $staff->id,
            'role' => 'nullable|string|max:255',
            'role_level' => $roleRule,
            'permissions' => 'nullable|array',
            'is_staff_visible' => 'nullable|boolean',
            'photo' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'nullable|string',
            'social_links.*.url' => 'nullable|url',
            'staff_order' => 'nullable|integer',
        ], [
            'name.required' => 'Le nom est obligatoire.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'L\'email n\'est pas valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'role.required' => 'Le rôle est obligatoire.',
            'role.max' => 'Le rôle ne peut pas dépasser 255 caractères.',
            'photo.image' => 'Le fichier doit être une image.',
            'photo.mimes' => 'L\'image doit être au format JPEG, JPG, PNG ou GIF.',
            'photo.max' => 'L\'image ne doit pas dépasser 2 Mo.',
            'social_links.*.url' => 'L\'URL du réseau social n\'est pas valide.',
            'staff_order.integer' => 'L\'ordre doit être un nombre entier.',
        ]);

        // Handle photo upload - only update if a new file is provided
        if ($request->hasFile('photo')) {
            // Delete old photo
            if ($staff->photo) {
                Storage::disk('public')->delete($staff->photo);
            }
            $path = $request->file('photo')->store('staff', 'public');
            $validated['photo'] = $path;
        } else {
            // Remove photo key if no new file is uploaded to preserve existing photo
            unset($validated['photo']);
        }

        // Clean up social links
        if (isset($validated['social_links'])) {
            $validated['social_links'] = array_filter($validated['social_links'], function($link) {
                return !empty($link['platform']) && !empty($link['url']);
            });
        }

        $staff->update($validated);

        return redirect()->route('admin.staff.index')->with('success', 'Membre du staff mis à jour avec succès!');
    }

    /**
     * Regenerate a temporary password for the user.
     */
    public function regeneratePassword(User $staff)
    {
        $temporaryPassword = Str::random(12);

        $staff->update([
            'password' => Hash::make($temporaryPassword),
            'force_password_change' => true,
            'password_changed_at' => null,
        ]);

        return redirect()
            ->route('admin.staff.index')
            ->with('success', 'Mot de passe temporaire régénéré avec succès!')
            ->with('temporaryPassword', $temporaryPassword);
    }

    /**
     * Remove the specified staff member from storage.
     */
    public function destroy(Request $request, User $staff)
    {
        $currentUser = $request->user();

        // Check if user has permission (master always has it)
        if ($currentUser->role_level !== 'master' && !$currentUser->hasPermission('manage_users')) {
            return redirect()->route('admin.staff.index')
                ->with('error', 'Vous n\'avez pas les permissions pour supprimer les utilisateurs.');
        }
        if ($staff->role_level === 'master') {
            return redirect()->back()->with('error', 'Impossible de supprimer le compte master.');
        }

        // Delete photo
        if ($staff->photo) {
            Storage::disk('public')->delete($staff->photo);
        }

        $staff->delete();

        return redirect()->route('admin.staff.index')->with('success', 'Membre du staff supprimé avec succès!');
    }
}

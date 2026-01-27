<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckStaffPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (!$user) {
        return redirect()->route('admin.auth.login');
        }

        // Vérifier si l'utilisateur est un membre du staff
        if (!$user->role_level || $user->role_level === 'user') {
            abort(403, 'Accès refusé : Vous n\'êtes pas membre du staff.');
        }

        // Vérifier la permission
        if (!$user->hasPermission($permission)) {
            abort(403, 'Accès refusé : Vous n\'avez pas les permissions nécessaires.');
        }

        return $next($request);
    }
}

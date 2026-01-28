<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForcePasswordChange
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Skip for password change routes and logout
        if ($request->is('admin/change-password') || $request->is('admin/logout')) {
            return $next($request);
        }

        // If user exists and needs password change, redirect to change password page
        if ($user && method_exists($user, 'needsPasswordChange') && $user->needsPasswordChange()) {
            return redirect('/admin/change-password');
        }

        return $next($request);
    }
}

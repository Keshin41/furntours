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

        // Skip for password change routes
        if ($request->is('admin/change-password') || $request->is('admin/logout')) {
            return $next($request);
        }

        // If user needs password change, redirect
        if ($user && $user->needsPasswordChange()) {
            return redirect('/admin/change-password');
        }

        return $next($request);
    }
}

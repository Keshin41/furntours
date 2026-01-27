<?php

namespace App\Http\Controllers;

use App\Models\Rgpd;
use Inertia\Inertia;
use Inertia\Response;

class RgpdController extends Controller
{
    public function show(): Response
    {
        $rgpd = Rgpd::current();

        return Inertia::render('Rgpd', [
            'rgpd' => [
                'title' => $rgpd->title,
                'content' => $rgpd->content,
                'updated_at' => $rgpd->updated_at?->toDateTimeString(),
            ],
        ]);
    }
}

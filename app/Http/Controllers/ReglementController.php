<?php

namespace App\Http\Controllers;

use App\Models\Reglement;
use Inertia\Inertia;
use Inertia\Response;

class ReglementController extends Controller
{
    public function show(): Response
    {
        $reglement = Reglement::current();

        return Inertia::render('Reglement', [
            'reglement' => [
                'title' => $reglement->title,
                'content' => $reglement->content,
                'updated_at' => $reglement->updated_at?->toDateTimeString(),
            ],
        ]);
    }
}

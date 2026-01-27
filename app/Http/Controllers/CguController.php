<?php

namespace App\Http\Controllers;

use App\Models\Cgu;
use Inertia\Inertia;
use Inertia\Response;

class CguController extends Controller
{
    public function show(): Response
    {
        $cgu = Cgu::current();

        return Inertia::render('Cgu', [
            'cgu' => [
                'title' => $cgu->title,
                'content' => $cgu->content,
                'updated_at' => $cgu->updated_at?->toDateTimeString(),
            ],
        ]);
    }
}

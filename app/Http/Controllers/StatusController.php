<?php

namespace App\Http\Controllers;

use App\Models\Status;
use Inertia\Inertia;
use Inertia\Response;

class StatusController extends Controller
{
    public function show(): Response
    {
        $status = Status::current();

        return Inertia::render('Status', [
            'status' => [
                'title' => $status->title,
                'content' => $status->content,
                'updated_at' => $status->updated_at?->toDateTimeString(),
            ],
        ]);
    }
}

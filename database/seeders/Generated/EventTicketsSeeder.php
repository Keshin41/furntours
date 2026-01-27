<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventTicketsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('event_tickets')->truncate();
        // No data to insert
    }
}
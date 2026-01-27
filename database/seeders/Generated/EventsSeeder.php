<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('events')->truncate();
        // No data to insert
    }
}
<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MembershipsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('memberships')->truncate();
        // No data to insert
    }
}
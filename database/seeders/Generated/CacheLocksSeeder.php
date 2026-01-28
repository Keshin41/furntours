<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CacheLocksSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('cache_locks')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        // No data to insert
    }
}
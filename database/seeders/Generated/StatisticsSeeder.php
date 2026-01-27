<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatisticsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('statistics')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('statistics')->insert(array (
  0 => 
  array (
    'id' => 1,
    'telegram_members' => 0,
    'association_members' => 0,
    'furmeets_count' => 0,
    'created_at' => '2026-01-22 21:24:38',
    'updated_at' => '2026-01-22 21:24:38',
  ),
));
    }
}
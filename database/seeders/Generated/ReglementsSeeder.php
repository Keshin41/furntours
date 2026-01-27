<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReglementsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('reglements')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('reglements')->insert(array (
  0 => 
  array (
    'id' => 1,
    'slug' => 'reglement-interieur',
    'title' => 'Règlement intérieur',
    'content' => '<h1>RÈGLEMENT INTÉRIEUR</h1>',
    'created_at' => '2026-01-23 22:13:32',
    'updated_at' => '2026-01-23 22:13:32',
  ),
));
    }
}
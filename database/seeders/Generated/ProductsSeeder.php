<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('products')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('products')->insert(array (
  0 => 
  array (
    'id' => 1,
    'name' => 'Paws',
    'slug' => 'paws',
    'description' => 'une belle pattoune UwU',
    'price' => '8.00',
    'stock' => 0,
    'image' => 'products/DfXz9ERbccR6aBCwnzzH2eQjGxSGJZYnlggc0dtL.png',
    'category' => 'merch',
    'active' => 1,
    'created_at' => '2026-01-22 21:33:42',
    'updated_at' => '2026-01-27 22:43:39',
  ),
));
    }
}
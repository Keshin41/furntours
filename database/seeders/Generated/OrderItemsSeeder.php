<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderItemsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('order_items')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('order_items')->insert(array (
  0 => 
  array (
    'id' => 4,
    'order_id' => 4,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 00:54:50',
    'updated_at' => '2026-01-25 00:54:50',
  ),
  1 => 
  array (
    'id' => 5,
    'order_id' => 5,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 11:47:54',
    'updated_at' => '2026-01-25 11:47:54',
  ),
  2 => 
  array (
    'id' => 6,
    'order_id' => 6,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 11:55:03',
    'updated_at' => '2026-01-25 11:55:03',
  ),
  3 => 
  array (
    'id' => 7,
    'order_id' => 7,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:00:08',
    'updated_at' => '2026-01-25 12:00:08',
  ),
  4 => 
  array (
    'id' => 8,
    'order_id' => 8,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:02:06',
    'updated_at' => '2026-01-25 12:02:06',
  ),
  5 => 
  array (
    'id' => 9,
    'order_id' => 9,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:03:55',
    'updated_at' => '2026-01-25 12:03:55',
  ),
  6 => 
  array (
    'id' => 10,
    'order_id' => 10,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:05:09',
    'updated_at' => '2026-01-25 12:05:09',
  ),
  7 => 
  array (
    'id' => 11,
    'order_id' => 11,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:06:31',
    'updated_at' => '2026-01-25 12:06:31',
  ),
  8 => 
  array (
    'id' => 12,
    'order_id' => 12,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:09:25',
    'updated_at' => '2026-01-25 12:09:25',
  ),
  9 => 
  array (
    'id' => 13,
    'order_id' => 13,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:10:47',
    'updated_at' => '2026-01-25 12:10:47',
  ),
  10 => 
  array (
    'id' => 14,
    'order_id' => 14,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:11:56',
    'updated_at' => '2026-01-25 12:11:56',
  ),
  11 => 
  array (
    'id' => 15,
    'order_id' => 15,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:14:15',
    'updated_at' => '2026-01-25 12:14:15',
  ),
  12 => 
  array (
    'id' => 16,
    'order_id' => 16,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:14:37',
    'updated_at' => '2026-01-25 12:14:37',
  ),
  13 => 
  array (
    'id' => 17,
    'order_id' => 17,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:15:43',
    'updated_at' => '2026-01-25 12:15:43',
  ),
  14 => 
  array (
    'id' => 18,
    'order_id' => 18,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:16:06',
    'updated_at' => '2026-01-25 12:16:06',
  ),
  15 => 
  array (
    'id' => 19,
    'order_id' => 19,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:20:57',
    'updated_at' => '2026-01-25 12:20:57',
  ),
  16 => 
  array (
    'id' => 20,
    'order_id' => 20,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:23:04',
    'updated_at' => '2026-01-25 12:23:04',
  ),
  17 => 
  array (
    'id' => 21,
    'order_id' => 21,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:25:17',
    'updated_at' => '2026-01-25 12:25:17',
  ),
  18 => 
  array (
    'id' => 22,
    'order_id' => 22,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:28:24',
    'updated_at' => '2026-01-25 12:28:24',
  ),
  19 => 
  array (
    'id' => 23,
    'order_id' => 23,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:29:24',
    'updated_at' => '2026-01-25 12:29:24',
  ),
  20 => 
  array (
    'id' => 24,
    'order_id' => 24,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:35:25',
    'updated_at' => '2026-01-25 12:35:25',
  ),
  21 => 
  array (
    'id' => 25,
    'order_id' => 25,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:49:39',
    'updated_at' => '2026-01-25 12:49:39',
  ),
  22 => 
  array (
    'id' => 26,
    'order_id' => 26,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 12:58:53',
    'updated_at' => '2026-01-25 12:58:53',
  ),
  23 => 
  array (
    'id' => 27,
    'order_id' => 27,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:12:53',
    'updated_at' => '2026-01-25 13:12:53',
  ),
  24 => 
  array (
    'id' => 28,
    'order_id' => 28,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:16:06',
    'updated_at' => '2026-01-25 13:16:06',
  ),
  25 => 
  array (
    'id' => 29,
    'order_id' => 29,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:24:42',
    'updated_at' => '2026-01-25 13:24:42',
  ),
  26 => 
  array (
    'id' => 30,
    'order_id' => 30,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:25:34',
    'updated_at' => '2026-01-25 13:25:34',
  ),
  27 => 
  array (
    'id' => 31,
    'order_id' => 31,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:25:49',
    'updated_at' => '2026-01-25 13:25:49',
  ),
  28 => 
  array (
    'id' => 32,
    'order_id' => 32,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:29:05',
    'updated_at' => '2026-01-25 13:29:05',
  ),
  29 => 
  array (
    'id' => 33,
    'order_id' => 33,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:31:03',
    'updated_at' => '2026-01-25 13:31:03',
  ),
  30 => 
  array (
    'id' => 34,
    'order_id' => 34,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:34:32',
    'updated_at' => '2026-01-25 13:34:32',
  ),
  31 => 
  array (
    'id' => 35,
    'order_id' => 35,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:38:44',
    'updated_at' => '2026-01-25 13:38:44',
  ),
  32 => 
  array (
    'id' => 36,
    'order_id' => 36,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:46:15',
    'updated_at' => '2026-01-25 13:46:15',
  ),
  33 => 
  array (
    'id' => 37,
    'order_id' => 37,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:47:34',
    'updated_at' => '2026-01-25 13:47:34',
  ),
  34 => 
  array (
    'id' => 38,
    'order_id' => 38,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 13:53:14',
    'updated_at' => '2026-01-25 13:53:14',
  ),
  35 => 
  array (
    'id' => 39,
    'order_id' => 39,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 14:26:29',
    'updated_at' => '2026-01-25 14:26:29',
  ),
  36 => 
  array (
    'id' => 40,
    'order_id' => 40,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 14:27:52',
    'updated_at' => '2026-01-25 14:27:52',
  ),
  37 => 
  array (
    'id' => 41,
    'order_id' => 41,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 14:31:33',
    'updated_at' => '2026-01-25 14:31:33',
  ),
  38 => 
  array (
    'id' => 42,
    'order_id' => 42,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 14:32:49',
    'updated_at' => '2026-01-25 14:32:49',
  ),
  39 => 
  array (
    'id' => 43,
    'order_id' => 43,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 14:34:19',
    'updated_at' => '2026-01-25 14:34:19',
  ),
  40 => 
  array (
    'id' => 44,
    'order_id' => 44,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 14:35:46',
    'updated_at' => '2026-01-25 14:35:46',
  ),
  41 => 
  array (
    'id' => 45,
    'order_id' => 45,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-25 14:36:19',
    'updated_at' => '2026-01-25 14:36:19',
  ),
  42 => 
  array (
    'id' => 46,
    'order_id' => 46,
    'product_id' => 1,
    'quantity' => 1,
    'price' => '8.00',
    'subtotal' => '8.00',
    'created_at' => '2026-01-27 21:27:33',
    'updated_at' => '2026-01-27 21:27:33',
  ),
  43 => 
  array (
    'id' => 47,
    'order_id' => 47,
    'product_id' => 1,
    'quantity' => 2,
    'price' => '8.00',
    'subtotal' => '16.00',
    'created_at' => '2026-01-27 22:33:07',
    'updated_at' => '2026-01-27 22:33:07',
  ),
));
    }
}
<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MigrationsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('migrations')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('migrations')->insert(array (
  0 => 
  array (
    'id' => 1,
    'migration' => '0001_01_01_000000_create_users_table',
    'batch' => 1,
  ),
  1 => 
  array (
    'id' => 2,
    'migration' => '0001_01_01_000001_create_cache_table',
    'batch' => 1,
  ),
  2 => 
  array (
    'id' => 3,
    'migration' => '0001_01_01_000002_create_jobs_table',
    'batch' => 1,
  ),
  3 => 
  array (
    'id' => 4,
    'migration' => '2025_08_14_170933_add_two_factor_columns_to_users_table',
    'batch' => 1,
  ),
  4 => 
  array (
    'id' => 5,
    'migration' => '2025_12_14_164226_create_fur_meets_table',
    'batch' => 1,
  ),
  5 => 
  array (
    'id' => 6,
    'migration' => '2025_12_14_165619_create_statistics_table',
    'batch' => 1,
  ),
  6 => 
  array (
    'id' => 7,
    'migration' => '2026_01_21_000000_create_reglements_table',
    'batch' => 1,
  ),
  7 => 
  array (
    'id' => 8,
    'migration' => '2026_01_21_000001_create_statuses_table',
    'batch' => 1,
  ),
  8 => 
  array (
    'id' => 9,
    'migration' => '2026_01_22_211821_create_products_table',
    'batch' => 1,
  ),
  9 => 
  array (
    'id' => 10,
    'migration' => '2026_01_22_211828_create_memberships_table',
    'batch' => 1,
  ),
  10 => 
  array (
    'id' => 11,
    'migration' => '2026_01_22_211834_create_events_table',
    'batch' => 1,
  ),
  11 => 
  array (
    'id' => 12,
    'migration' => '2026_01_22_211838_create_orders_table',
    'batch' => 1,
  ),
  12 => 
  array (
    'id' => 13,
    'migration' => '2026_01_22_211841_create_order_items_table',
    'batch' => 1,
  ),
  13 => 
  array (
    'id' => 14,
    'migration' => '2026_01_22_211847_create_payments_table',
    'batch' => 1,
  ),
  14 => 
  array (
    'id' => 15,
    'migration' => '2026_01_22_211851_create_invoices_table',
    'batch' => 1,
  ),
  15 => 
  array (
    'id' => 16,
    'migration' => '2026_01_22_211941_create_event_ticket_reservations_table',
    'batch' => 1,
  ),
  16 => 
  array (
    'id' => 17,
    'migration' => '2026_01_23_000000_create_cgus_table',
    'batch' => 1,
  ),
  17 => 
  array (
    'id' => 18,
    'migration' => '2026_01_23_000001_create_rgpds_table',
    'batch' => 1,
  ),
  18 => 
  array (
    'id' => 19,
    'migration' => '2026_01_23_161004_add_permissions_to_staff_table',
    'batch' => 1,
  ),
  19 => 
  array (
    'id' => 20,
    'migration' => '2026_01_23_161734_add_force_password_change_to_users_table',
    'batch' => 1,
  ),
  20 => 
  array (
    'id' => 21,
    'migration' => '2026_01_23_195624_drop_staff_table',
    'batch' => 1,
  ),
  21 => 
  array (
    'id' => 22,
    'migration' => '2026_01_23_200000_merge_staff_into_users',
    'batch' => 1,
  ),
  22 => 
  array (
    'id' => 23,
    'migration' => '2026_01_25_003900_update_orders_table_for_guest_customers',
    'batch' => 2,
  ),
));
    }
}
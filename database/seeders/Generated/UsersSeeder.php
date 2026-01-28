<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('users')->insert(array (
  0 => 
  array (
    'id' => 6,
    'name' => 'LytØrphan',
    'email' => 'test1@gmail.com',
    'role' => 'user',
    'role_level' => 'moderator',
    'permissions' => '["manage_users", "manage_products", "manage_orders", "manage_furmeets", "manage_content", "view_statistics"]',
    'photo' => 'staff/dbiOgRqStmO7BAj19aQEdla1B1qqYioDHWPAeuzV.jpg',
    'social_links' => NULL,
    'staff_order' => 1,
    'is_staff_visible' => 1,
    'email_verified_at' => NULL,
    'password' => '$2y$12$i6CucAP2whZdKUJvy6LNsupy5.lvYyzdoqA0FGaTqa1F5ceFNDR7m',
    'force_password_change' => 1,
    'password_changed_at' => NULL,
    'two_factor_secret' => NULL,
    'two_factor_recovery_codes' => NULL,
    'two_factor_confirmed_at' => NULL,
    'remember_token' => 'DioY6q8lhLolImYb8EykCwJvGaAcAPygPrDyLod5zJJwwRvkBkK3cjy9Fg8x',
    'created_at' => '2026-01-23 17:07:21',
    'updated_at' => '2026-01-23 21:28:44',
  ),
  1 => 
  array (
    'id' => 7,
    'name' => 'Ush',
    'email' => 'master@furntours.local',
    'role' => 'Dev',
    'role_level' => 'master',
    'permissions' => NULL,
    'photo' => 'staff/bKerwGUGd4laBjvy7Ju4iq7UsuIovUTLc8xxUtkD.jpg',
    'social_links' => NULL,
    'staff_order' => -1,
    'is_staff_visible' => 0,
    'email_verified_at' => NULL,
    'password' => '$2y$12$xMP8oROwoPxEJrL3mVMsS.BagyDVehDDTgdltpm0gAj6QhH9qJMKa',
    'force_password_change' => 0,
    'password_changed_at' => NULL,
    'two_factor_secret' => NULL,
    'two_factor_recovery_codes' => NULL,
    'two_factor_confirmed_at' => NULL,
    'remember_token' => '6djZcY1TO9kMZEPe43V4lclYTEUZKwovHYMGEUBNPx98PVdjlW0tqAu5C4Je',
    'created_at' => '2026-01-23 17:15:59',
    'updated_at' => '2026-01-23 21:59:15',
  ),
  2 => 
  array (
    'id' => 8,
    'name' => 'Vikari',
    'email' => 'vika@gmail.com',
    'role' => 'user',
    'role_level' => 'moderator',
    'permissions' => '["manage_users", "manage_products", "manage_orders", "manage_furmeets", "manage_content", "view_statistics"]',
    'photo' => 'staff/Gfkc1pAT6DlrvLtNjCEOHjW5kFao8rWiFs7so5Je.jpg',
    'social_links' => NULL,
    'staff_order' => 3,
    'is_staff_visible' => 1,
    'email_verified_at' => NULL,
    'password' => '$2y$12$emSt6EnTxj8WNCn4e5vUv.ZGYvQ5fyuyjtJEmYMXWEoqiYM.p3ll6',
    'force_password_change' => 1,
    'password_changed_at' => NULL,
    'two_factor_secret' => NULL,
    'two_factor_recovery_codes' => NULL,
    'two_factor_confirmed_at' => NULL,
    'remember_token' => NULL,
    'created_at' => '2026-01-23 17:17:51',
    'updated_at' => '2026-01-23 21:29:17',
  ),
  3 => 
  array (
    'id' => 9,
    'name' => 'Bluepaw',
    'email' => 'blue@gmail.com',
    'role' => 'Présidente',
    'role_level' => 'moderator',
    'permissions' => '["manage_users", "manage_orders", "manage_furmeets", "view_statistics", "manage_content", "manage_products"]',
    'photo' => 'staff/A7543hQVh44rcKwwAelIHKCMK0IbBZBBs2lTsSsA.gif',
    'social_links' => NULL,
    'staff_order' => 0,
    'is_staff_visible' => 1,
    'email_verified_at' => NULL,
    'password' => '$2y$12$Q6kXxMceXNaTciCyUQqyKuyPqq3DlKjT.4dHqlcG0S7ghaKj4Ewoa',
    'force_password_change' => 0,
    'password_changed_at' => '2026-01-23 17:56:54',
    'two_factor_secret' => NULL,
    'two_factor_recovery_codes' => NULL,
    'two_factor_confirmed_at' => NULL,
    'remember_token' => 'DH7jiaz9cVTeu2lgGBaXfzbefGTpOtWwMKYlOXY7RlsC4L6mH2RNf19LSPjj',
    'created_at' => '2026-01-23 17:20:45',
    'updated_at' => '2026-01-28 01:24:14',
  ),
  4 => 
  array (
    'id' => 10,
    'name' => 'Pandarch',
    'email' => 'panda@gmail.com',
    'role' => 'user',
    'role_level' => 'moderator',
    'permissions' => '["manage_users", "manage_products", "manage_orders", "manage_furmeets", "manage_content", "view_statistics"]',
    'photo' => 'staff/HhKBiLpDQ74Vl9d7KdRziK9sCasCYDT2SbXMb7dE.jpg',
    'social_links' => NULL,
    'staff_order' => 2,
    'is_staff_visible' => 1,
    'email_verified_at' => NULL,
    'password' => '$2y$12$NWBcCvm9eN7bv8O1uQPgrusX0dKDt1OLeMr2jGE9X8A5Ofq4R2ROa',
    'force_password_change' => 1,
    'password_changed_at' => NULL,
    'two_factor_secret' => NULL,
    'two_factor_recovery_codes' => NULL,
    'two_factor_confirmed_at' => NULL,
    'remember_token' => 'PULZa6mqLWm5lDKCfDhuZ57fZC5hXjcrGxEFPspXIRcb6VI3lfdvetqWuWY2',
    'created_at' => '2026-01-23 17:22:44',
    'updated_at' => '2026-01-23 21:29:26',
  ),
));
    }
}
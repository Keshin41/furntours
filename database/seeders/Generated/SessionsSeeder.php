<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SessionsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('sessions')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('sessions')->insert(array (
  0 => 
  array (
    'id' => '2YibFstFY420JKkU1J3pyVPBFyIDgaVWloviLray',
    'user_id' => 9,
    'ip_address' => '127.0.0.1',
    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0',
    'payload' => 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiR0tDZWpRajNhS29PS0s2ZW5WZkRGZnR0c0FPalJDNnBwVjJFRVZpYyI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6OTtzOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czozMzoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2FkbWluL3N0YWZmIjtzOjU6InJvdXRlIjtzOjE3OiJhZG1pbi5zdGFmZi5pbmRleCI7fX0=',
    'last_activity' => 1769557741,
  ),
  1 => 
  array (
    'id' => 'GvxIY6zPtGUHwhlD325FEFWI1tTTUelQa8oW36qo',
    'user_id' => NULL,
    'ip_address' => '127.0.0.1',
    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0',
    'payload' => 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTlN2clVMNkZZeU9Odm1tcnk2aXJnZ3Z1NGtsT0pyWFRlNkJEUDkzbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hZG1pbi9sb2dpbiI7czo1OiJyb3V0ZSI7czoxNjoiYWRtaW4uYXV0aC5sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',
    'last_activity' => 1769555027,
  ),
  2 => 
  array (
    'id' => 'MIuFNOpypikniMlLZYrZTcjvZk2kFlhkUAx9g6Pj',
    'user_id' => NULL,
    'ip_address' => '127.0.0.1',
    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0',
    'payload' => 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYVZQTnFKWHRnRjh3T0FYRlB2djZCVXNzQndZSFpqYU94N2lUM1lacSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hZG1pbi9wcm9maWxlIjtzOjU6InJvdXRlIjtzOjEzOiJhZG1pbi5wcm9maWxlIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',
    'last_activity' => 1769555026,
  ),
  3 => 
  array (
    'id' => 'rZ5UaHgdYdWUyXn4rIqSOotBR0xdDuINlg999CMN',
    'user_id' => NULL,
    'ip_address' => '127.0.0.1',
    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0',
    'payload' => 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRjlvN0JEempoNTUwQ2JSTEY5UnlyR09FUHJRMHZaclMyaG9RSUdUZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9pbnZvaWNlLzgvZG93bmxvYWQiO3M6NToicm91dGUiO3M6MTY6Imludm9pY2UuZG93bmxvYWQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',
    'last_activity' => 1769549887,
  ),
));
    }
}
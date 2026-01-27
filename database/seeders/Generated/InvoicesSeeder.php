<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InvoicesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('invoices')->truncate();
        // No data to insert
    }
}
<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InvoicesSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('invoices')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('invoices')->insert(array (
  0 => 
  array (
    'id' => 1,
    'order_id' => 27,
    'invoice_number' => 'INV-2026-00027',
    'pdf_path' => 'invoices/invoice-27-1769346790.pdf',
    'issued_at' => '2026-01-25 13:13:10',
    'created_at' => '2026-01-25 13:13:10',
    'updated_at' => '2026-01-25 13:13:10',
  ),
  1 => 
  array (
    'id' => 2,
    'order_id' => 33,
    'invoice_number' => 'INV-2026-00033',
    'pdf_path' => 'invoices/invoice-33-1769347935.pdf',
    'issued_at' => '2026-01-25 13:32:15',
    'created_at' => '2026-01-25 13:32:15',
    'updated_at' => '2026-01-25 13:32:15',
  ),
  2 => 
  array (
    'id' => 3,
    'order_id' => 7,
    'invoice_number' => 'INV-2026-00007',
    'pdf_path' => 'invoices/invoice-7-1769349985.pdf',
    'issued_at' => '2026-01-25 14:06:25',
    'created_at' => '2026-01-25 14:06:25',
    'updated_at' => '2026-01-25 14:06:25',
  ),
  3 => 
  array (
    'id' => 4,
    'order_id' => 8,
    'invoice_number' => 'INV-2026-00008',
    'pdf_path' => 'invoices/invoice-8-1769350220.pdf',
    'issued_at' => '2026-01-25 14:10:20',
    'created_at' => '2026-01-25 14:10:20',
    'updated_at' => '2026-01-25 14:10:20',
  ),
  4 => 
  array (
    'id' => 5,
    'order_id' => 39,
    'invoice_number' => 'INV-2026-00039',
    'pdf_path' => 'invoices/invoice-39-1769351211.pdf',
    'issued_at' => '2026-01-25 14:26:51',
    'created_at' => '2026-01-25 14:26:51',
    'updated_at' => '2026-01-25 14:26:51',
  ),
  5 => 
  array (
    'id' => 6,
    'order_id' => 41,
    'invoice_number' => 'INV-2026-00041',
    'pdf_path' => 'invoices/invoice-41-1769351517.pdf',
    'issued_at' => '2026-01-25 14:31:57',
    'created_at' => '2026-01-25 14:31:57',
    'updated_at' => '2026-01-25 14:31:57',
  ),
  6 => 
  array (
    'id' => 7,
    'order_id' => 42,
    'invoice_number' => 'INV-2026-00042',
    'pdf_path' => 'invoices/invoice-42-1769351593.pdf',
    'issued_at' => '2026-01-25 14:33:13',
    'created_at' => '2026-01-25 14:33:13',
    'updated_at' => '2026-01-25 14:33:13',
  ),
  7 => 
  array (
    'id' => 8,
    'order_id' => 44,
    'invoice_number' => 'INV-2026-00044',
    'pdf_path' => 'private/invoices/invoice-44-1769552272.pdf',
    'issued_at' => '2026-01-25 14:36:02',
    'created_at' => '2026-01-25 14:36:02',
    'updated_at' => '2026-01-27 22:17:52',
  ),
  8 => 
  array (
    'id' => 9,
    'order_id' => 45,
    'invoice_number' => 'INV-2026-00045',
    'pdf_path' => 'invoices/invoice-45-1769351796.pdf',
    'issued_at' => '2026-01-25 14:36:36',
    'created_at' => '2026-01-25 14:36:36',
    'updated_at' => '2026-01-25 14:36:36',
  ),
  9 => 
  array (
    'id' => 10,
    'order_id' => 46,
    'invoice_number' => 'INV-2026-00046',
    'pdf_path' => 'private/invoices/invoice-46-1769549274.pdf',
    'issued_at' => '2026-01-27 21:27:54',
    'created_at' => '2026-01-27 21:27:54',
    'updated_at' => '2026-01-27 21:27:54',
  ),
  10 => 
  array (
    'id' => 11,
    'order_id' => 43,
    'invoice_number' => 'INV-2026-00043',
    'pdf_path' => 'private/invoices/invoice-43-1769549731.pdf',
    'issued_at' => '2026-01-27 21:35:32',
    'created_at' => '2026-01-27 21:35:32',
    'updated_at' => '2026-01-27 21:35:32',
  ),
  11 => 
  array (
    'id' => 14,
    'order_id' => 47,
    'invoice_number' => 'INV-2026-00047',
    'pdf_path' => 'private/invoices/invoice-47-1769553207.pdf',
    'issued_at' => '2026-01-27 22:33:27',
    'created_at' => '2026-01-27 22:33:27',
    'updated_at' => '2026-01-27 22:33:27',
  ),
));
    }
}
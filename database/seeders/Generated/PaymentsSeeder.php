<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('payments')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('payments')->insert(array (
  0 => 
  array (
    'id' => 1,
    'order_id' => 21,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StSNWCbjG9rbkqT0IyMd0b4',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 12:25:41',
    'metadata' => NULL,
    'created_at' => '2026-01-25 12:25:41',
    'updated_at' => '2026-01-25 12:25:41',
  ),
  1 => 
  array (
    'id' => 2,
    'order_id' => 22,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StSQWCbjG9rbkqT0odxFCoS',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 12:28:41',
    'metadata' => NULL,
    'created_at' => '2026-01-25 12:28:41',
    'updated_at' => '2026-01-25 12:28:41',
  ),
  2 => 
  array (
    'id' => 3,
    'order_id' => 23,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StSRVCbjG9rbkqT1hcPozcN',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 12:29:44',
    'metadata' => NULL,
    'created_at' => '2026-01-25 12:29:44',
    'updated_at' => '2026-01-25 12:29:44',
  ),
  3 => 
  array (
    'id' => 4,
    'order_id' => 24,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StSXKCbjG9rbkqT0dVv1iml',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 12:35:44',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1StSXaCbjG9rbkqTA7SjETBT"}',
    'created_at' => '2026-01-25 12:35:44',
    'updated_at' => '2026-01-25 12:35:44',
  ),
  4 => 
  array (
    'id' => 5,
    'order_id' => 25,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StSl6CbjG9rbkqT1LpRaW7C',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 12:51:45',
    'metadata' => NULL,
    'created_at' => '2026-01-25 12:51:45',
    'updated_at' => '2026-01-25 12:51:45',
  ),
  5 => 
  array (
    'id' => 6,
    'order_id' => 26,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StSu2CbjG9rbkqT0Izg7a5K',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 12:59:10',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1StSuGCbjG9rbkqTfGoAuvIU"}',
    'created_at' => '2026-01-25 12:59:10',
    'updated_at' => '2026-01-25 12:59:10',
  ),
  6 => 
  array (
    'id' => 7,
    'order_id' => 27,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StT7aCbjG9rbkqT008vGCI8',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 13:13:10',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1StT7oCbjG9rbkqTYR1weXA8"}',
    'created_at' => '2026-01-25 13:13:10',
    'updated_at' => '2026-01-25 13:13:10',
  ),
  7 => 
  array (
    'id' => 8,
    'order_id' => 33,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StTPACbjG9rbkqT15F1FXsl',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 13:32:15',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1StTQHCbjG9rbkqTOeje2QED"}',
    'created_at' => '2026-01-25 13:32:15',
    'updated_at' => '2026-01-25 13:32:15',
  ),
  8 => 
  array (
    'id' => 9,
    'order_id' => 7,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StTx0CbjG9rbkqT0ICXJeZD',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 14:06:25',
    'metadata' => NULL,
    'created_at' => '2026-01-25 14:06:25',
    'updated_at' => '2026-01-25 14:06:25',
  ),
  9 => 
  array (
    'id' => 10,
    'order_id' => 8,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StU0kCbjG9rbkqT14iSjW3B',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 14:10:20',
    'metadata' => NULL,
    'created_at' => '2026-01-25 14:10:20',
    'updated_at' => '2026-01-25 14:10:20',
  ),
  10 => 
  array (
    'id' => 11,
    'order_id' => 39,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StUGnCbjG9rbkqT1rO287k5',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 14:26:50',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1StUH6CbjG9rbkqTa2AIQzBZ"}',
    'created_at' => '2026-01-25 14:26:50',
    'updated_at' => '2026-01-25 14:26:50',
  ),
  11 => 
  array (
    'id' => 12,
    'order_id' => 40,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StUI9CbjG9rbkqT1nxoa1Y6',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 14:28:16',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1StUIUCbjG9rbkqTaAVSWRLX"}',
    'created_at' => '2026-01-25 14:28:16',
    'updated_at' => '2026-01-25 14:28:16',
  ),
  12 => 
  array (
    'id' => 13,
    'order_id' => 41,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StULiCbjG9rbkqT1RBRIu3I',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 14:31:57',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1StUM3CbjG9rbkqTVdvsUuSz"}',
    'created_at' => '2026-01-25 14:31:57',
    'updated_at' => '2026-01-25 14:31:57',
  ),
  13 => 
  array (
    'id' => 14,
    'order_id' => 42,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StUMwCbjG9rbkqT19ZbzWuP',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 14:33:13',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1StUNGCbjG9rbkqTpy3v9C98"}',
    'created_at' => '2026-01-25 14:33:13',
    'updated_at' => '2026-01-25 14:33:13',
  ),
  14 => 
  array (
    'id' => 15,
    'order_id' => 44,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StUPnCbjG9rbkqT0kMVsKg6',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 14:36:01',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1StUQ0CbjG9rbkqTN28s1DF4"}',
    'created_at' => '2026-01-25 14:36:01',
    'updated_at' => '2026-01-25 14:36:01',
  ),
  15 => 
  array (
    'id' => 16,
    'order_id' => 45,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3StUQKCbjG9rbkqT1QpHBbgA',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-25 14:36:36',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1StUQYCbjG9rbkqTnvdwMvwo"}',
    'created_at' => '2026-01-25 14:36:36',
    'updated_at' => '2026-01-25 14:36:36',
  ),
  16 => 
  array (
    'id' => 17,
    'order_id' => 46,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3SuJnQCbjG9rbkqT1zIQroHS',
    'amount' => '8.00',
    'status' => 'completed',
    'paid_at' => '2026-01-27 21:27:54',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1SuJngCbjG9rbkqTxHPyYRVx"}',
    'created_at' => '2026-01-27 21:27:54',
    'updated_at' => '2026-01-27 21:27:54',
  ),
  17 => 
  array (
    'id' => 18,
    'order_id' => 47,
    'payment_method' => 'stripe',
    'transaction_id' => 'pi_3SuKosCbjG9rbkqT0hShzvBt',
    'amount' => '16.00',
    'status' => 'completed',
    'paid_at' => '2026-01-27 22:33:27',
    'metadata' => '{"stripe_charge_id":null,"payment_method_id":"pm_1SuKp9CbjG9rbkqTyCbJv0mG"}',
    'created_at' => '2026-01-27 22:33:27',
    'updated_at' => '2026-01-27 22:33:27',
  ),
));
    }
}
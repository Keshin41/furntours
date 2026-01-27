<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventTicketReservationsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('event_ticket_reservations')->truncate();
        // No data to insert
    }
}
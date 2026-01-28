<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Database\Seeders\Generated\CacheSeeder;
use Database\Seeders\Generated\CacheLocksSeeder;
use Database\Seeders\Generated\CgusSeeder;
use Database\Seeders\Generated\EventTicketReservationsSeeder;
use Database\Seeders\Generated\EventsSeeder;
use Database\Seeders\Generated\FailedJobsSeeder;
use Database\Seeders\Generated\FurMeetsSeeder;
use Database\Seeders\Generated\InvoicesSeeder;
use Database\Seeders\Generated\JobBatchesSeeder;
use Database\Seeders\Generated\JobsSeeder;
use Database\Seeders\Generated\MembershipsSeeder;
use Database\Seeders\Generated\MigrationsSeeder;
use Database\Seeders\Generated\OrderItemsSeeder;
use Database\Seeders\Generated\OrdersSeeder;
use Database\Seeders\Generated\PasswordResetTokensSeeder;
use Database\Seeders\Generated\PaymentsSeeder;
use Database\Seeders\Generated\ProductsSeeder;
use Database\Seeders\Generated\ReglementsSeeder;
use Database\Seeders\Generated\RgpdsSeeder;
use Database\Seeders\Generated\SessionsSeeder;
use Database\Seeders\Generated\StatisticsSeeder;
use Database\Seeders\Generated\StatusesSeeder;
use Database\Seeders\Generated\UsersSeeder;

class AllTablesSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(CacheSeeder::class);
        $this->call(CacheLocksSeeder::class);
        $this->call(CgusSeeder::class);
        $this->call(EventTicketReservationsSeeder::class);
        $this->call(EventsSeeder::class);
        $this->call(FailedJobsSeeder::class);
        $this->call(FurMeetsSeeder::class);
        $this->call(JobBatchesSeeder::class);
        $this->call(JobsSeeder::class);
        $this->call(MembershipsSeeder::class);
        $this->call(MigrationsSeeder::class);
        $this->call(OrdersSeeder::class);
        $this->call(OrderItemsSeeder::class);
        $this->call(InvoicesSeeder::class);
        $this->call(PasswordResetTokensSeeder::class);
        $this->call(PaymentsSeeder::class);
        $this->call(ProductsSeeder::class);
        $this->call(ReglementsSeeder::class);
        $this->call(RgpdsSeeder::class);
        $this->call(SessionsSeeder::class);
        $this->call(StatisticsSeeder::class);
        $this->call(StatusesSeeder::class);
        $this->call(UsersSeeder::class);
    }
}
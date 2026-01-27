<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Database\Seeders\Generated\CgusSeeder;
use Database\Seeders\Generated\FurMeetsSeeder;
use Database\Seeders\Generated\PasswordResetTokensSeeder;
use Database\Seeders\Generated\PaymentsSeeder;
use Database\Seeders\Generated\ProductsSeeder;
use Database\Seeders\Generated\ReglementsSeeder;
use Database\Seeders\Generated\RgpdsSeeder;
use Database\Seeders\Generated\StatisticsSeeder;
use Database\Seeders\Generated\StatusesSeeder;
use Database\Seeders\Generated\UsersSeeder;

class AllTablesSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(CgusSeeder::class);
        $this->call(FurMeetsSeeder::class);
        $this->call(PasswordResetTokensSeeder::class);
        $this->call(PaymentsSeeder::class);
        $this->call(ProductsSeeder::class);
        $this->call(ReglementsSeeder::class);
        $this->call(RgpdsSeeder::class);
        $this->call(StatisticsSeeder::class);
        $this->call(StatusesSeeder::class);
        $this->call(UsersSeeder::class);
    }
}
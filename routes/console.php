<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('seed:dump {--tables=} {--all} {--exclude=}', function () {
    $outputDir = base_path('database/seeders/Generated');

    if (!is_dir($outputDir)) {
        mkdir($outputDir, 0777, true);
    }

    $tablesOpt = $this->option('tables');
    $excludeOpt = $this->option('exclude');
    $allOpt = $this->option('all');

    $exclude = [];
    if ($excludeOpt) {
        $exclude = array_filter(array_map('trim', explode(',', $excludeOpt)));
    }

    if ($tablesOpt) {
        $tables = array_filter(array_map('trim', explode(',', $tablesOpt)));
    } else {
        if (!$allOpt) {
            $this->warn('No --tables specified. Using --all to dump all tables.');
        }
    $tables = collect(DB::select('SELECT TABLE_NAME as name FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()'))
            ->pluck('name')
            ->all();
    }

    $tables = array_values(array_diff($tables, $exclude));

    if (empty($tables)) {
        $this->error('No tables selected to dump.');
        return;
    }

    $generatedClasses = [];

    foreach ($tables as $table) {
        $className = Str::studly($table).'Seeder';
        $filePath = $outputDir.DIRECTORY_SEPARATOR.$className.'.php';

        $this->info("Dumping table: {$table} -> {$className}");

        $rowsCount = (int) DB::table($table)->count();
        if ($rowsCount === 0) {
            $this->warn("Table '{$table}' is empty. Generating an empty seeder.");
        }

        $php = [];
        $php[] = '<?php';
        $php[] = '';
        $php[] = 'namespace Database\\Seeders\\Generated;';
        $php[] = '';
        $php[] = 'use Illuminate\\Database\\Seeder;';
        $php[] = 'use Illuminate\\Support\\Facades\\DB;';
        $php[] = '';
        $php[] = 'class '.$className.' extends Seeder';
        $php[] = '{';
        $php[] = '    public function run(): void';
        $php[] = '    {';
        $php[] = "        DB::statement('SET FOREIGN_KEY_CHECKS=0');";
        $php[] = "        DB::table('".$table."')->truncate();";
        $php[] = "        DB::statement('SET FOREIGN_KEY_CHECKS=1');";

        $chunkSize = 500;
        $processed = 0;
        DB::table($table)->orderBy(DB::raw('1')) // generic ordering by first column to keep deterministic insert order
            ->chunk($chunkSize, function ($rows) use (&$php, &$processed, $table) {
                $batch = [];
                foreach ($rows as $row) {
                    $batch[] = (array) $row;
                }
                $php[] = '        DB::table(\''.$table.'\')->insert('.var_export($batch, true).');';
                $processed += count($batch);
            });

        if ($processed === 0) {
            // No inserts emitted; still keep a minimal body
            $php[] = '        // No data to insert';
        }

        $php[] = '    }';
        $php[] = '}';

        file_put_contents($filePath, implode(PHP_EOL, $php));
        $generatedClasses[] = $className;
    }

    // Generate an aggregator seeder
    $aggClass = 'AllTablesSeeder';
    $aggPath = $outputDir.DIRECTORY_SEPARATOR.$aggClass.'.php';
    $agg = [];
    $agg[] = '<?php';
    $agg[] = '';
    $agg[] = 'namespace Database\\Seeders\\Generated;';
    $agg[] = '';
    $agg[] = 'use Illuminate\\Database\\Seeder;';
    foreach ($generatedClasses as $cls) {
        $agg[] = 'use Database\\Seeders\\Generated\\'.$cls.';';
    }
    $agg[] = '';
    $agg[] = 'class '.$aggClass.' extends Seeder';
    $agg[] = '{';
    $agg[] = '    public function run(): void';
    $agg[] = '    {';
    foreach ($generatedClasses as $cls) {
        $agg[] = '        $this->call('.$cls.'::class);';
    }
    $agg[] = '    }';
    $agg[] = '}';
    file_put_contents($aggPath, implode(PHP_EOL, $agg));

    $this->info('Seeders generated in database/seeders/Generated');
    $this->line('Run them with:');
    $this->line('  php artisan db:seed --class=Database\\Seeders\\Generated\\AllTablesSeeder');
})->purpose('Dump current database data into runnable seeder classes');

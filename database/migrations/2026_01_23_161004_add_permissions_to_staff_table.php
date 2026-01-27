<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('staff')) {
            Schema::table('staff', function (Blueprint $table) {
                if (!Schema::hasColumn('staff', 'is_visible')) {
                    $table->boolean('is_visible')->default(true)->after('order');
                }
                if (!Schema::hasColumn('staff', 'role_level')) {
                    $table->string('role_level')->default('staff')->after('role');
                }
                if (!Schema::hasColumn('staff', 'permissions')) {
                    $table->json('permissions')->nullable()->after('role_level');
                }
                if (!Schema::hasColumn('staff', 'user_id')) {
                    $table->foreignId('user_id')->nullable()->after('id')->constrained()->nullOnDelete();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('staff', function (Blueprint $table) {
            $table->dropColumn(['is_visible', 'role_level', 'permissions', 'user_id']);
        });
    }
};

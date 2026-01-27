<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add staff-related columns to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('email');
            $table->string('role_level')->default('user')->after('role'); // user, moderator, admin, master
            $table->json('permissions')->nullable()->after('role_level');
            $table->string('photo')->nullable()->after('permissions');
            $table->json('social_links')->nullable()->after('photo');
            $table->integer('staff_order')->default(0)->after('social_links');
            $table->boolean('is_staff_visible')->default(false)->after('staff_order');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'role_level',
                'permissions',
                'photo',
                'social_links',
                'staff_order',
                'is_staff_visible',
            ]);
        });
    }
};

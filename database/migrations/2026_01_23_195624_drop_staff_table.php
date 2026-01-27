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
        Schema::dropIfExists('staff');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate the staff table if needed for rollback
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('role');
            $table->enum('role_level', ['staff', 'admin', 'master'])->default('staff');
            $table->json('permissions')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->string('photo')->nullable();
            $table->json('social_links')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }
};

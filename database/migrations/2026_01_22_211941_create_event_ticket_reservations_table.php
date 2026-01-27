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
        if (!Schema::hasTable('event_ticket_reservations')) {
            Schema::create('event_ticket_reservations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('event_id')->constrained()->onDelete('cascade');
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->integer('quantity');
                $table->enum('status', ['reserved', 'confirmed', 'cancelled'])->default('reserved');
                $table->timestamp('reserved_at')->useCurrent();
                $table->timestamp('confirmed_at')->nullable();
                $table->timestamps();
                $table->index('event_id');
                $table->index('user_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_ticket_reservations');
    }
};

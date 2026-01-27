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
        if (!Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained()->onDelete('cascade');
                $table->string('payment_method'); // stripe, paypal, card, etc.
                $table->string('transaction_id')->unique()->nullable();
                $table->decimal('amount', 10, 2);
                $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
                $table->timestamp('paid_at')->nullable();
                $table->text('metadata')->nullable(); // JSON pour données supplémentaires
                $table->timestamps();
                $table->index('order_id');
                $table->index('status');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};

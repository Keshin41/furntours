<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventTicketReservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'user_id',
        'quantity',
        'status',
        'reserved_at',
        'confirmed_at',
    ];

    protected $casts = [
        'reserved_at' => 'datetime',
        'confirmed_at' => 'datetime',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

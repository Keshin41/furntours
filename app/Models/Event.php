<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'location',
        'date_start',
        'date_end',
        'max_attendees',
        'image',
        'active',
    ];

    protected $casts = [
        'date_start' => 'datetime',
        'date_end' => 'datetime',
        'active' => 'boolean',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(EventTicketReservation::class);
    }
}

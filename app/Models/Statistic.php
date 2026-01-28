<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'telegram_members',
        'association_members',
        'furmeets_count',
        'hero_video_url',
        'telegram_link',
    ];

    protected $casts = [
        'telegram_members' => 'integer',
        'association_members' => 'integer',
        'furmeets_count' => 'integer',
        'hero_video_url' => 'string',
        'telegram_link' => 'string',
    ];

    /**
     * Récupérer ou créer les statistiques
     */
    public static function current()
    {
        return static::firstOrCreate(
            ['id' => 1],
            [
                'telegram_members' => 0,
                'association_members' => 0,
                'furmeets_count' => 0,
                'hero_video_url' => '/videos/hero-background.webm',
                'telegram_link' => 'https://t.me/furntours',
            ]
        );
    }
}

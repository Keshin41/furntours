<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reglement extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'content',
    ];

    /**
     * Retourne ou crée le règlement par défaut.
     */
    public static function current(): self
    {
        return static::firstOrCreate(
            ['slug' => 'reglement-interieur'],
            [
                'title' => 'Règlement intérieur',
                'content' => static::defaultContent(),
            ]
        );
    }

    /**
     * Contenu par défaut du règlement.
     */
    public static function defaultContent(): string
    {
        return <<<HTML
<h1>RÈGLEMENT INTÉRIEUR</h1>
HTML;
    }
}

<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FurMeetsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('fur_meets')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('fur_meets')->insert(array (
  0 => 
  array (
    'id' => 1,
    'title' => '🎉 Annonce – Furmeet du 10 Janvier ! 🎉',
    'date' => '2026-01-10 18:30:00',
    'description' => '<p>Bonne année à tous et <strong>meilleurs vœux</strong> ! <br>On vous souhaite plein de bonheur, de fun, et <strong>beaucoup de fluff</strong> pour cette nouvelle année <br><br>Notre meet mensuelle arrive et on vous prépare une <strong>soirée complète</strong>, chaleureuse et bien fluffy comme on les aime <br>Préparez vos pattes, vos sourires et votre bonne humeur !</p><p>Activité de l’après-midi (au choix)</p><p>SOIT Bowling <br>Environ 8 à 10 € / personne (selon parties &amp; location des chaussures)</p><p>SOIT BattleKart (karting interactif) <br>Environ 22 € / personne la première session<br>La deuxième 18 €<br>La troisième 16 €</p><p>S’il n’y a pas au minimum 5 personnes pour le karting, on passera directement au bowling.</p><p>Rendez-vous à 16h30<br>BattleKart Tours</p><p>Repas du soir – 19h<br>Environ 20 à 30 € / personne (selon la formule)</p><p>Bar après le restaurant – 21h30<br>Consommations à la carte</p><p>Programme récapitulatif</p><p>16h30 : Bowling (~8–10 €) ou BattleKart (~22 €)<br>19h : Restaurant chinois<br>21h30 : Bar au Shuffle Factory</p><p>Venez nombreux pour partager un <strong>super moment fluffy</strong>, papouilles incluses et bonne ambiance garantie <br>Merci de confirmer votre présence pour qu’on puisse organiser tout ça au poil !</p><p><a target="_blank" rel="noopener noreferrer nofollow" class="text-light-blue underline hover:text-blue" href="https://docs.google.com/forms/d/e/1FAIpQLScYH4C3-jhAvYUwcYDBL4WJF-RQey3AUyp3phk0-xynWl_z0A/viewform?usp=dialog">https://docs.google.com/forms/d/e/1FAIpQLScYH4C3-jhAvYUwcYDBL4WJF-RQey3AUyp3phk0-xynWl_z0A/viewform?usp=dialog</a></p><p>Hâte de vous voir</p>',
    'is_published' => 1,
    'created_at' => '2026-01-23 20:49:36',
    'updated_at' => '2026-01-23 21:09:56',
  ),
  1 => 
  array (
    'id' => 3,
    'title' => 'ter',
    'date' => '2002-01-01 07:05:00',
    'description' => '<p>uhygft</p>',
    'is_published' => 1,
    'created_at' => '2026-01-23 20:55:43',
    'updated_at' => '2026-01-23 21:04:00',
  ),
));
    }
}
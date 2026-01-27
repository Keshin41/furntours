<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RgpdsSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('rgpds')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('rgpds')->insert(array (
  0 => 
  array (
    'id' => 1,
    'slug' => 'rgpd',
    'title' => 'Politique de Confidentialité (RGPD)',
    'content' => '<h1>POLITIQUE DE CONFIDENTIALITÉ (RGPD)</h1>

<h2>1. INTRODUCTION</h2>
<p>L\'association Fur\'Bar Tours (ci-après "l\'Association") s\'engage à protéger la vie privée et les données personnelles de ses membres et utilisateurs, conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679).</p>

<h2>2. RESPONSABLE DU TRAITEMENT</h2>
<p><strong>Association :</strong> Fur\'Bar Tours</p>
<p><strong>Adresse :</strong> À définir</p>
<p><strong>Contact :</strong> Via la page <a href="/contact">Contact</a></p>

<h2>3. DONNÉES COLLECTÉES</h2>
<p>Nous collectons les données personnelles suivantes :</p>

<h3>3.1 Données d\'identification</h3>
<ul>
    <li>Nom et prénom</li>
    <li>Pseudonyme (fursonas)</li>
    <li>Adresse email</li>
    <li>Numéro de téléphone (si fourni)</li>
</ul>

<h3>3.2 Données de connexion</h3>
<ul>
    <li>Identifiants de connexion</li>
    <li>Adresse IP</li>
    <li>Données de navigation (cookies)</li>
</ul>

<h3>3.3 Données d\'adhésion</h3>
<ul>
    <li>Statut de membre</li>
    <li>Date d\'adhésion</li>
    <li>Historique de participation aux événements</li>
</ul>

<h2>4. FINALITÉS DU TRAITEMENT</h2>
<p>Vos données personnelles sont collectées et traitées pour les finalités suivantes :</p>
<ul>
    <li>Gestion des adhésions et des membres</li>
    <li>Organisation et gestion des événements (Furmeets)</li>
    <li>Communication avec les membres (newsletter, informations sur les événements)</li>
    <li>Gestion de la boutique en ligne et traitement des commandes</li>
    <li>Amélioration de nos services</li>
    <li>Respect de nos obligations légales</li>
</ul>

<h2>5. BASE LÉGALE DU TRAITEMENT</h2>
<p>Le traitement de vos données personnelles repose sur les bases légales suivantes :</p>
<ul>
    <li><strong>Consentement :</strong> Pour l\'envoi de newsletters et communications marketing</li>
    <li><strong>Exécution d\'un contrat :</strong> Pour la gestion de votre adhésion et des services</li>
    <li><strong>Intérêt légitime :</strong> Pour l\'amélioration de nos services et la sécurité du site</li>
    <li><strong>Obligation légale :</strong> Pour la conformité avec les obligations comptables et fiscales</li>
</ul>

<h2>6. DURÉE DE CONSERVATION</h2>
<p>Vos données personnelles sont conservées pendant :</p>
<ul>
    <li><strong>Données de membres actifs :</strong> Durée de l\'adhésion + 3 ans</li>
    <li><strong>Données de commandes :</strong> 10 ans (obligations comptables)</li>
    <li><strong>Données de connexion :</strong> 13 mois (logs)</li>
    <li><strong>Cookies :</strong> 13 mois maximum</li>
</ul>

<h2>7. DESTINATAIRES DES DONNÉES</h2>
<p>Vos données personnelles sont destinées à :</p>
<ul>
    <li>Le personnel habilité de l\'association</li>
    <li>Les prestataires techniques (hébergement, paiement en ligne)</li>
    <li>Les autorités légales sur demande justifiée</li>
</ul>

<h2>8. VOS DROITS</h2>
<p>Conformément au RGPD, vous disposez des droits suivants :</p>

<h3>8.1 Droit d\'accès</h3>
<p>Vous pouvez demander l\'accès à vos données personnelles.</p>

<h3>8.2 Droit de rectification</h3>
<p>Vous pouvez demander la correction de vos données inexactes ou incomplètes.</p>

<h3>8.3 Droit à l\'effacement</h3>
<p>Vous pouvez demander la suppression de vos données dans certains cas.</p>

<h3>8.4 Droit à la limitation</h3>
<p>Vous pouvez demander la limitation du traitement de vos données.</p>

<h3>8.5 Droit à la portabilité</h3>
<p>Vous pouvez récupérer vos données dans un format structuré et lisible.</p>

<h3>8.6 Droit d\'opposition</h3>
<p>Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes.</p>

<h3>8.7 Droit de retirer votre consentement</h3>
<p>Vous pouvez retirer votre consentement à tout moment pour les traitements basés sur celui-ci.</p>

<h2>9. EXERCICE DE VOS DROITS</h2>
<p>Pour exercer vos droits, contactez-nous via la page <a href="/contact">Contact</a> ou par email. Nous vous répondrons dans un délai d\'un mois.</p>

<h2>10. SÉCURITÉ DES DONNÉES</h2>
<p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre :</p>
<ul>
    <li>L\'accès non autorisé</li>
    <li>La modification, divulgation ou destruction non autorisées</li>
    <li>La perte accidentelle</li>
</ul>

<h2>11. COOKIES</h2>
<p>Notre site utilise des cookies pour améliorer votre expérience utilisateur. Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.</p>

<h3>Types de cookies utilisés :</h3>
<ul>
    <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site</li>
    <li><strong>Cookies de performance :</strong> Pour analyser l\'utilisation du site</li>
    <li><strong>Cookies de fonctionnalité :</strong> Pour mémoriser vos préférences</li>
</ul>

<h2>12. TRANSFERTS DE DONNÉES HORS UE</h2>
<p>Vos données personnelles sont stockées et traitées au sein de l\'Union Européenne. En cas de transfert hors UE, nous garantissons un niveau de protection adéquat.</p>

<h2>13. DROIT DE RÉCLAMATION</h2>
<p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (Commission Nationale de l\'Informatique et des Libertés) :</p>
<p><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>
<p><strong>Adresse :</strong> 3 Place de Fontenoy, TSA 80715, 75334 PARIS CEDEX 07</p>

<h2>14. MODIFICATIONS DE LA POLITIQUE</h2>
<p>Nous nous réservons le droit de modifier la présente politique de confidentialité. Toute modification sera publiée sur cette page avec la date de mise à jour.</p>

<p><strong>Dernière mise à jour :</strong> 23 janvier 2026</p>',
    'created_at' => '2026-01-23 22:21:00',
    'updated_at' => '2026-01-23 22:21:00',
  ),
));
    }
}
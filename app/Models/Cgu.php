<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cgu extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'content',
    ];

    /**
     * Retourne ou crée les CGU par défaut.
     */
    public static function current(): self
    {
        return static::firstOrCreate(
            ['slug' => 'cgu'],
            [
                'title' => 'Conditions Générales d\'Utilisation',
                'content' => static::defaultContent(),
            ]
        );
    }

    /**
     * Contenu par défaut des CGU.
     */
    public static function defaultContent(): string
    {
        return <<<HTML
<h1>CONDITIONS GÉNÉRALES D'UTILISATION</h1>

<h2>1. PRÉAMBULE</h2>
<p>Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'utilisation du site internet Fur'n'Tours et de tous les services proposés par l'association Fur'Bar Tours.</p>

<h2>2. MENTIONS LÉGALES</h2>
<p><strong>Éditeur du site :</strong> Association Fur'Bar Tours</p>
<p><strong>Siège social :</strong> À définir</p>

<h2>3. ACCEPTATION DES CGU</h2>
<p>L'utilisation du site implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, nous vous invitons à ne pas utiliser le site.</p>

<h2>4. SERVICES PROPOSÉS</h2>
<p>Le site Fur'n'Tours propose :</p>
<ul>
    <li>Des informations sur l'association et ses activités</li>
    <li>La présentation des événements Furmeets</li>
    <li>Une boutique en ligne pour l'achat de produits et services</li>
    <li>Un espace membre pour les adhérents</li>
</ul>

<h2>5. INSCRIPTION ET COMPTE UTILISATEUR</h2>
<p>L'accès à certaines fonctionnalités du site nécessite la création d'un compte utilisateur. Lors de votre inscription, vous vous engagez à :</p>
<ul>
    <li>Fournir des informations exactes et à jour</li>
    <li>Maintenir la confidentialité de vos identifiants de connexion</li>
    <li>Informer immédiatement l'association de toute utilisation non autorisée de votre compte</li>
</ul>

<h2>6. PROPRIÉTÉ INTELLECTUELLE</h2>
<p>Tous les contenus présents sur le site (textes, images, logos, vidéos) sont protégés par le droit d'auteur et appartiennent à l'association Fur'Bar Tours ou à ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>

<h2>7. PROTECTION DES DONNÉES PERSONNELLES</h2>
<p>Conformément au RGPD, nous nous engageons à protéger vos données personnelles. Pour plus d'informations, consultez notre <a href="/rgpd">Politique de Confidentialité</a>.</p>

<h2>8. RESPONSABILITÉ</h2>
<p>L'association Fur'Bar Tours met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.</p>

<h2>9. MODIFICATION DES CGU</h2>
<p>Nous nous réservons le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle.</p>

<h2>10. DROIT APPLICABLE ET JURIDICTION</h2>
<p>Les présentes CGU sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>

<h2>11. CONTACT</h2>
<p>Pour toute question concernant les présentes CGU, vous pouvez nous contacter via la page <a href="/contact">Contact</a> du site.</p>
HTML;
    }
}

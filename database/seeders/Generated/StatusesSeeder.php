<?php

namespace Database\Seeders\Generated;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusesSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('statuses')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::table('statuses')->insert(array (
  0 => 
  array (
    'id' => 1,
    'slug' => 'status',
    'title' => 'Status de l\'association',
    'content' => '<h2>ARTICLE PREMIER – CONSTITUTION</h2>
<p>Il est créé entre les adhérents aux présents statuts une association régie par la loi du 1er juillet 1901, et le décret du 16 août 1901, dont les statuts ont été adoptés par décision prise en assemblée générale en date du 15 novembre 2025</p>

<h2>ARTICLE 2 - DÉNOMINATION</h2>
<p>L\'association a pour dénomination "Fur\'Bar Tours" mais utilise communément le nom "Fur\'n\'Tours".</p>

<h2>ARTICLE 3 – OBJET SOCIAL</h2>
<p>L\'association a pour objet de promouvoir la communauté Furry et LGBT+ en réunissant des personnes partageant un intérêt commun pour ces deux univers.</p>

<h2>ARTICLE 4 – MOYEN D\'ACTION</h2>
<p>L\'association se propose d\'atteindre ses objectifs, notamment par :</p>
<ol>
    <li><strong>Réunion et Promotion de la Communauté :</strong> FUR\'BAR TOURS a pour mission de réunir les individus partageant un intérêt commun pour la culture Furry et la communauté LGBT+. L\'association encourage le dialogue, l\'inclusion et le respect au sein de ces deux communautés.</li>
    <li><strong>Organisation d\'Activités :</strong> FUR\'BAR TOURS s\'engage à organiser des activités variées visant à favoriser les échanges et la convivialité entre ses membres. Ces activités peuvent inclure des rencontres régulières, des événements sociaux, des ateliers artistiques, et toute autre initiative contribuant au bien-être et à l\'épanouissement de la communauté.</li>
    <li><strong>Participation aux Conventions Furry :</strong> FUR\'BAR TOURS encourage la participation de ses membres aux conventions Furry, favorisant ainsi la visibilité et la représentation positive de la communauté Furry dans le respect des valeurs de diversité et d\'inclusion propres à l\'association.</li>
    <li><strong>Promotion de l\'Art Furry :</strong> L\'association s\'engage à promouvoir l\'art Furry sous toutes ses formes. Cela inclut le soutien aux artistes au sein de la communauté, l\'organisation d\'expositions, et la mise en avant de la créativité propre à la culture Furry.</li>
    <li><strong>Soutien à la Cause LGBT+ :</strong> FUR\'BAR TOURS affirme son engagement en faveur de la cause LGBT+ en participant activement à des initiatives de sensibilisation, en soutenant des associations œuvrant pour les droits et la visibilité de la communauté LGBT+, et en promouvant un environnement inclusif et respectueux au sein de ses activités.</li>
</ol>

<h2>ARTICLE 5 – SIÈGE SOCIAL</h2>
<p>Le siège social est fixé à l\'adresse 5 Rue Nungesser et Coli, 37000 Tours.</p>
<p>Il pourra être transféré en tous lieux de TOURS par simple décision du conseil d\'administration.</p>

<h2>ARTICLE 6 – DURÉE</h2>
<p>L\'association est constituée pour la durée illimitée.</p>

<h2>ARTICLE 7 – MEMBRES</h2>

<h3>7.1 Catégories</h3>
<p>L\'association se compose de membres fondateurs et membres actifs :</p>
<ul>
    <li>Sont membres fondateurs les personnes qui ont pris l\'initiative de la création de la présente association ;</li>
    <li>Sont membres actifs, les personnes physiques qui participent activement au fonctionnement de l\'association et à la réalisation de son objet ayant payé leurs cotisations ;</li>
    <li>Sont membres bienfaiteurs, les personnes ayant versés des libéralités sans payer de cotisation et n\'ayant par conséquent pas de droit de vote.</li>
</ul>

<h3>7.2 Acquisition de la qualité de membre</h3>
<p>L\'acquisition de la qualité de membre de l\'association est subordonnée au respect des conditions et modalités suivantes :</p>
<ul>
    <li>Pour les membres actifs : les personnes physiques payant leurs cotisations et participant activement au fonctionnement de l\'association et à la réalisation de son objet</li>
    <li>Pour les membres bienfaiteurs : les personnes ayant versés des libéralités sans payer de cotisation et n\'ayant par conséquent pas de droit de vote.</li>
</ul>

<h3>7.3 Perte de la qualité de membre</h3>
<p>La qualité de membre se perd par :</p>
<ol>
    <li>La démission notifiée par courrier avec accusé de réception adressée au président de l\'association, ou par mail ;</li>
    <li>Le décès des personnes physiques ;</li>
    <li>La disparition de l\'une quelconque des conditions nécessaires à l\'acquisition de la qualité de membre ;</li>
    <li>L\'absence non excusée à trois assemblées générales consécutives ;</li>
    <li>La radiation automatique pour non-paiement de la cotisation annuelle, après deux rappels demeurés infructueux.</li>
    <li>L\'exclusion prononcée par le conseil d\'administration pour motifs graves, l\'intéressé ayant préalablement été invité à faire valoir ses moyens de défense ;</li>
    <li>En cas d\'incident ou de comportement inapproprié, le conseil d\'administration pourra prononcer l\'exclusion immédiate de l\'association et corrélativement des canaux de communication ou des évènements organisés.</li>
</ol>

<h2>ARTICLE 8. – RESSOURCES</h2>
<p>Les ressources de l\'association se composent :</p>
<ul>
    <li>Des cotisations de tous les membres, quelle que soit la catégorie à laquelle ils appartiennent.</li>
    <li>Les subventions de l\'Etat, des départements et des communes et de leurs établissements publics.</li>
    <li>Des dons manuels, et des dons des établissements d\'utilité publique.</li>
    <li>Des recettes provenant de biens vendus ou de prestations fournies par l\'association.</li>
    <li>Des revenus de biens de valeurs de toute nature appartenant à l\'association</li>
    <li>Des droits d\'entrées</li>
    <li>De toutes ressources autorisées par la loi, la jurisprudence et les réponses ministérielles.</li>
</ul>

<h2>ARTICLE 9 – CONSEIL D\'ADMINISTRATION</h2>

<h3>9.1 Composition</h3>
<p>Le conseil d\'administration est composé de 5 membres, élus par l\'assemblée générale ordinaire, pour une durée de DEUX ans parmi les membres, au scrutin majoritaire.</p>
<p>En cas de vacance d\'un ou plusieurs postes d\'administrateurs élus, le conseil d\'administration doit pourvoir provisoirement à leur remplacement par cooptation. C\'est notamment le cas lorsque le nombre de postes d\'administrateurs devient inférieur au minimum statutaire. La cooptation des nouveaux administrateurs devra être ratifiée définitivement par la plus prochaine assemblée générale. Les mandats des administrateurs ainsi élus prennent fin à l\'époque où devait normalement expirer le mandat des administrateurs remplacés.</p>
<p>Les fonctions d\'administrateurs cessent par la démission, la perte de la qualité de membre de l\'association, l\'absence non excusée à TROIS réunions consécutives du conseil d\'administration, la révocation par l\'assemblée générale, laquelle peut intervenir ad nutum, sur simple incident de séance et à la majorité des voix des ¾ des membres, et la dissolution de l\'association.</p>

<h3>9.2 Pouvoirs</h3>
<p>Le conseil d\'administration est investi des pouvoirs les plus étendus, pour gérer, diriger et administrer l\'association, sous réserve de ceux statutairement réservés aux assemblées générales, et notamment :</p>
<ol>
    <li>Il définit la politique et les orientations générales de l\'association.</li>
    <li>Il décide de l\'acquisition et de la cession de tous biens meubles et objets mobiliers, fait effectuer toutes réparations, tous travaux et agencements, et achète et vend tous titres et toutes valeurs.</li>
    <li>Il peut, avec l\'autorisation préalable de l\'assemblée générale ordinaire, prendre à bail et acquérir tout immeuble nécessaire à la réalisation de l\'objet de l\'association, conférer tous baux et hypothèques sur les immeubles de l\'association, procéder à la vente ou à l\'échange desdits immeubles, effectuer tous emprunts et accorder toutes garanties et sûretés.</li>
    <li>Il arrête les grandes lignes d\'actions de communications et de relations publiques.</li>
    <li>Il arrête les budgets et contrôle leur exécution.</li>
    <li>Il arrête les comptes de l\'exercice clos.</li>
    <li>Il contrôle l\'exécution par les membres du bureau de leurs fonctions.</li>
    <li>Il nomme et révoque les membres du bureau.</li>
    <li>Il nomme et révoque tous les employés et fixe leur rémunération.</li>
    <li>Il prononce l\'exclusion des membres.</li>
    <li>Il approuve le règlement intérieur de l\'association.</li>
    <li>Il autorise les actes et engagements dépassant le cadre des pouvoirs propres du président.</li>
</ol>

<h3>9.3 Fonctionnement</h3>
<p>Le conseil d\'administration se réunit au moins deux fois par an, à l\'initiative et sur convocation du président.</p>
<p>Il peut également se réunir à l\'initiative d\'un quart de ses membres et sur convocation du président.</p>
<p>Dans les deux cas, les convocations sont effectuées par lettre simple ou par mail et adressées aux administrateurs au moins 30 jours avant la date fixée pour la réunion.</p>
<p>Les convocations contiennent l\'ordre du jour de la réunion.</p>
<p>L\'ordre du jour est établi par le président ou par le secrétaire sur ordre du président. Quand le conseil d\'administration se réunit à l\'initiative d\'un quart de ses membres, ceux-ci peuvent exiger l\'inscription à l\'ordre du jour des questions de leur choix.</p>
<p>Le conseil d\'administration peut valablement délibérer, quelque soit le nombre d\'administrateurs présents ou représentés.</p>
<p>Les décisions sont prises à la majorité simple des membres présents ou représentés.</p>
<p>En cas de partage des voix, celle du président est prépondérante.</p>
<p>Tout administrateur empêché peut se faire représenter par la personne physique ou morale de son choix, muni d\'un pouvoir spécial à cet effet.</p>
<p>Il est tenu procès-verbal des réunions du conseil d\'administration. Les procès-verbaux sont établis sans blanc ni rature, et signés par le président et un administrateur ; ils sont retranscrits dans l\'ordre chronologique, sur le registre des délibérations de l\'association coté et paraphé par le président.</p>

<h3>9.4 Gratuité du mandat d\'administrateur</h3>
<p>Les membres du conseil d\'administration ne perçoivent aucune rétribution en raison des fonctions qui leur sont conférées (mandat social).</p>
<p>Toutefois, les frais et débours occasionnés lors de l\'accomplissement de leur mandat sont remboursés à l\'euro sur présentation des pièces justificatives. Ils doivent faire l\'objet d\'une décision expresse du conseil d\'administration, statuant hors de la présence des intéressés.</p>
<p>Le rapport financier présenté à l\'assemblée générale ordinaire doit faire mention des remboursements des frais de mission ou de déplacement.</p>
<p>Les frais pouvant être pris en charge incluent sans s\'y limiter : frais de déplacement (billets de train, péages), frais de mission (hébergement), frais de représentation (restauration dans la limite de 15€/repas).</p>
<p>Si un remboursement est jugé abusif par la majorité des membres actifs lors de l\'assemblée générale, il pourra être demandé au bénéficiaire de rembourser ce montant.</p>

<h2>ARTICLE 10 – LE BUREAU</h2>

<h3>10.1 Composition</h3>
<p>Le bureau de l\'association est composé de :</p>
<ol>
    <li>Un président</li>
    <li>Un secrétaire</li>
    <li>Un trésorier</li>
</ol>
<p>Les membres du bureau sont élus au scrutin majoritaire, par le conseil d\'administration, et choisis parmi ses membres.</p>
<p>Les membres du bureau sont élus pour deux ans.</p>
<p>Les membres sortants sont rééligibles indéfiniment.</p>
<p>Les fonctions des membres du bureau prennent fin par la démission, la perte de qualité d\'administrateur, l\'absence non excusée à TROIS réunions consécutives du bureau, et la révocation par le conseil d\'administration, laquelle peut intervenir ad nutum et sur simple incident de séance.</p>

<h3>10.2 Pouvoirs</h3>
<p>Le bureau assure collégialement la gestion courante de l\'association, et veille à la mise en œuvre des décisions du conseil d\'administration.</p>
<p>En outre, ses membres exercent individuellement les pouvoirs définis ci-après.</p>

<h3>10.3 Fonctionnement</h3>
<p>Le bureau se réunit au moins deux fois par an à l\'initiative et sur convocation du président. La convocation peut être faite par tous moyens, mais au moins 30 jours à l\'avance.</p>
<p>L\'ordre du jour est établi par le président.</p>
<p>Le bureau peut entendre toute personne susceptible d\'éclairer ses délibérations.</p>
<p>Il est tenu procès-verbal des réunions du bureau. Les procès-verbaux sont établis sans blanc ni rature, et signés par le président et un autre membre du bureau ; ils sont retranscrits dans l\'ordre chronologique, sur le registre des délibérations de l\'association coté et paraphé par le président.</p>

<h2>ARTICLE 11 – PRÉSIDENT</h2>

<h3>11.1 - Qualités</h3>
<p>Le président cumule les qualités de président du bureau, du conseil d\'administration et de l\'association.</p>

<h3>11.2 Pouvoirs</h3>
<p>Le président assure la gestion quotidienne de l\'association. Il agit au nom et pour le compte du bureau, du conseil d\'administration, et de l\'association, et notamment :</p>
<ol>
    <li>Il représente l\'association dans tous les actes de la vie civile, et possède tous pouvoirs à l\'effet de l\'engager.</li>
    <li>Il a qualité pour représenter l\'association en justice, tant en demande qu\'en défense. Il ne peut être remplacé que par un mandataire agissant en vertu d\'une procuration spéciale.</li>
    <li>Il peut, avec l\'autorisation du conseil d\'administration, intenter toutes actions en justice pour la défense des intérêts de l\'association, consentir toutes transactions et former tous recours.</li>
    <li>Il convoque le bureau, le conseil d\'administration et les assemblées générales, fixe leur ordre du jour, et préside leur réunion.</li>
    <li>Il est habilité à ouvrir et faire fonctionner, dans tous établissements de crédit ou financiers, tous comptes et tous livrets d\'épargne.</li>
    <li>Il exécute les décisions arrêtées par le bureau et le conseil d\'administration.</li>
    <li>Il signe tout contrat d\'achat ou de vente et, plus généralement tous actes et tous contrats nécessaires à l\'exécution des décisions du bureau, du conseil d\'administration, et des assemblées générales.</li>
    <li>Il ordonne les dépenses.</li>
    <li>Il procède au paiement des dépenses et à l\'encaissement des recettes.</li>
    <li>Il présente les budgets annuels, et contrôle leur exécution.</li>
    <li>Il propose le règlement intérieur de l\'association à l\'approbation du conseil d\'administration.</li>
    <li>Il présente un rapport d\'activité à l\'assemblée générale annuelle.</li>
    <li>Il peut déléguer, par écrit, ses pouvoirs et sa signature ; il peut à tout instant mettre fin auxdites délégations.</li>
</ol>
<p>Tout acte, tout engagement dépassant le cadre des pouvoirs ci-dessus définis devra être autorisé préalablement par le conseil d\'administration.</p>

<h2>ARTICLE 12 – SECRÉTAIRE</h2>
<p>Le secrétaire veille au bon fonctionnement matériel, administratif, comptable et juridique de l\'association. Il établit, ou fait établir sous son contrôle, les procès-verbaux des réunions du bureau, du conseil d\'administration, et des assemblées générales. Il tient, ou fait tenir sous son contrôle, les registres, général et spécial, de l\'association. Il procède, ou fait procéder sous son contrôle, aux déclarations à la préfecture, et aux publications au Journal Officiel, dans le respect des dispositions légales ou réglementaires.</p>
<p>Il peut agir sur délégation du président.</p>
<p>Il peut être assisté dans ses fonctions par un secrétaire général adjoint, ou plusieurs secrétaires généraux adjoints.</p>

<h2>ARTICLE 13 - TRÉSORIER</h2>
<p>Le trésorier établit, ou fait établir sous son contrôle, les comptes annuels de l\'association. Il procède à l\'appel annuel des cotisations. Il établit un rapport financier, qu\'il présente avec les comptes annuels à l\'assemblée générale ordinaire annuelle.</p>
<p>Il peut, par délégation, et sous le contrôle du président, procéder au paiement des dépenses et à l\'encaissement des recettes.</p>
<p>Il peut être habilité, par délégation du président et sous son contrôle, à ouvrir et faire fonctionner dans tous établissements de crédits ou financiers, tous comptes et tous livrets d\'épargne.</p>
<p>Il peut être assisté dans ses fonctions par un trésorier adjoint.</p>

<h2>ARTICLE 14 – ASSEMBLÉES GÉNÉRALES</h2>
<p>Seuls les membres fondateurs et actifs ont accès aux assemblées générales et participent aux votes.</p>
<p>Les assemblées générales sont convoquées par le président par lettre simple ou courriel électronique au moins 45 jours à l\'avance.</p>
<p>La convocation contient l\'ordre du jour fixé par le président. Quand les assemblées générales sont convoquées à l\'initiative d\'une fraction de leurs membres, ceux-ci peuvent exiger l\'inscription à l\'ordre du jour des questions de leur choix.</p>
<p>Le bureau qui préside l\'assemblée générale est le bureau de l\'association.</p>
<p>Le président préside les assemblées générales, expose les questions à l\'ordre du jour, et conduit les débats. En cas d\'empêchement, le président se fait suppléer par le secrétaire.</p>
<p>Les assemblées générales ne peuvent statuer que sur les questions figurant à l\'ordre du jour, à l\'exception de la révocation des administrateurs.</p>
<p>Les assemblées générales sont ordinaires, ou extraordinaires : leurs décisions régulièrement adoptées sont obligatoires pour tous.</p>
<p>Tout membre empêché peut se faire représenter par la personne physique ou morale de son choix muni d\'un pouvoir spécial à cet effet.</p>
<p>Le nombre de pouvoirs détenus par une seule personne est illimité. Les pouvoirs en blanc retournés au siège social sont attribués au président, et utilisés dans le sens de l\'adoption des résolutions approuvées par le conseil d\'administration.</p>
<p>Les assemblées générales peuvent entendre toute personne susceptible d\'éclairer leurs délibérations.</p>
<p>Les votes ont lieu à mains levées, ou par bulletin secret. Seuls les membres adhérents depuis plus de 2 mois sont autorisés à voter.</p>
<p>Il est tenu procès-verbal des délibérations et résolutions des assemblées générales. Les procès-verbaux sont établis sans blanc ni rature, et signés par le président et le secrétaire de séance ; ils sont retranscrits dans l\'ordre chronologique, sur le registre des délibérations de l\'association coté et paraphé par le président.</p>

<h3>14.1) Assemblées générales ordinaires</h3>
<p><strong>a) Pouvoirs</strong></p>
<p>L\'assemblée générale ordinaire se réunit une fois par an, dans les six mois de la clôture de l\'exercice social.</p>
<p>L\'assemblée générale ordinaire entend le rapport d\'activités et le rapport financier.</p>
<p>L\'assemblée générale ordinaire approuve les comptes de l\'exercice clos, vote le budget prévisionnel, et donne quitus de leur gestion aux administrateurs.</p>
<p>L\'assemblée générale ordinaire procède à l\'élection et à la révocation des administrateurs.</p>
<p>L\'assemblée générale ordinaire a compétence pour modifier les statuts de l\'association par vote, dès lors que cela apparaît à l\'ordre du jour.</p>
<p>L\'assemblée générale ordinaire autorise le conseil d\'administration à signer tous actes, à conclure tout engagement, et à contracter toute obligation qui dépassent le cadre de ses pouvoirs statutaires.</p>
<p>L\'assemblée générale ordinaire délibère sur toutes questions figurant à l\'ordre du jour, et ne relevant pas de la compétence exclusive d\'un autre organe de l\'association.</p>
<p><strong>b) Quorum et majorité</strong></p>
<p>L\'assemblée générale ordinaire peut valablement délibérer, quel que soit le nombre de membres présents ou représentés.</p>
<p>Les décisions sont prises à la majorité simple, qualifiées des membres présents ou représentés.</p>

<h3>14.2) Assemblées générales extraordinaires</h3>
<p><strong>a) Pouvoirs</strong></p>
<p>L\'assemblée générale extraordinaire a compétence pour procéder à la modification des statuts, à la dissolution de l\'association et à la dévolution de ses biens, et à la fusion ou transformation de l\'association, à la création d\'une filiale, d\'un fonds de dotation ou de toute autre structure ayant un lien direct avec l\'association.</p>
<p>D\'une façon générale, elle a compétence pour prendre toutes décisions de nature à mettre en cause son existence ou à porter atteinte à son objet essentiel.</p>
<p>Elle est convoquée chaque fois que nécessaire, à l\'initiative du président ou à l\'initiative d\'au moins 1/3 de ses membres.</p>
<p><strong>b) Quorum et majorité</strong></p>
<p>L\'assemblée générale extraordinaire peut valablement délibérer, quel que soit le nombre de membres présents ou représentés.</p>
<p>Les décisions sont prises à la majorité qualifiée des trois quarts des membres présents ou représentés.</p>

<h2>ARTICLE 15 – EXERCICE SOCIAL</h2>
<p>L\'exercice social commence le 1 janvier pour se terminer le 31 décembre.</p>

<h2>ARTICLE 16 – COMPTABILITÉ – COMPTES ET DOCUMENTS ANNUELS</h2>
<p>Il est tenu une comptabilité selon les normes du plan comptable général, et faisant apparaître annuellement un bilan, un compte de résultat et le cas échéant, une ou plusieurs annexes.</p>
<p>Les comptes annuels sont tenus à la disposition de tous les membres, avec le rapport d\'activités et le rapport financier, pendant les quinze jours précédant la date de l\'assemblée générale ordinaire appelée à statuer sur les comptes de l\'exercice clos.</p>

<h2>ARTICLE 17 - DISSOLUTION</h2>
<p>La dissolution est proposée par le conseil d\'administration à l\'assemblée générale extraordinaire.</p>
<p>En cas de dissolution, l\'assemblée générale extraordinaire désigne un ou plusieurs liquidateurs chargés des opérations de liquidation. À la clôture des opérations de liquidation, elle prononce la dévolution de l\'actif net conformément aux dispositions de la loi du 1er juillet 1901 et du décret du 16 août 1901.</p>
<p>En aucun cas, les membres de l\'association ne pourront se voir attribuer, en dehors de la reprise de leurs apports, une part quelconque des biens de l\'association.</p>

<h2>ARTICLE 18 - RÈGLEMENT INTÉRIEUR</h2>
<p>Un règlement intérieur, élaboré par le président de l\'association et approuvé par le conseil d\'administration, précise et complète, en tant que de besoin, les dispositions statutaires relatives au fonctionnement de l\'association.</p>
<p>L\'adhésion aux statuts emporte de plein droit adhésion au règlement intérieur.</p>

<h2>ARTICLE 19 – LIBÉRALITÉS</h2>
<p>Conformément à l\'article 11 de la loi du 1er juillet 1901, l\'association s\'engage à présenter ses registres comptables aux autorités administratives pour toute libéralité reçue.</p>

<h2>ARTICLE 20 : FORMALITÉS</h2>
<p>Toutes modifications des statuts seront déclarées dans les trois mois à la préfecture et seront inscrites sur le registre spécial prévu dans le cadre des dispositions légales.</p>
<p>A cet effet, le Président remplira les formalités de déclaration et de publication prescrites par la loi.</p>
<p>Tous pouvoirs sont conférés à cet effet au porteur d\'un original des présentes.</p>
<p>Statuts approuvés par l\'assemblée générale constitutive réunie spécialement à cet effet en date du 15/11/2025.</p>
<p>Faits en 2 originaux, dont 1 pour être déposés à la préfecture de Tours et 1 pour être conservés au siège social de l\'association</p>',
    'created_at' => '2026-01-23 22:13:19',
    'updated_at' => '2026-01-23 22:13:19',
  ),
));
    }
}
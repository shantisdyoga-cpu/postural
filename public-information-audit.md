# Audit des informations visibles publiquement — Sdyoga

## Conclusion générale

La page publique n’affiche pas les demandes de réservation, les noms d’élèves, les téléphones des élèves, les notes internes, les données financières, les statuts administratifs ou les informations d’authentification. Les procédures d’administration du serveur utilisent bien une protection réservée à l’administrateur.

## Informations publiques actuellement visibles

Les éléments suivants sont cohérents avec un site professionnel et semblent volontairement destinés aux visiteurs : le nom de David Sarre, la présentation de l’approche posturale, les photos de la salle et des stages, les témoignages publiés, les horaires, les tarifs, l’adresse de l’Espace Maitai, le téléphone professionnel `06.51.59.21.08`, l’adresse `contact@sdyoga-postural.fr`, ainsi que le formulaire de contact et de réservation.

La capacité maximale de dix élèves n’est plus affichée dans le planning public depuis la dernière correction. Elle reste utilisée côté serveur et visible dans l’administration.

## Point à corriger ou à valider

La page de confidentialité affiche actuellement l’adresse interne `shanti.sdyoga@gmail.com` dans la section Google Agenda. Cette adresse n’est pas nécessaire pour les visiteurs et peut être remplacée par une formulation générale, par exemple : « l’agenda Google professionnel associé à Sdyoga ». C’est le seul élément clairement identifiable comme information technique ou interne dans les contenus publics.

## Éléments techniques contrôlés

Les routes `/admin` et `/admin/finances` existent dans l’application, mais leurs données sont chargées par des procédures serveur protégées par le rôle administrateur. Les réservations, coordonnées d’élèves, notes internes, transactions financières, blocs de disponibilité détaillés et état Google Agenda ne sont donc pas rendus publics par l’interface.

Le site conserve des procédures publiques nécessaires au fonctionnement du formulaire : envoi d’une demande, consultation des blocages de créneaux individuels ou d’appels, et authentification publique limitée à l’état de session. Les procédures de blocage ne renvoient pas de nom, d’e-mail, de téléphone ou de note ; elles transmettent uniquement des dates et heures nécessaires pour désactiver les choix indisponibles dans les calendriers. La procédure publique de disponibilité collective existe encore côté serveur, mais elle n’est plus appelée par la page publique et son résultat n’est plus affiché. Pour une confidentialité renforcée, elle pourrait être supprimée ou réservée à l’administration.

## Recommandation

La priorité est de retirer l’adresse `shanti.sdyoga@gmail.com` de la page de confidentialité. En complément, il est recommandé de rendre la procédure publique de disponibilité collective inaccessible ou strictement administrative, afin qu’aucun nombre de places ne puisse être récupéré directement par une personne connaissant l’API, même si ce nombre n’est plus visible sur le site.

Aucune modification n’a été effectuée pendant cet audit.

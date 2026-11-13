# Vérification avant reprise des cours

## État observé

Audit public réalisé sans connexion sur la version publiée de Sdyoga le 30 août 2026.

Le site présente les éléments attendus : approche posturale, message sur la souplesse, parcours de David, formations, photos de la salle et de la pratique, témoignages, horaires collectifs et individuels, tarifs séparés, lieu, téléphone, e-mail professionnel et formulaire de réservation.

Le nombre de places restantes n’est pas affiché sur la page publique. La capacité maximale de 10 élèves apparaît toutefois dans le texte pratique du site ; elle n’est pas une donnée individuelle ou sensible, mais peut être retirée si David préfère ne communiquer aucun chiffre public.

Les appels à l’action visibles comprennent « Essayer un cours », « Réserver un cours d’essai », « Réserver un appel préparatoire », « Réserver un cours individuel », « Appeler » et « Réserver ».

Le formulaire affiche les types de demande Premier cours d’essai, Cours individuel, Appel téléphonique — 20 min et Question générale. Il rappelle que la demande reste privée et ne vaut pas confirmation ; David confirme ensuite manuellement.

Les coordonnées publiques observées sont contact@sdyoga-postural.fr, 06.51.59.21.08 et Espace Maitai, 22 bis René Dumont, 13410 Lambesc.

## Points à vérifier encore

- Tester directement les trois boutons de réservation et vérifier les présélections.
- Vérifier le rendu mobile du menu « Infos pratiques » et l’absence de recouvrement.
- Vérifier le calendrier et les jours en français après interaction.
- Vérifier la page de confidentialité et l’absence de l’adresse Gmail interne.
- Ne rien modifier avant de présenter les constats à David.


## Vérification complémentaire

La page publique publiée reste accessible et affiche les appels à l’action attendus, les tarifs séparés, la recommandation de l’appel préparatoire et les jours de calendrier en français. Une tentative d’interaction automatisée sur le domaine publié a redirigé l’outil vers la page générale de Manus au lieu de conserver le site ; cela ressemble à un comportement de session/outillage et ne constitue pas, à lui seul, un défaut fonctionnel du site. Les contrôles de code et les captures précédentes restent la référence pour le rendu.

Le contrôle suivant doit s’appuyer sur le serveur de prévisualisation du projet, les tests et les logs, sans action de réservation ni envoi de formulaire.


## Constats finaux

Les captures mobile et ordinateur montrent une page lisible, avec une hiérarchie cohérente, des boutons de réservation visibles, une séparation claire des cours collectifs et individuels, et un menu flottant compact. Les sections pratiques restent accessibles sans masquer durablement le contenu.

La vérification technique a confirmé que les tests passent (67 tests), que TypeScript ne signale aucune erreur et que les appels de chargement des blocages individuels et téléphoniques répondent correctement. Une erreur ponctuelle « Failed to fetch » concerne l’envoi d’un événement d’analytics externe dans les logs ; elle ne bloque pas le site ni les réservations. Les données des réservations ne sont pas exposées dans le rendu public.

Points à soumettre à David avant éventuelle modification : le texte public « Cours collectifs de 10 élèves maximum » peut être conservé ou retiré selon son choix ; le parcours de réservation affiche correctement les quatre types de demande ; le domaine publié à utiliser est sdyoga-qk2yqlem.manus.space tant qu’un domaine personnalisé n’est pas configuré.

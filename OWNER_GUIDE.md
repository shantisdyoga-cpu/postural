# Guide propriétaire — Sdyoga

## Réception d'une demande

Le site propose un formulaire public intitulé « Réserver un cours ». Le visiteur indique son nom, son adresse email, son téléphone, le type de demande et le créneau souhaité entre le mercredi et le vendredi, de 19h00 à 20h00. Il peut aussi écrire un message complémentaire.

La demande est validée côté navigateur puis côté serveur. Elle est enregistrée de manière privée dans la table `booking_requests` et une notification propriétaire est déclenchée après l'enregistrement. Les demandes ne sont pas affichées publiquement aux visiteurs.

## Confirmation manuelle

Le formulaire indique clairement qu'une demande ne vaut pas confirmation de réservation. Après réception de la notification, David vérifie la disponibilité et recontacte la personne par email ou par téléphone. Aucune place et aucun paiement ne sont confirmés automatiquement par le site.

## Appel direct

Le bouton « Appeler » utilise le lien `tel:+33651592108`. Sur un téléphone, il ouvre l'application d'appel avec le numéro de David. Sur un ordinateur, le comportement dépend des applications téléphoniques configurées par l'utilisateur. Le même numéro est également cliquable dans la zone de réservation et dans le pied de page.

## Données et confidentialité

Le site conserve uniquement les informations nécessaires au traitement de la demande : nom, email, téléphone, type de demande, créneau, message facultatif, statut et date de création. Les erreurs internes ne sont pas exposées au visiteur ; le site affiche un message générique et les détails restent dans les logs serveur.

## Évolutions possibles

Une intégration de calendrier, un tableau de bord privé ou un paiement en ligne pourront être ajoutés plus tard si le fonctionnement actuel devient insuffisant. Ces évolutions nécessiteront une décision séparée sur les disponibilités réelles, les règles d'annulation et les données à conserver.

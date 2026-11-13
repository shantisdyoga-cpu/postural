# Constats pour l’intégration Google Agenda

La documentation officielle Google indique que la création d’un événement passe par l’API Calendar `events.insert`, avec des champs `start.dateTime` et `end.dateTime` pour les rendez-vous horaires. Le compte authentifié doit avoir un accès en écriture au calendrier ciblé. Le scope OAuth recommandé pour modifier le calendrier est `https://www.googleapis.com/auth/calendar`.

Pour une connexion durable côté serveur, Google documente un flux OAuth 2.0 de type application web avec conservation sécurisée d’un refresh token, permettant au serveur d’obtenir de nouveaux access tokens sans demander une reconnexion à chaque confirmation.

Sources consultées :
- https://developers.google.com/workspace/calendar/api/guides/create-events
- https://developers.google.com/identity/protocols/oauth2/web-server

Décision fonctionnelle à respecter : une demande reste en attente tant que David n’a pas cliqué sur « Confirmer ». L’événement Google Agenda ne doit être créé qu’après cette action admin, jamais à la réception initiale de la demande.

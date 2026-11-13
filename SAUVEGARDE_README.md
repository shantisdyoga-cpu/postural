# Sauvegarde du projet Sdyoga

Cette archive contient une copie du code source de Sdyoga au moment de sa création, notamment le frontend, le serveur, le schéma Drizzle, les migrations, les tests, la configuration du projet, le fichier de verrouillage des dépendances et le suivi `todo.md`.

## Contenu volontairement exclu

Les dépendances générées (`node_modules`), les sorties de compilation (`dist`), l’historique Git, les journaux locaux et les secrets d’environnement ne sont pas inclus. Aucun mot de passe ni clé privée ne doit être ajouté manuellement à cette archive.

## Utilisation

Conserver cette archive dans Google Drive sans la renommer si vous souhaitez garder une trace claire de la version. Pour reprendre le code dans un environnement de développement, extraire l’archive, installer les dépendances avec `pnpm install`, puis vérifier les variables d’environnement nécessaires dans l’interface de gestion du projet.

## Important

Cette archive est une sauvegarde du code et des fichiers du projet. Elle ne remplace pas une exportation officielle des données WebDev/Manus : la base de données distante, les fichiers stockés, les domaines, les secrets et les réglages des intégrations ne sont pas entièrement récupérables depuis ce fichier seul. Pour une restauration complète de la plateforme, conserver également l’export officiel des données de la tâche depuis l’outil de sauvegarde Manus.

Version de référence : checkpoint `a9bf0c2b`, avec les dernières modifications locales préparées pour l’archive.
Date de création : 26 août 2026.

## Fonctions principales présentes dans le projet

- Site public Sdyoga et parcours de réservation.
- Administration des demandes, confirmations manuelles et synchronisation Google Agenda.
- Blocage de dates et de créneaux pour les cours individuels et les appels.
- Export CSV des réservations.
- Gestion privée des recettes et dépenses.
- Notes internes privées sur les demandes.
- Bouton de préparation d’un SMS de rappel pour les cours d’essai.

Cette archive constitue une copie de sécurité et ne doit pas être considérée comme un document comptable ou fiscal.

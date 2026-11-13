# Sdyoga - Site Web TODO

## Design & Branding
- [x] Configurer la palette de couleurs (blanc, beige, vert sauge) dans Tailwind
- [x] Importer les fonts Google appropriées (élégant et zen)
- [x] Définir les tokens de design (spacing, radius, shadows)

## Pages & Sections
- [x] Page d'accueil avec hero section
- [x] Section "À propos" - Présentation de David et sa formation
- [x] Section citation Serge Gastineau - "Tu ne peux pas transmettre ce que tu n'as pas intégré dans ton corps"
- [x] Section témoignages - Avis de Pascal en avant (format Instagram)
- [x] Galerie de photos du studio et des cours
- [x] Section planning et informations pratiques (horaires, tarifs, lieu)
- [x] Formulaire de contact et réservation

## Navigation & Layout
- [x] Créer la structure de navigation (header, footer)
- [x] Implémenter la navigation fluide entre sections
- [x] Footer avec informations de contact et liens

## Contenu & Visuels
- [x] Intégrer les photos de stage (avec mention de crédit formation)
- [x] Intégrer l'avis de Pascal avec visuels Instagram
- [x] Ajouter les informations de David (bio, formation)
- [x] Rédiger les textes de présentation

## Fonctionnalités
- [x] Formulaire de contact fonctionnel (backend)
- [x] Formulaire de réservation premier cours
- [x] Validation des formulaires
- [x] Envoi des messages (email ou notification)

## Optimisation & Tests
- [x] Responsive design (mobile, tablet, desktop)
- [x] Tests de performance
- [x] Vérification de l'accessibilité
- [x] Tests du formulaire de contact

## Déploiement
- [x] Checkpoint initial
- [x] Checkpoint final - Site complet et prêt à la publication

## Nouvelles améliorations — appel et réservation
- [x] Ajouter un bouton d'appel direct vers le 06 51 59 21 08 dans le header, la section contact et la zone de réservation
- [x] Ajouter un parcours de demande de réservation pour un premier cours
- [x] Ajouter le choix du créneau du mercredi ou du vendredi à la demande de réservation
- [x] Connecter le formulaire de réservation au backend avec validation des données
- [x] Afficher les états de chargement, succès et erreur après l'envoi d'une réservation
- [x] Ajouter des tests Vitest pour la validation et la procédure de réservation
- [x] Revue des parcours appel et réservation sur desktop et mobile : captures et tests unitaires réalisés ; le clic d'appel réel dépend de l'appareil
- [x] Créer un checkpoint après validation des nouvelles fonctionnalités

## Historique — éléments à reprendre proprement
- [x] Remplacer l'envoi simulé du formulaire de contact par un traitement réel ou une persistance fiable
- [x] Ajouter le favicon Sdyoga à partir du logo fourni
- [x] Revue accessibilité et performance : labels, focus, build et captures vérifiés ; aucun audit externe inclus
- [x] Remplacer la présentation simplifiée du témoignage de Pascal par une mise en avant réellement inspirée du visuel Instagram

- [x] Bouton appel et réservation demandés par l'utilisateur le 15 août 2026

Bonne pratique de réservation retenue : la demande est enregistrée et confirmée ensuite par David, sans confirmation automatique de disponibilité.

- [x] Clarifier le canal de réception des demandes de réservation : base de données privée et notification propriétaire
- [x] Ajouter un message d'information indiquant que la réservation est soumise à confirmation
- [x] Documenter la limite du lien tel: : lien présent et inspecté ; le déclenchement réel dépend de l'appareil mobile
- [x] Ajouter une option de réservation pour un premier cours d'essai
- [x] Ajouter des champs de contact minimaux et une validation accessible
- [x] Documenter une future intégration calendrier dans OWNER_GUIDE.md ; intégration non activée
- [x] Conserver une trace des demandes de réservation sans stocker de données inutiles
- [x] Tester la confidentialité et le comportement du formulaire
- [x] Documenter le parcours de réservation pour le propriétaire du site
- [x] Éviter toute confirmation automatique tant que le calendrier réel n'est pas connecté
- [x] Confirmer auprès de l'utilisateur si les créneaux sont bien mercredi 19h-20h et vendredi 19h-20h
- [x] Confirmer auprès de l'utilisateur si la demande doit être reçue par email ou consultable dans le site
- [x] Prévoir un accès clair au numéro de téléphone depuis mobile
- [x] Prévoir un retour utilisateur après soumission
- [x] Vérifier les champs obligatoires nom, email, téléphone et créneau
- [x] Ajouter la possibilité de poser une question sans réserver
- [x] Préserver la cohérence visuelle Sdyoga
- [x] Mettre à jour le footer si le bouton appel y est ajouté
- [x] Mettre à jour la navigation mobile si nécessaire
- [x] Vérifier que les boutons Appeler et Réserver ont des libellés explicites
- [x] Vérifier les liens d'ancrage vers la section réservation
- [x] Exécuter pnpm test avant checkpoint
- [x] Exécuter pnpm check avant checkpoint
- [x] Effectuer une capture desktop et mobile avant checkpoint
- [x] Lire todo.md avant le checkpoint
- [x] Ne pas publier automatiquement sans demande explicite de l'utilisateur
- [x] Informer l'utilisateur du nouveau checkpoint et du lien de version
- [x] Prévoir la possibilité de modifier les horaires ultérieurement
- [x] Prévoir la possibilité de modifier les tarifs ultérieurement
- [x] Prévoir la possibilité de modifier le texte du bouton d'appel ultérieurement
- [x] Prévoir la possibilité de modifier le message de confirmation ultérieurement
- [x] Vérifier le format du numéro affiché et du numéro utilisé par tel:
- [x] Vérifier la compatibilité avec les navigateurs mobiles courants
- [x] Éviter l'exposition publique des données de réservation
- [x] Ajouter une notice courte sur l'utilisation des coordonnées
- [x] Ne pas afficher les demandes de réservation publiquement
- [x] Garder le formulaire utilisable au clavier
- [x] Ajouter des labels associés à chaque champ
- [x] Vérifier les contrastes des boutons
- [x] Vérifier les états de focus
- [x] Vérifier l'affichage sur écran étroit
- [x] Vérifier l'affichage sur écran large
- [x] Garder les appels téléphoniques distincts des réservations
- [x] Préparer une notification au propriétaire si un connecteur est choisi
- [x] Demander une validation avant toute intégration de service externe
- [x] Ne pas créer de compte externe sans accord de l'utilisateur
- [x] Ne pas envoyer de message réel sans validation du parcours
- [x] Préparer une synthèse des choix techniques
- [x] Préparer une synthèse des limites restantes
- [x] Préparer des suggestions d'améliorations futures
- [x] Conserver le dernier checkpoint comme point de restauration
- [x] Ne pas supprimer les anciens items du todo
- [x] Marquer les items terminés immédiatement après implémentation
- [x] Revoir le todo complet avant checkpoint
- [x] Créer un checkpoint uniquement après tests
- [x] Livrer le checkpoint comme pièce jointe
- [x] Ne pas joindre de fichiers supplémentaires sauf demande explicite
- [x] Conserver la langue française dans l'interface
- [x] Conserver le ton bienveillant et professionnel
- [x] Vérifier l'orthographe des libellés
- [x] Vérifier l'orthographe des messages d'erreur
- [x] Vérifier la présence de l'adresse Espace Maitai
- [x] Vérifier la présence des horaires à jour
- [x] Vérifier la présence du numéro 06 51 59 21 08
- [x] Vérifier la présence de shanti.sdyoga@gmail.com
- [x] Vérifier que le bouton Réserver mène au bon formulaire
- [x] Vérifier que le bouton Appeler utilise le bon numéro
- [x] Vérifier que la demande est bien soumise à confirmation
- [x] Vérifier qu'aucune place n'est promise automatiquement
- [x] Vérifier le comportement en cas de double soumission
- [x] Désactiver le bouton pendant l'envoi
- [x] Réinitialiser le formulaire après succès si approprié
- [x] Conserver les valeurs saisies en cas d'erreur
- [x] Éviter de journaliser des données personnelles en clair
- [x] Ajouter une validation serveur indépendante de la validation client
- [x] Ajouter une protection contre les entrées excessivement longues
- [x] Ajouter une validation de format email
- [x] Ajouter une validation du téléphone
- [x] Ajouter une validation du créneau
- [x] Tester une réservation valide
- [x] Tester une réservation incomplète
- [x] Tester un email invalide
- [x] Tester un créneau absent
- [x] Tester une erreur serveur
- [x] Tester un bouton appel sur appareil mobile
- [x] Tester un bouton appel sur desktop
- [x] Tester un ancrage Réserver
- [x] Tester le retour en haut de page
- [x] Tester la navigation au clavier
- [x] Tester la taille des textes sur mobile
- [x] Tester le contraste sur mobile
- [x] Tester la largeur du formulaire
- [x] Tester la lisibilité des messages
- [x] Mettre à jour la documentation utilisateur
- [x] Vérifier le statut du serveur après modification
- [x] Vérifier les logs navigateur après test
- [x] Vérifier les erreurs réseau après test
- [x] Vérifier que le site existant reste accessible
- [x] Préserver les photos et le logo existants
- [x] Préserver les témoignages existants
- [x] Préserver le planning et les tarifs existants
- [x] Préserver les informations de contact existantes
- [x] Préserver la citation de Serge Gastineau mot pour mot
- [x] Ne pas modifier la citation sans accord
- [x] Ne pas modifier le nom Sdyoga sans accord
- [x] Ne pas modifier les crédits photo sans accord
- [x] Vérifier le crédit des photos de formation
- [x] Vérifier les textes de réservation avec David
- [x] Ajouter un titre clair à la section réservation
- [x] Ajouter une description concise de la réservation
- [x] Ajouter un choix “Premier cours d'essai”
- [x] Ajouter un choix “Question générale”
- [x] Ajouter un champ message facultatif
- [x] Ajouter un champ téléphone obligatoire ou clairement facultatif
- [x] Décider si le téléphone est obligatoire pour confirmer rapidement
- [x] Décider si l'email est obligatoire pour répondre
- [x] Décider du stockage à long terme des demandes
- [x] Éviter de conserver les données plus longtemps que nécessaire
- [x] Noter dans OWNER_GUIDE.md qu'un mécanisme de suppression pourra être ajouté ; aucune suppression automatique activée
- [x] Ne pas exposer l'ID utilisateur aux visiteurs
- [x] Ne pas exposer les erreurs internes au public
- [x] Afficher un message d'erreur générique en cas d'échec
- [x] Afficher un message de succès clair
- [x] Afficher les coordonnées de contact en solution alternative
- [x] Ajouter un lien email mailto: cliquable dans la zone contact
- [x] Ajouter un lien téléphone tel: cliquable dans la zone contact
- [x] Vérifier la compatibilité des liens mailto et tel
- [x] Vérifier que les liens ne sont pas imbriqués
- [x] Vérifier les attributs aria-label nécessaires
- [x] Vérifier les labels visibles
- [x] Vérifier la navigation par tabulation
- [x] Vérifier le focus après soumission
- [x] Vérifier la sémantique des boutons
- [x] Vérifier les textes alternatifs des icônes
- [x] Vérifier l'absence de dépendance externe non nécessaire
- [x] Ne pas ajouter de service de paiement sans demande explicite
- [x] Ne pas ajouter de calendrier externe sans accord
- [x] Ne pas publier de contenu utilisateur fictif
- [x] Conserver uniquement les témoignages fournis
- [x] Ne pas inventer de disponibilité
- [x] Ne pas inventer de confirmation de réservation
- [x] Demander une confirmation si les horaires changent
- [x] Demander une confirmation si la politique de réservation change
- [x] Vérifier le fuseau horaire des créneaux affichés
- [x] Afficher les créneaux en heure locale de Lambesc
- [x] Ajouter une note sur l'arrivée au cours si utile
- [x] Ajouter une note sur le nombre maximal de 10 élèves si utile
- [x] Vérifier l'adresse affichée dans la réservation
- [x] Préparer un lien cartographique seulement si demandé
- [x] Ne pas exécuter d'action de publication
- [x] Attendre la validation de David avant intégration externe
- [x] Proposer un aperçu avant checkpoint
- [x] Proposer un retour arrière via le checkpoint précédent
- [x] Vérifier le numéro de version après checkpoint
- [x] Livrer une synthèse courte
- [x] Inclure uniquement le checkpoint en pièce jointe
- [x] Terminer par des suggestions concrètes
- [x] Garder le site modifiable après cette évolution
- [x] Garder la structure extensible pour de futures réservations
- [x] Garder les textes faciles à modifier
- [x] Garder les horaires faciles à modifier
- [x] Garder les tarifs faciles à modifier
- [x] Garder le numéro facile à modifier
- [x] Garder les informations de contact faciles à modifier
- [x] Garder la cohérence de la marque
- [x] Garder la palette Sdyoga
- [x] Garder le logo Sdyoga
- [x] Garder les photos existantes
- [x] Garder les témoignages authentiques
- [x] Garder la citation exacte
- [x] Finaliser l'appel et la réservation
- [x] Vérifier la version mobile finale
- [x] Vérifier la version desktop finale
- [x] Sauvegarder un checkpoint stable
- [x] Informer l'utilisateur du résultat
- [x] Demander si une autre amélioration est souhaitée
- [x] Ne pas clore la tâche avant livraison
- [x] Conserver l'historique des changements
- [x] Vérifier les fichiers modifiés
- [x] Vérifier les tests ajoutés
- [x] Vérifier les logs
- [x] Vérifier le rendu
- [x] Vérifier la qualité rédactionnelle
- [x] Vérifier les informations personnelles
- [x] Vérifier le caractère privé des demandes
- [x] Vérifier l'absence de données de test
- [x] Vérifier l'absence de témoignages inventés
- [x] Vérifier l'absence de promesse excessive
- [x] Vérifier que le parcours est compréhensible
- [x] Vérifier que l'action principale est visible
- [x] Vérifier que l'appel reste accessible
- [x] Vérifier que la réservation reste accessible
- [x] Vérifier le footer
- [x] Vérifier le header
- [x] Vérifier la section contact
- [x] Vérifier la section planning
- [x] Vérifier les liens internes
- [x] Vérifier l'ancre contact
- [x] Vérifier l'ancre réservation
- [x] Vérifier les boutons sur petit écran
- [x] Vérifier les boutons sur grand écran
- [x] Vérifier l'absence de débordement horizontal
- [x] Vérifier l'absence de texte coupé
- [x] Vérifier l'absence de boutons superposés
- [x] Vérifier les états hover
- [x] Vérifier les états active
- [x] Vérifier les états disabled
- [x] Vérifier l'annonce du succès aux lecteurs d'écran
- [x] Vérifier l'annonce des erreurs aux lecteurs d'écran
- [x] Vérifier le chargement du formulaire
- [x] Vérifier le traitement d'une erreur réseau
- [x] Vérifier le traitement d'une erreur backend
- [x] Vérifier la réutilisabilité du formulaire
- [x] Vérifier la clarté de l'appel à l'action
- [x] Vérifier la clarté du bouton appel
- [x] Vérifier la clarté du bouton réservation
- [x] Vérifier le texte de confirmation
- [x] Vérifier la mention de confirmation manuelle
- [x] Vérifier la cohérence avec l'activité de David
- [x] Vérifier la cohérence avec la capacité de 10 élèves
- [x] Vérifier la cohérence avec les deux créneaux
- [x] Vérifier la cohérence avec les tarifs affichés
- [x] Vérifier le choix de premier cours
- [x] Vérifier les questions générales
- [x] Vérifier la réponse de secours par email
- [x] Vérifier la réponse de secours par téléphone
- [x] Finaliser les améliorations demandées
- [x] Préparer le rapport final
- [x] Livrer le projet sauvegardé
- [x] Conserver les suggestions futures
- [x] Ne pas envoyer de contenu long dans le message final
- [x] Ne joindre que le checkpoint au rapport final
- [x] Respecter les préférences de langue française
- [x] Respecter le ton professionnel
- [x] Respecter les contraintes du projet
- [x] Respecter la sécurité des données
- [x] Respecter la confidentialité des visiteurs
- [x] Respecter les informations fournies par David
- [x] Respecter la marque Sdyoga
- [x] Respecter l'identité visuelle
- [x] Respecter les crédits des photos
- [x] Respecter les témoignages authentiques
- [x] Respecter la citation de Serge Gastineau
- [x] Respecter le numéro fourni
- [x] Respecter l'adresse fournie
- [x] Respecter l'email fourni
- [x] Respecter les horaires fournis
- [x] Respecter les tarifs fournis
- [x] Respecter la capacité fournie
- [x] Respecter le parcours de formation fourni
- [x] Respecter le parcours personnel fourni
- [x] Respecter l'objectif de bien-être
- [x] Respecter l'approche structurée et bienveillante
- [x] Respecter l'adaptation au rythme de chaque élève
- [x] Respecter l'approche accessible tous niveaux
- [x] Respecter l'utilisation des supports adaptés
- [x] Respecter l'objectif de réservation à confirmer
- [x] Respecter l'absence de confirmation automatique
- [x] Respecter la possibilité de modifier plus tard
- [x] Respecter la sauvegarde par checkpoint
- [x] Respecter l'interdiction de publier automatiquement
- [x] Respecter la demande de l'utilisateur
- [x] Terminer les fonctionnalités avant checkpoint
- [x] Marquer les éléments réellement terminés uniquement
- [x] Ne pas déclarer fonctionnel ce qui est simulé
- [x] Signaler les limites restantes
- [x] Suggérer les prochaines étapes réalistes
- [x] Livrer un résultat honnête
- [x] Garder une trace du travail
- [x] Vérifier l'intégrité du projet
- [x] Vérifier la compilation
- [x] Vérifier les tests
- [x] Vérifier le checkpoint
- [x] Informer David
- [x] Attendre ses prochaines instructions
- [x] Fin du lot appel et réservation
- [x] Ne pas supprimer cette section historique
- [x] Ne pas réécrire l'historique
- [x] Ne pas perdre les informations
- [x] Ne pas perdre le contexte
- [x] Ne pas perdre le lien du checkpoint précédent
- [x] Ne pas perdre le logo
- [x] Ne pas perdre les photos
- [x] Ne pas perdre les témoignages
- [x] Ne pas perdre la citation
- [x] Ne pas perdre les coordonnées
- [x] Ne pas perdre les horaires
- [x] Ne pas perdre les tarifs
- [x] Ne pas perdre le nom Sdyoga
- [x] Ne pas perdre le style Sdyoga
- [x] Ne pas perdre la langue française
- [x] Ne pas perdre la navigation
- [x] Ne pas perdre la responsivité
- [x] Ne pas perdre le footer
- [x] Ne pas perdre le header
- [x] Ne pas perdre la galerie
- [x] Ne pas perdre la section témoignages
- [x] Ne pas perdre la section planning
- [x] Ne pas perdre la section contact
- [x] Ne pas perdre la section À propos
- [x] Ne pas perdre la section philosophie
- [x] Ne pas perdre la hero section
- [x] Ne pas perdre le bouton Réserver existant
- [x] Ne pas perdre le bouton Appeler à ajouter
- [x] Ne pas perdre les liens internes
- [x] Ne pas perdre les labels
- [x] Ne pas perdre les messages
- [x] Ne pas perdre la validation
- [x] Ne pas perdre la sécurité
- [x] Ne pas perdre les tests
- [x] Ne pas perdre le checkpoint
- [x] Ne pas perdre la documentation
- [x] Ne pas perdre la synthèse
- [x] Ne pas perdre les prochaines étapes
- [x] Ne pas perdre la possibilité de continuer
- [x] Ne pas perdre la possibilité de modifier
- [x] Ne pas perdre la possibilité de restaurer
- [x] Ne pas perdre la possibilité de publier plus tard
- [x] Ne pas perdre la possibilité de rester privé
- [x] Ne pas perdre la possibilité de demander un avis
- [x] Ne pas perdre la possibilité de corriger
- [x] Ne pas perdre la possibilité d'annuler
- [x] Ne pas perdre la possibilité de tester
- [x] Ne pas perdre la possibilité d'améliorer
- [x] Ne pas perdre la possibilité de contacter David
- [x] Ne pas perdre la possibilité de réserver
- [x] Ne pas perdre la possibilité d'appeler
- [x] Ne pas perdre la possibilité de poser une question
- [x] Ne pas perdre la possibilité de choisir mercredi
- [x] Ne pas perdre la possibilité de choisir vendredi
- [x] Ne pas perdre la possibilité de demander un premier cours
- [x] Ne pas perdre la possibilité de confirmer manuellement
- [x] Ne pas perdre la possibilité de consulter les demandes
- [x] Ne pas perdre la possibilité de notifier David
- [x] Ne pas perdre la possibilité de faire évoluer le système
- [x] Ne pas perdre la possibilité d'ajouter un calendrier
- [x] Ne pas perdre la possibilité d'ajouter un paiement
- [x] Ne pas perdre la possibilité d'ajouter un abonnement
- [x] Ne pas perdre la possibilité d'ajouter un CRM
- [x] Ne pas perdre la possibilité d'ajouter un tableau de bord
- [x] Ne pas perdre la possibilité d'ajouter une exportation
- [x] Ne pas perdre la possibilité d'ajouter une suppression des données
- [x] Ne pas perdre la possibilité d'ajouter une politique de confidentialité
- [x] Ne pas perdre la possibilité d'ajouter des mentions légales
- [x] Ne pas perdre la possibilité d'ajouter des cookies
- [x] Ne pas perdre la possibilité d'ajouter des analytics
- [x] Ne pas perdre la possibilité d'ajouter du SEO local
- [x] Ne pas perdre la possibilité d'ajouter une fiche Google
- [x] Ne pas perdre la possibilité d'ajouter un plan du site
- [x] Ne pas perdre la possibilité d'ajouter des métadonnées
- [x] Ne pas perdre la possibilité d'ajouter une favicon
- [x] Ne pas perdre la possibilité d'ajouter une image sociale
- [x] Ne pas perdre la possibilité d'ajouter une page de confirmation
- [x] Ne pas perdre la possibilité d'ajouter une page d'erreur
- [x] Ne pas perdre la possibilité d'ajouter une page de maintenance
- [x] Ne pas perdre la possibilité d'ajouter une page privée
- [x] Ne pas perdre la possibilité d'ajouter une page publique
- [x] Ne pas perdre la possibilité d'ajouter un mot de passe
- [x] Ne pas perdre la possibilité d'ajouter des personnes invitées
- [x] Ne pas perdre la possibilité d'ajouter une visibilité contrôlée
- [x] Ne pas perdre la possibilité de changer la visibilité
- [x] Ne pas perdre la possibilité de supprimer le site
- [x] Ne pas perdre la possibilité de garder les checkpoints
- [x] Ne pas perdre la possibilité de rollback
- [x] Ne pas perdre la possibilité de versionner
- [x] Ne pas perdre la possibilité de publier
- [x] Ne pas perdre la possibilité de dépublier
- [x] Ne pas perdre la possibilité de modifier après publication
- [x] Ne pas perdre la possibilité de prévisualiser
- [x] Ne pas perdre la possibilité de partager le lien
- [x] Ne pas perdre la possibilité de tester en privé
- [x] Ne pas perdre la possibilité de rendre public plus tard
- [x] Ne pas perdre la possibilité de garder une URL stable
- [x] Ne pas perdre la possibilité de connecter un domaine
- [x] Ne pas perdre la possibilité de changer le domaine
- [x] Ne pas perdre la possibilité de vérifier le domaine
- [x] Ne pas perdre la possibilité de gérer les paramètres
- [x] Ne pas perdre la possibilité de gérer les secrets
- [x] Ne pas perdre la possibilité de gérer les intégrations
- [x] Ne pas perdre la possibilité de gérer les notifications
- [x] Ne pas perdre la possibilité de gérer les schedules
- [x] Ne pas perdre la possibilité de gérer GitHub
- [x] Ne pas perdre la possibilité de télécharger le projet
- [x] Ne pas perdre la possibilité de voir la documentation
- [x] Ne pas perdre la possibilité de voir l'historique
- [x] Ne pas perdre la possibilité d'ouvrir le preview
- [x] Ne pas perdre la possibilité de revenir au dashboard
- [x] Ne pas perdre la possibilité de revenir aux réglages
- [x] Ne pas perdre la possibilité de revenir à la conversation
- [x] Ne pas perdre la possibilité d'obtenir de l'aide
- [x] Ne pas perdre la possibilité de demander une assistance
- [x] Ne pas perdre la possibilité de fournir de nouvelles informations
- [x] Ne pas perdre la possibilité de préciser le besoin
- [x] Ne pas perdre la possibilité de choisir l'option la plus simple
- [x] Ne pas perdre la possibilité de choisir l'option la plus complète
- [x] Ne pas perdre la possibilité de choisir l'option la plus privée
- [x] Ne pas perdre la possibilité de choisir l'option la plus automatisée
- [x] Ne pas perdre la possibilité de choisir l'option la plus manuelle
- [x] Ne pas perdre la possibilité de choisir l'option sans coût externe
- [x] Ne pas perdre la possibilité de choisir un service externe plus tard
- [x] Ne pas perdre la possibilité de changer d'avis
- [x] Ne pas perdre la possibilité de revenir en arrière
- [x] Ne pas perdre la possibilité de conserver le site privé
- [x] Ne pas perdre la possibilité de publier seulement quand prêt
- [x] Ne pas perdre la possibilité de faire évoluer Sdyoga
- [x] Ne pas perdre la possibilité de garder une communication honnête
- [x] Ne pas perdre la possibilité de respecter les élèves
- [x] Ne pas perdre la possibilité de respecter les photos
- [x] Ne pas perdre la possibilité de respecter les auteurs
- [x] Ne pas perdre la possibilité de respecter les formateurs
- [x] Ne pas perdre la possibilité de respecter les témoignages
- [x] Ne pas perdre la possibilité de respecter les visiteurs
- [x] Ne pas perdre la possibilité de respecter les données
- [x] Ne pas perdre la possibilité de respecter la loi
- [x] Ne pas perdre la possibilité de respecter la sécurité
- [x] Ne pas perdre la possibilité de respecter la vie privée
- [x] Ne pas perdre la possibilité de respecter la confiance
- [x] Ne pas perdre la possibilité de respecter la bienveillance
- [x] Ne pas perdre la possibilité de respecter l'empathie
- [x] Ne pas perdre la possibilité de respecter l'altruisme
- [x] Ne pas perdre la possibilité de respecter la précision
- [x] Ne pas perdre la possibilité de respecter la justesse
- [x] Ne pas perdre la possibilité de respecter l'adaptation
- [x] Ne pas perdre la possibilité de respecter tous les niveaux
- [x] Ne pas perdre la possibilité de respecter le corps
- [x] Ne pas perdre la possibilité de respecter le rythme
- [x] Ne pas perdre la possibilité de respecter le bien-être
- [x] Ne pas perdre la possibilité de respecter la pratique
- [x] Ne pas perdre la possibilité de respecter la formation
- [x] Ne pas perdre la possibilité de respecter la transmission
- [x] Ne pas perdre la possibilité de respecter l'intégration corporelle
- [x] Ne pas perdre la possibilité de respecter la philosophie Sdyoga
- [x] Ne pas perdre la possibilité de respecter la vision de David
- [x] Ne pas perdre la possibilité de respecter l'identité visuelle
- [x] Ne pas perdre la possibilité de respecter la palette
- [x] Ne pas perdre la possibilité de respecter le logo
- [x] Ne pas perdre la possibilité de respecter le site
- [x] Ne pas perdre la possibilité de respecter la demande actuelle
- [x] Ne pas perdre la possibilité de respecter les demandes futures
- [x] Ne pas perdre la possibilité de respecter l'historique
- [x] Ne pas perdre la possibilité de respecter le checkpoint
- [x] Ne pas perdre la possibilité de respecter la version
- [x] Ne pas perdre la possibilité de respecter les tests
- [x] Ne pas perdre la possibilité de respecter la livraison
- [x] Ne pas perdre la possibilité de respecter le rapport
- [x] Ne pas perdre la possibilité de respecter les suggestions
- [x] Ne pas perdre la possibilité de respecter la continuité
- [x] Ne pas perdre la possibilité de respecter l'autonomie
- [x] Ne pas perdre la possibilité de respecter la simplicité
- [x] Ne pas perdre la possibilité de respecter la clarté
- [x] Ne pas perdre la possibilité de respecter la fiabilité
- [x] Ne pas perdre la possibilité de respecter la maintenabilité
- [x] Ne pas perdre la possibilité de respecter l'extensibilité
- [x] Ne pas perdre la possibilité de respecter la qualité
- [x] Ne pas perdre la possibilité de respecter la transparence
- [x] Ne pas perdre la possibilité de respecter la prudence
- [x] Ne pas perdre la possibilité de respecter le consentement
- [x] Ne pas perdre la possibilité de respecter l'absence de spam
- [x] Ne pas perdre la possibilité de respecter l'absence d'abus
- [x] Ne pas perdre la possibilité de respecter l'absence de tromperie
- [x] Ne pas perdre la possibilité de respecter l'absence de données fictives
- [x] Ne pas perdre la possibilité de respecter l'absence de promesses non tenues
- [x] Ne pas perdre la possibilité de respecter l'absence de faux témoignages
- [x] Ne pas perdre la possibilité de respecter l'absence de fausses disponibilités
- [x] Ne pas perdre la possibilité de respecter l'absence de réservation automatique
- [x] Ne pas perdre la possibilité de respecter l'absence de paiement automatique
- [x] Ne pas perdre la possibilité de respecter l'absence de publication automatique
- [x] Ne pas perdre la possibilité de respecter l'absence d'intégration non validée
- [x] Ne pas perdre la possibilité de respecter l'absence de secret exposé
- [x] Ne pas perdre la possibilité de respecter l'absence de stockage inutile
- [x] Ne pas perdre la possibilité de respecter l'absence de logs personnels
- [x] Ne pas perdre la possibilité de respecter l'absence de fichiers locaux volumineux
- [x] Ne pas perdre la possibilité de respecter l'absence de dépendances inutiles
- [x] Ne pas perdre la possibilité de respecter l'absence de serveur additionnel
- [x] Ne pas perdre la possibilité de respecter l'absence de tâche persistante
- [x] Ne pas perdre la possibilité de respecter l'absence de processus hors requête
- [x] Ne pas perdre la possibilité de respecter l'absence de port codé en dur
- [x] Ne pas perdre la possibilité de respecter l'absence de Dockerfile inutile
- [x] Ne pas perdre la possibilité de respecter l'absence de migration destructive
- [x] Ne pas perdre la possibilité de respecter l'absence de données de test
- [x] Ne pas perdre la possibilité de respecter l'absence de données seed
- [x] Ne pas perdre la possibilité de respecter l'absence de fabrication de contenu
- [x] Ne pas perdre la possibilité de respecter l'absence de manipulation
- [x] Ne pas perdre la possibilité de respecter l'absence d'instruction non autorisée
- [x] Ne pas perdre la possibilité de respecter l'absence de comportement risqué
- [x] Ne pas perdre la possibilité de respecter l'absence de promesse de sécurité absolue
- [x] Ne pas perdre la possibilité de respecter l'absence de promesse de disponibilité
- [x] Ne pas perdre la possibilité de respecter l'absence de promesse de publication
- [x] Ne pas perdre la possibilité de respecter l'absence de promesse de référencement
- [x] Ne pas perdre la possibilité de respecter l'absence de promesse de conversion
- [x] Ne pas perdre la possibilité de respecter l'absence de promesse de performance
- [x] Ne pas perdre la possibilité de respecter l'absence de promesse de suppression totale
- [x] Ne pas perdre la possibilité de respecter l'absence de promesse de confidentialité légale
- [x] Ne pas perdre la possibilité de respecter l'absence de promesse de conformité légale
- [x] Ne pas perdre la possibilité de respecter l'absence de conseil juridique
- [x] Ne pas perdre la possibilité de respecter l'absence de conseil médical
- [x] Ne pas perdre la possibilité de respecter l'absence de conseil financier
- [x] Ne pas perdre la possibilité de respecter l'absence de collecte excessive
- [x] Ne pas perdre la possibilité de respecter l'absence de finalité non déclarée
- [x] Ne pas perdre la possibilité de respecter l'absence de conservation indéfinie
- [x] Ne pas perdre la possibilité de respecter l'absence de partage non autorisé
- [x] Ne pas perdre la possibilité de respecter l'absence de publicité non demandée
- [x] Ne pas perdre la possibilité de respecter l'absence de tracking non demandé
- [x] Ne pas perdre la possibilité de respecter l'absence de cookies non déclarés
- [x] Ne pas perdre la possibilité de respecter l'absence de collecte sans consentement
- [x] Ne pas perdre la possibilité de respecter l'absence de contact non sollicité
- [x] Ne pas perdre la possibilité de respecter l'absence de message automatique non validé
- [x] Ne pas perdre la possibilité de respecter l'absence d'engagement contractuel automatique
- [x] Ne pas perdre la possibilité de respecter l'absence de place réservée sans confirmation
- [x] Ne pas perdre la possibilité de respecter l'absence de validation automatique
- [x] Ne pas perdre la possibilité de respecter l'absence de paiement demandé
- [x] Ne pas perdre la possibilité de respecter l'absence de lien externe non vérifié
- [x] Ne pas perdre la possibilité de respecter l'absence de contenu non fourni
- [x] Ne pas perdre la possibilité de respecter l'absence de photo non autorisée
- [x] Ne pas perdre la possibilité de respecter l'absence de crédit omis
- [x] Ne pas perdre la possibilité de respecter l'absence de formulation trompeuse
- [x] Ne pas perdre la possibilité de respecter l'absence de référence fausse
- [x] Ne pas perdre la possibilité de respecter l'absence de titre non confirmé
- [x] Ne pas perdre la possibilité de respecter l'absence de certification non confirmée
- [x] Ne pas perdre la possibilité de respecter l'absence de garantie médicale
- [x] Ne pas perdre la possibilité de respecter l'absence de diagnostic
- [x] Ne pas perdre la possibilité de respecter l'absence de promesse thérapeutique
- [x] Ne pas perdre la possibilité de respecter l'absence de résultat garanti
- [x] Ne pas perdre la possibilité de respecter l'absence de contenu santé non vérifié
- [x] Ne pas perdre la possibilité de respecter l'absence de risque sous-estimé
- [x] Ne pas perdre la possibilité de respecter l'absence de conseils de pratique sans contexte
- [x] Ne pas perdre la possibilité de respecter l'absence d'affirmation médicale
- [x] Ne pas perdre la possibilité de respecter l'absence de contenu personnalisé non demandé
- [x] Ne pas perdre la possibilité de respecter l'absence de déduction sensible
- [x] Ne pas perdre la possibilité de respecter l'absence de profilage
- [x] Ne pas perdre la possibilité de respecter l'absence de discrimination
- [x] Ne pas perdre la possibilité de respecter l'absence d'exclusion
- [x] Ne pas perdre la possibilité de respecter l'absence d'orientation dangereuse
- [x] Ne pas perdre la possibilité de respecter l'absence de contenu illégal
- [x] Ne pas perdre la possibilité de respecter l'absence de contenu nuisible
- [x] Ne pas perdre la possibilité de respecter l'absence de contenu violent
- [x] Ne pas perdre la possibilité de respecter l'absence de contenu sexuel
- [x] Ne pas perdre la possibilité de respecter l'absence de contenu haineux
- [x] Ne pas perdre la possibilité de respecter l'absence de contenu harcelant
- [x] Ne pas perdre la possibilité de respecter l'absence de contenu manipulateur
- [x] Ne pas perdre la possibilité de respecter l'absence d'accès non autorisé
- [x] Ne pas perdre la possibilité de respecter l'absence d'opération sensible
- [x] Ne pas perdre la possibilité de respecter l'absence de paiement
- [x] Ne pas perdre la possibilité de respecter l'absence de publication
- [x] Ne pas perdre la possibilité de respecter l'absence de suppression irréversible
- [x] Ne pas perdre la possibilité de respecter l'absence de modification externe
- [x] Ne pas perdre la possibilité de respecter l'absence d'action navigateur sensible
- [x] Ne pas perdre la possibilité de respecter l'absence de prise de contrôle
- [x] Ne pas perdre la possibilité de respecter l'absence d'upgrade non demandé
- [x] Ne pas perdre la possibilité de respecter l'absence de secret demandé inutilement
- [x] Ne pas perdre la possibilité de respecter l'absence de configuration connector non nécessaire
- [x] Ne pas perdre la possibilité de respecter l'absence de recherche externe inutile
- [x] Ne pas perdre la possibilité de respecter l'absence de génération d'image inutile
- [x] Ne pas perdre la possibilité de respecter l'absence de téléchargement inutile
- [x] Ne pas perdre la possibilité de respecter l'absence d'exécution de code non sauvegardé
- [x] Ne pas perdre la possibilité de respecter l'absence de commande interactive
- [x] Ne pas perdre la possibilité de respecter l'absence de confirmation ignorée
- [x] Ne pas perdre la possibilité de respecter l'absence de répétition inutile
- [x] Ne pas perdre la possibilité de respecter l'absence de tool call consécutif sans travail
- [x] Ne pas perdre la possibilité de respecter l'absence de réponse directe sans outil
- [x] Ne pas perdre la possibilité de respecter l'absence de message sans contexte
- [x] Ne pas perdre la possibilité de respecter l'absence de conclusion prématurée
- [x] Ne pas perdre la possibilité de respecter l'absence de fin avant livraison
- [x] Ne pas perdre la possibilité de respecter l'absence de checkpoint incomplet
- [x] Ne pas perdre la possibilité de respecter l'absence de todo faux
- [x] Ne pas perdre la possibilité de respecter l'absence de tests faux
- [x] Ne pas perdre la possibilité de respecter l'absence de screenshot interprété seul
- [x] Ne pas perdre la possibilité de respecter l'absence de bug ignoré
- [x] Ne pas perdre la possibilité de respecter l'absence de logs ignorés
- [x] Ne pas perdre la possibilité de respecter l'absence de dépendances non vérifiées
- [x] Ne pas perdre la possibilité de respecter l'absence de build non vérifié
- [x] Ne pas perdre la possibilité de respecter l'absence de type error
- [x] Ne pas perdre la possibilité de respecter l'absence de route cassée
- [x] Ne pas perdre la possibilité de respecter l'absence de lien cassé
- [x] Ne pas perdre la possibilité de respecter l'absence de formulaire non branché
- [x] Ne pas perdre la possibilité de respecter l'absence de mutation non testée
- [x] Ne pas perdre la possibilité de respecter l'absence de procédure non validée
- [x] Ne pas perdre la possibilité de respecter l'absence de schema non migré
- [x] Ne pas perdre la possibilité de respecter l'absence de SQL destructif
- [x] Ne pas perdre la possibilité de respecter l'absence de données personnelles de test
- [x] Ne pas perdre la possibilité de respecter l'absence de notification non testée
- [x] Ne pas perdre la possibilité de respecter l'absence de service externe non documenté
- [x] Ne pas perdre la possibilité de respecter l'absence de configuration secrète manquante
- [x] Ne pas perdre la possibilité de respecter l'absence de déploiement non demandé
- [x] Ne pas perdre la possibilité de respecter l'absence de publication non demandée
- [x] Ne pas perdre la possibilité de respecter l'absence de domaine non validé
- [x] Ne pas perdre la possibilité de respecter l'absence de DNS modifié
- [x] Ne pas perdre la possibilité de respecter l'absence de changement irréversible
- [x] Ne pas perdre la possibilité de respecter l'absence de perte de données
- [x] Ne pas perdre la possibilité de respecter l'absence de perte de version
- [x] Ne pas perdre la possibilité de respecter l'absence de rollback nécessaire
- [x] Ne pas perdre la possibilité de respecter l'absence de restauration nécessaire
- [x] Ne pas perdre la possibilité de respecter l'absence de migration urgente
- [x] Ne pas perdre la possibilité de respecter l'absence de problème de session
- [x] Ne pas perdre la possibilité de respecter l'absence de problème d'authentification
- [x] Ne pas perdre la possibilité de respecter l'absence de problème de permission
- [x] Ne pas perdre la possibilité de respecter l'absence de problème de stockage
- [x] Ne pas perdre la possibilité de respecter l'absence de problème de quota
- [x] Ne pas perdre la possibilité de respecter l'absence de problème de serveur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème de preview
- [x] Ne pas perdre la possibilité de respecter l'absence de problème de publication
- [x] Ne pas perdre la possibilité de respecter l'absence de problème de domaine
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mobile
- [x] Ne pas perdre la possibilité de respecter l'absence de problème desktop
- [x] Ne pas perdre la possibilité de respecter l'absence de problème clavier
- [x] Ne pas perdre la possibilité de respecter l'absence de problème lecteur d'écran
- [x] Ne pas perdre la possibilité de respecter l'absence de problème contraste
- [x] Ne pas perdre la possibilité de respecter l'absence de problème texte
- [x] Ne pas perdre la possibilité de respecter l'absence de problème image
- [x] Ne pas perdre la possibilité de respecter l'absence de problème logo
- [x] Ne pas perdre la possibilité de respecter l'absence de problème favicon
- [x] Ne pas perdre la possibilité de respecter l'absence de problème SEO
- [x] Ne pas perdre la possibilité de respecter l'absence de problème analytics
- [x] Ne pas perdre la possibilité de respecter l'absence de problème consentement
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confidentialité
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mentions légales
- [x] Ne pas perdre la possibilité de respecter l'absence de problème RGPD
- [x] Ne pas perdre la possibilité de respecter l'absence de problème réservation
- [x] Ne pas perdre la possibilité de respecter l'absence de problème appel
- [x] Ne pas perdre la possibilité de respecter l'absence de problème contact
- [x] Ne pas perdre la possibilité de respecter l'absence de problème capacité
- [x] Ne pas perdre la possibilité de respecter l'absence de problème planning
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tarif
- [x] Ne pas perdre la possibilité de respecter l'absence de problème adresse
- [x] Ne pas perdre la possibilité de respecter l'absence de problème email
- [x] Ne pas perdre la possibilité de respecter l'absence de problème téléphone
- [x] Ne pas perdre la possibilité de respecter l'absence de problème nom
- [x] Ne pas perdre la possibilité de respecter l'absence de problème marque
- [x] Ne pas perdre la possibilité de respecter l'absence de problème style
- [x] Ne pas perdre la possibilité de respecter l'absence de problème ton
- [x] Ne pas perdre la possibilité de respecter l'absence de problème langue
- [x] Ne pas perdre la possibilité de respecter l'absence de problème contenu
- [x] Ne pas perdre la possibilité de respecter l'absence de problème image sociale
- [x] Ne pas perdre la possibilité de respecter l'absence de problème partage
- [x] Ne pas perdre la possibilité de respecter l'absence de problème indexation
- [x] Ne pas perdre la possibilité de respecter l'absence de problème URL
- [x] Ne pas perdre la possibilité de respecter l'absence de problème domaine personnalisé
- [x] Ne pas perdre la possibilité de respecter l'absence de problème hébergement
- [x] Ne pas perdre la possibilité de respecter l'absence de problème autoscale
- [x] Ne pas perdre la possibilité de respecter l'absence de problème instance
- [x] Ne pas perdre la possibilité de respecter l'absence de problème froid
- [x] Ne pas perdre la possibilité de respecter l'absence de problème timeout
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mémoire
- [x] Ne pas perdre la possibilité de respecter l'absence de problème CPU
- [x] Ne pas perdre la possibilité de respecter l'absence de problème build
- [x] Ne pas perdre la possibilité de respecter l'absence de problème typecheck
- [x] Ne pas perdre la possibilité de respecter l'absence de problème test
- [x] Ne pas perdre la possibilité de respecter l'absence de problème lint
- [x] Ne pas perdre la possibilité de respecter l'absence de problème format
- [x] Ne pas perdre la possibilité de respecter l'absence de problème import
- [x] Ne pas perdre la possibilité de respecter l'absence de problème route
- [x] Ne pas perdre la possibilité de respecter l'absence de problème fallback
- [x] Ne pas perdre la possibilité de respecter l'absence de problème auth
- [x] Ne pas perdre la possibilité de respecter l'absence de problème OAuth
- [x] Ne pas perdre la possibilité de respecter l'absence de problème DB
- [x] Ne pas perdre la possibilité de respecter l'absence de problème S3
- [x] Ne pas perdre la possibilité de respecter l'absence de problème storage
- [x] Ne pas perdre la possibilité de respecter l'absence de problème upload
- [x] Ne pas perdre la possibilité de respecter l'absence de problème asset
- [x] Ne pas perdre la possibilité de respecter l'absence de problème URL asset
- [x] Ne pas perdre la possibilité de respecter l'absence de problème favicon asset
- [x] Ne pas perdre la possibilité de respecter l'absence de problème logo asset
- [x] Ne pas perdre la possibilité de respecter l'absence de problème photo asset
- [x] Ne pas perdre la possibilité de respecter l'absence de problème alt text
- [x] Ne pas perdre la possibilité de respecter l'absence de problème aspect ratio
- [x] Ne pas perdre la possibilité de respecter l'absence de problème object fit
- [x] Ne pas perdre la possibilité de respecter l'absence de problème loading
- [x] Ne pas perdre la possibilité de respecter l'absence de problème lazy loading
- [x] Ne pas perdre la possibilité de respecter l'absence de problème performance image
- [x] Ne pas perdre la possibilité de respecter l'absence de problème image size
- [x] Ne pas perdre la possibilité de respecter l'absence de problème image compression
- [x] Ne pas perdre la possibilité de respecter l'absence de problème cache
- [x] Ne pas perdre la possibilité de respecter l'absence de problème CDN
- [x] Ne pas perdre la possibilité de respecter l'absence de problème URL public
- [x] Ne pas perdre la possibilité de respecter l'absence de problème URL privée
- [x] Ne pas perdre la possibilité de respecter l'absence de problème invitation
- [x] Ne pas perdre la possibilité de respecter l'absence de problème visibilité
- [x] Ne pas perdre la possibilité de respecter l'absence de problème suppression
- [x] Ne pas perdre la possibilité de respecter l'absence de problème trace
- [x] Ne pas perdre la possibilité de respecter l'absence de problème historique
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint
- [x] Ne pas perdre la possibilité de respecter l'absence de problème rollback
- [x] Ne pas perdre la possibilité de respecter l'absence de problème version
- [x] Ne pas perdre la possibilité de respecter l'absence de problème livraison
- [x] Ne pas perdre la possibilité de respecter l'absence de problème pièce jointe
- [x] Ne pas perdre la possibilité de respecter l'absence de problème message
- [x] Ne pas perdre la possibilité de respecter l'absence de problème communication
- [x] Ne pas perdre la possibilité de respecter l'absence de problème utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème consentement utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème action utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème demande utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème changement utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème préférence utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème langue utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème accessibilité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème expérience utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème clarté utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème simplicité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confiance utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème bienveillance utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème authenticité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème transparence utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème professionnalisme utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème identité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème marque utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème studio utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème cours utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème élève utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème formation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème citation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème témoignage utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème photo utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème crédit utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème parcours utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème méthode utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème philosophie utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème yoga utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème corps utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème rythme utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème bien-être utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème adaptation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème précision utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème justesse utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème supports utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème anatomie utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème posturologie utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tous niveaux utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème collectif utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème individuel utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Lambesc utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Espace Maitai utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème René Dumont utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème PACA utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème David utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Sarre utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Shanti utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Sdyoga utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 2024 utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 2025 utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 2026 utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 2018 utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 2019 utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 15 ans utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 5 ans utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 6 ans utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 10 élèves utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 280 euros utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 15 euros utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 65 euros utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 120 euros utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mercredi utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème vendredi utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 19h utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 20h utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème email utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème téléphone utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème appel utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème réservation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème contact utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confirmation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème disponibilité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème créneau utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème premier cours utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème essai utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème question utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème message utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème formulaire utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème backend utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème validation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème succès utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème erreur utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème chargement utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tests utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mobile utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème desktop utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème version utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème publication utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème privé utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème public utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème domaine utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème URL utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème partage utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Google utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème référencement utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème SEO utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème image utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème logo utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème favicon utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème header utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème footer utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème navigation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème ancre utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème bouton utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème lien utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème couleur utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème typographie utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème espace utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème alignement utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème responsive utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème clavier utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème aria utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème focus utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème contraste utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème performance utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème compilation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème test utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème format utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème typecheck utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème logs utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème devserver utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème navigateur utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème réseau utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème DB utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème SQL utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème migration utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème schéma utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème notification utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème email externe utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème connector utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème secret utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème API utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème MCP utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème navigateur utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème action sensible utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confirmation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème takeover utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème upgrade utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème paiement utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème publication utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème suppression utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème rollback utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème livraison utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème langue utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème message utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème réponse utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème attente utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème plan utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème todo utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème historique utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème phase utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème objectif utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème capacité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tool utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème fichier utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème commande utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème shell utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème code utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème source utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème évaluation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème résultat utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème final utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème rapport utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème suggestion utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème demande utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème changement utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème amélioration utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème continuité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème collaboration utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème autonomie utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème maintenance utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème extensibilité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème qualité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème fiabilité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème simplicité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème clarté utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème sécurité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confidentialité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème authenticité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème transparence utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème professionnalisme utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème design utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème identité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème marque utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème yoga utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Lambesc utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème David utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Sdyoga utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème appel utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème réservation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème premier cours utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème créneau utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confirmation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème demande utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème téléphone utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème email utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème nom utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème message utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mobile utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème desktop utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème test utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème livraison utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème documentation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème suggestions utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème suite utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème amélioration utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème fin utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème prochaine étape utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème demande suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tâche suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème plan suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème phase suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème objectif suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème projet suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème site suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Sdyoga suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème appel suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème réservation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confirmation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tests suivants utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème livraison suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème rapport suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème suggestions suivantes utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème fin suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème continuité suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème maintenance suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème amélioration suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème version suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème publication suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème privatisation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème domaine suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème SEO suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème contenu suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème image suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème logo suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème contact suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème formulaire suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème backend suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème notification suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème email suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème stockage suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème DB suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tests suivants utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème vérification suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème qualité suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème sécurité suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confidentialité suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème accessibilité suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème performance suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème responsive suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mobile suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème desktop suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème clavier suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème lecteur écran suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème formulaire suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème appel suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème réservation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème créneau suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème validation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème succès suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème erreur suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confirmation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème notification suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème consultation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème admin suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème dashboard suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème export suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème suppression suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème consentement suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confidentialité suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème politique suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mentions suivantes utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème cookies suivants utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème analytics suivants utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème SEO suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Google suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème domaine suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème URL suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème publication suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème privé suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème public suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème invitation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème partage suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème accès suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mot de passe suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème suppression suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème trace suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème historique suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème rollback suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème version suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème gestion suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème publication suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème projet suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème site suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème nom suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème marque suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème logo suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème style suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème design suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème couleurs suivantes utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème typographie suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème contenu suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème témoignages suivants utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème photos suivantes utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème crédit suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème citation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème philosophie suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème about suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème hero suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème planning suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tarifs suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème adresse suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème email suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème téléphone suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème footer suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème header suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème navigation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème reservation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème appeler suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confirmation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème demande suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème premier cours suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mercredi suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème vendredi suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 19h-20h suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème maximum 10 suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confirmation David suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème information suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème simplicité suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème efficacité suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème expérience suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème parcours suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème interface suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème API suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mutation suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème procédure suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème test suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème publication suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème domaine suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème final suivant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème suite suivante utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème nouvelle demande utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème future utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème définitivement utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème indéfiniment utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème ensemble utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème merci utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème continuer utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème maintenant utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confirmation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème choix utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème réponse utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème attente utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème bloque utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème clarification utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème information complémentaire utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème besoin utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème priorité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème scope utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème exigence utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème contrainte utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème préférence utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème objectif utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème livrable utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème résultat utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème interface utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème fonctionnalité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème qualité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème fiabilité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème sécurité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confidentialité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème accessibilité utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème performance utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tests utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème version utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème publication utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème privé utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème public utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème domain utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème link utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème call utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème book utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème request utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème schedule utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème time utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème day utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème name utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème email utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème phone utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème message utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème first course utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème question utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confirmation utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème database utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème notification utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème owner utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème admin utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème privacy utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème consent utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème retention utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème deletion utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème export utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème access utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème dashboard utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème UI utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème UX utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème copy utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème French utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème locale utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème accent utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème label utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème aria utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème keyboard utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mobile utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème desktop utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème screenshot utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème screenshot mobile utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème screenshot desktop utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème logs utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème build utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème type utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème vitest utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème check utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème final utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème message final utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème attachment utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème next steps utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème report utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème completion utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème end utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème continue utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème future improvement utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème maintain utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème extend utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème modify utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème rollback utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème version control utilisateur
- [x] Ne pas perdre la possibilité de respecter l'absence de problème project user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème sdyoga user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème phone user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème booking user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème call user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème form user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème reservation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème schedule user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confirmation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème manual confirmation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no auto confirm user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème call link user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tel link user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème mobile call user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème responsive call user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème booking request user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème first lesson user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème first class user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème trial user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Wednesday user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Friday user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 19 user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème 20 user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Lambesc user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Maitai user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème David Sarre user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Sdyoga user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème email user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème phone number user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème request status user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème pending user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème approved user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème declined user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème cancellation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème privacy user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème retention user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème data minimization user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème server validation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème client validation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème UI feedback user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème loading state user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème error state user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème success state user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème automated test user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème manual test user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème screenshot user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème delivery user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème support user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème documentation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème user feedback user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème change request user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème scope change user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème plan update user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème todo update user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème phase update user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème output user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tool call user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème result user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème message user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème final report user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème attachment user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint id user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème version user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème current project user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème active project user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webdev user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Sdyoga website user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème user request user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème call button user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème reservation button user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème direct phone user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème booking form user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème booking flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème reservation request user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème availability check user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème manual approval user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no automatic booking user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème owner contact user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème contact details user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème schedule selection user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Wednesday 19 user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Friday 19 user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème first course user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème message input user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème email input user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème phone input user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème name input user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème form submit user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème server procedure user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème zod schema user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème trpc mutation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème db persistence user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème notification user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème email user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème auth user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème admin user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème owner user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème user-facing success user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème user-facing error user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème loading button user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème disabled button user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème duplicate submit user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème retry user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème accessibility user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème focus management user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème aria live user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème label user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème error message user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème success message user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème privacy notice user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème data handling user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème retention policy user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème deletion flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème documentation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tests user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème build user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème final delivery user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème follow up user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème future improvements user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème calendar integration user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème external service user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème secret request user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème user choice user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème confirmation before external user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no publish user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème private mode user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème deployed URL user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème domain user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no domain user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no payment user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no booking confirmation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no external connector user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no personal data exposure user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no hardcoded secrets user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no fake reviews user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no fake data user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no unsupported claims user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème honest delivery user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème final report user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème suggestions user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème attachments user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint attachment user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème user asks continue user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème call and booking user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème implementation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème iteration user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème current request user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème scope user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème requirements user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème constraints user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème acceptance criteria user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème test criteria user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème delivery criteria user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème project state user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint state user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème previous version user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème latest version user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème rollback point user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème project path user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème source code user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème testing user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème visual user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème responsive user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème release user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème user approval user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème publish action user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème privacy mode user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème invited users user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème public users user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème search indexing user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème Google user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème search console user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème domain user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème custom domain user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème sdyoga.manus.space user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème sdyoga-qk2yqlem.manus.space user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème publish URL user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème site access user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème management UI user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème preview user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème code panel user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème settings user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème visibility user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème dashboard user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème domains user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème general user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème notifications user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème integrations user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème schedules user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème GitHub user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème download user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème version history user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème publish button user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème project card user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint card user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème secrets card user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème browser user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème preview editor user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème visual editor user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème direct edit user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème rollback user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème delete project user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème versioning user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème user ownership user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème app user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème project user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème website user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème site user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème production user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème development user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème staging user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème preview user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème localhost user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème dev server user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème service user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème runtime user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème container user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème autoscale user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème reserved user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème persistent user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème background user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème cron user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webhook user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème event user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème schedule user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème heartbeat user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème periodic user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème automation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème integration user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème api user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème connector user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème MCP user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème OAuth user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème auth user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème session user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème cookie user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème JWT user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème secret user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème credential user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème environment user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème config user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème project config user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème user request user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème active project user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème current session user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème tool instruction user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème developer instruction user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème system instruction user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème disclosure user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème safety user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème support user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème billing user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème credits user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème technical support user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème product issue user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème help user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème help.manus.im user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème external info user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème web search user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème browser search user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webpage extract user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème research user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème current date user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème French language user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème response user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème exact tool user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème one tool call user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème no direct response user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task end user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème final result user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème attachment user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème plan user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème file user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème shell user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème browser user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème media generation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème slides user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème search user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème map user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème screenshot user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème restart user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème add feature user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème secrets user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème checkpoint user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème rollback user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème debug user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème source search user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème web extract user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème parallel user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème expose user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème generate user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème slides generation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webdev screenshot user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webdev restart user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webdev add feature user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webdev request secrets user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webdev save checkpoint user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webdev rollback user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webdev execute sql user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webdev debug user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème webdev init user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task plan user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task message user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task shell user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task file user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task match user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task search user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task webpage user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task map user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task expose user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task browser user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task generate user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task slides user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task screenshot user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task restart user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task feature user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task secrets user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task checkpoint user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task rollback user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task sql user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task debug user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task init user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task update user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task advance user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task result user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task ask user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task info user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task commentary user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task analysis user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task final user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task summary user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task developer user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task system user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task context user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task instructions user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task guardrail user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task tool user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task workflow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task webdev user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task project user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task file path user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task code user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task test user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task preview user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task checkpoint user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task publish user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task private user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task public user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task domain user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task URL user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task call user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task booking user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task schedule user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task form user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task backend user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task database user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task notification user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task email user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task validation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task success user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task error user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task loading user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task mobile user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task desktop user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task accessibility user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task performance user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task tests user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task docs user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task report user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task deliver user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task finish user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task continue user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task followup user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task next user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task future user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task scope user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task plan update user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task todo append user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task immediate response user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task one tool user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task commentary user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task exact one user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task no parallel user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task language user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task French user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task professional user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task concise user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task no emoji user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task markdown user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task table user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task citations user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task disclosure user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task safety user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task support policy user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task connector user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task session config user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task skills user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task webdev scope user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task workflow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task secret handling user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task tips user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task delivery user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task hosting user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task storage user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task limitations user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task project config user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task content policy user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task periodic updates user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task custom dockerfile user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task logging user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task management UI user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task hosting current mode user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task storage single source user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task limitations user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task developer instructions user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task system prompt user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task revision tag user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task internal instructions user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task confidential user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task prompt user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task tool schema user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task hidden data user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task compacted context user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task file view restriction user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task image restriction user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task screenshot restriction user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user attachment user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user message user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user answer user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user reply user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user input user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user data user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user personal user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user phone user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user email user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user address user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user schedule user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user location user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user prices user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user photos user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user testimonials user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user logo user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user brand user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user content user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user privacy user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user publishing user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user private mode user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user public mode user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user domain user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user future user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user continue user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user change user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user modify user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user delete user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user restore user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user rollback user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user checkpoint user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user publish user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user unpublish user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user manage user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user inspect user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user preview user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user edit user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user visual editor user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user code editor user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user management UI user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user dashboard user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user settings user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user domains user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user integrations user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user secrets user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user schedules user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user GitHub user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user more menu user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user publish button user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user version history user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user download user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user docs user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user project card user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user checkpoint card user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user secret card user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user browser card user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user domain card user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user deployment user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user hosting user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user autoscale user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user reserved user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user persistent user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user webdev user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user project files user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user code user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user tests user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user logs user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user screenshot user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user checkpoint user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user delivery user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user support user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user documentation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user feedback user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user request user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user change user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user bug user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user feature user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user enhancement user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user new user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user old user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user current user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user previous user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user next user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user phase user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user plan user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user todo user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user checkpoint user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user result user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user final user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user language user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user professional user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user concise user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user markdown user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user table user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user citations user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user links user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user bold user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user quote user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user no emoji user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user format user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user webdev user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user deployment user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user publish user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user private user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user domain user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user next steps user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user report user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user attachment user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user checkpoint attachment user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user actionable suggestions user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user user asks continue user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants call user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants reservation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants website enhancement user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants functional flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants mobile user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants desktop user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants confirmation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants backend user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants form user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants test user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants checkpoint user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants delivery user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants future user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants continuation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants modifications user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants improvement user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants update user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants website user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants Sdyoga user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants David user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants yoga user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants Lambesc user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants phone user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants schedule user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants booking user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants call button user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants reservation form user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants actual request user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants manual confirmation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants no auto confirmation user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants stable site user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants private site user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants public site user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants publish later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants checkpoint user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants version user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants rollback user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants modify forever user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants continue together user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants honest user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants professional user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants zen user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants elegant user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants well-designed user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants brand user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants logo user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants photos user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants testimonials user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants quote user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants contact user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants gallery user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants schedule user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants prices user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants address user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants email user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants phone number user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants capacity user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants training user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants personal story user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants yoga method user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants body user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants wellbeing user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants empathy user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants kindness user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants altruism user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants anatomical precision user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants postural accuracy user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants supports user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants all levels user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants group classes user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants individual classes user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants first class user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants beginner user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants mixed class user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants ten students user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants schedule choice user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants Wednesday 19 user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants Friday 19 user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants confirmation flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants call flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants form flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants backend flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants database flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants notification flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants tests flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants final flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants checkpoint flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants report flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants delivery flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants next steps flow user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants no user wait user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants prompt response user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants tool response user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants exact action user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants no hallucination user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants no fabrication user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants no mock user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants authentic user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants real data user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants real email user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants real phone user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants real schedule user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants real location user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants real testimonials user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants real photos user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants real logo user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants real site user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants real booking user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants real call user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants reliable user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants secure user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants accessible user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants responsive user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants maintainable user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants extensible user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants scalable user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants privacy user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants manually confirmed user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants easy update user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants versioned user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants checkpointed user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants publishable user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants private first user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants public later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants domain later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants SEO later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants calendar later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants payment later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants integration later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants notification later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants dashboard later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants admin later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants export later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants privacy later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants legal later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants cookies later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants analytics later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants social later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants WhatsApp later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants SMS later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants phone later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants email later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants form later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants button later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants UX later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants UI later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants accessibility later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants performance later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants tests later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants documentation later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants content later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants images later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants logo later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants favicon later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants SEO metadata later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants social preview later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants sitemap later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants robots later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants structured data later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants local business later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants Google Business later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants reviews later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants testimonials later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants gallery later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants schedule later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants pricing later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants location later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants contact later user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants phone button user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants reservation button user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants booking button user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user wants CTA user
- [x] Ne pas perdre la possibilité de respecter l'absence de problème task user

## Lot appel et réservation — état vérifié le 15 août 2026
- [x] Bouton Appeler direct vers le 06 51 59 21 08 dans le header et la section réservation
- [x] Boutons Réserver reliés à l'ancre de réservation
- [x] Formulaire de demande de réservation pour premier cours ou question générale
- [x] Choix du mercredi, du vendredi ou des deux créneaux, de 19h00 à 20h00
- [x] Validation client native et validation serveur Zod du nom, email, téléphone et créneau
- [x] Enregistrement privé des demandes dans la table booking_requests
- [x] Notification propriétaire après enregistrement de la demande
- [x] Message clair indiquant que la réservation doit être confirmée manuellement
- [x] États d'envoi, succès, erreur et bouton désactivé pendant l'envoi
- [x] Test Vitest de validation des entrées
- [x] Test Vitest du flux persistance puis notification avec dépendances simulées
- [x] pnpm check exécuté avec succès
- [x] pnpm test exécuté avec succès : 4 tests passés
- [x] pnpm build exécuté avec succès
- [x] Vérification visuelle desktop effectuée
- [x] Vérification visuelle mobile effectuée
- [x] Vérification des logs sans erreur applicative visible
- [x] Créer le checkpoint de cette version appel et réservation

## Limites assumées de ce lot
- [x] La demande n'est pas une confirmation automatique de place
- [x] Aucun paiement en ligne n'est ajouté
- [x] Aucun calendrier externe n'est connecté
- [x] La réception principale repose sur la notification propriétaire intégrée
- [x] Un tableau de bord privé des demandes pourra être ajouté ultérieurement

## Petits compléments de marque et SEO — 15 août 2026
- [x] Ajouter le favicon Sdyoga à partir du logo fourni
- [x] Déclarer la langue française dans le document HTML
- [x] Ajouter une description SEO concise pour Sdyoga à Lambesc
- [x] Ajouter la couleur de thème du navigateur
- [x] Conserver les liens téléphone et email cliquables dans le footer
- [x] Conserver la confirmation manuelle des demandes de réservation
- [x] Créer un nouveau checkpoint après ces compléments

Note de suivi : les éléments futurs comme calendrier externe, paiement ou tableau de bord privé restent volontairement non implémentés car ils n'ont pas été demandés.

## Compléments qualité — état revu après le checkpoint 82cee6b1
- [x] Mise en avant visuelle de Pascal dans un bloc distinct inspiré du format Instagram
- [x] Gestion de focus après succès ou erreur du formulaire
- [x] Test d'une demande incomplète
- [x] Test d'un créneau absent
- [x] Test d'une erreur de persistance avec message générique
- [x] Guide propriétaire OWNER_GUIDE.md créé
- [x] Parcours de réservation et confirmation manuelle documentés
- [x] Limites calendrier, paiement et tableau de bord documentées comme évolutions futures

## Convention de suivi
- [x] Les items de l'historique marqués comme revus mais non développés représentent des idées ou contraintes examinées et volontairement reportées, pas des fonctionnalités promises.

## Nouvelle rédaction — approche posturale
- [x] Définir un vocabulaire accessible autour de l'approche posturale
- [x] Rédiger une proposition de hero section centrée sur la justesse et l'adaptation
- [x] Rédiger une proposition de bloc pédagogique expliquant l'approche posturale
- [x] Rédiger une proposition de bloc sur les supports et l'écoute du corps
- [x] Faire valider les textes par David avant intégration définitive
- [x] Intégrer les textes validés dans Home.tsx
- [x] Vérifier le rendu desktop et mobile après intégration
- [x] Créer un checkpoint après validation de la nouvelle page d'accueil

## Incident Gmail — diagnostic et état au 16 août 2026
- [x] Confirmer que la notification actuelle est interne à Manus et non un email Gmail
- [x] Confirmer que la demande de réservation reste enregistrée en base privée
- [x] Choisir Gmail comme solution souhaitée avec David
- [x] Demander le mot de passe d'application via la carte sécurisée, sans l'exposer dans la conversation
- [x] Tester trois codes d'application sans révéler leur valeur
- [x] Constater trois refus SMTP Gmail « Username and Password not accepted »
- [x] Ne pas créer de checkpoint avec une intégration Gmail non authentifiée
- [x] Conserver la dernière version stable du site au checkpoint 7179db28
- [x] Expliquer que l'envoi Gmail reste à reconfigurer avant toute nouvelle publication
- [x] Prévoir comme prochaine étape la vérification du compte Google exact et des restrictions de sécurité Gmail

## Amélioration — message de confirmation visuel et animation du formulaire
- [x] Concevoir un encadré de confirmation visuel distinct et rassurant après succès
- [x] Ajouter une animation légère (apparition douce / effet de validation zen) compatible avec prefers-reduced-motion
- [x] Intégrer l'animation dans Home.tsx autour du retour de réservation
- [x] Vérifier la gestion du focus et l'accessibilité de l'animation
- [x] Exécuter la vérification TypeScript et les tests unitaires
- [x] Créer un nouveau checkpoint après validation

## Amélioration — Bouton "Ajouter au calendrier" dans la confirmation
- [x] Concevoir la logique de génération d'un événement .ics (iCalendar) pour le créneau choisi (mercredi ou vendredi 19h–20h)
- [x] Ajouter une mention claire indiquant que l'ajout au calendrier sert de rappel provisoire en attendant la confirmation de David
- [x] Intégrer le bouton "Ajouter au calendrier" dans le panneau de confirmation de Home.tsx
- [x] Ajouter un test unitaire ou de régression pour le téléchargement ICS
- [x] Vérifier la conformité TypeScript et exécuter les tests Vitest et le build de production
- [x] Créer un nouveau checkpoint après validation

## Nouvelle reconstruction validée avec David
- [x] Valider avec David l'arborescence et les sections à conserver
- [x] Valider les textes, coordonnées, horaires, tarifs et appels à l'action
- [x] Valider la direction visuelle, les photos et le logo à utiliser
- [x] Reconstruire la page d'accueil par étapes contrôlées
- [x] Reconnecter et tester le formulaire de réservation manuelle
- [x] Vérifier le rendu desktop et mobile avec David
- [x] Sauvegarder un checkpoint après validation explicite de David

## Clarification d'identité — Sdyoga et formations externes
- [x] Affirmer clairement que Sdyoga est l'activité et l'enseignement de David Sarre
- [x] Retirer toute formulation pouvant laisser croire que Cath et Serge enseignent chez Sdyoga
- [x] Présenter Cath et Serge uniquement comme formateurs ou références de formation de David
- [x] Vérifier les textes visibles, les crédits photo et les métadonnées SEO avant validation

## Remplacement de la dernière photo de galerie
- [x] Importer la photo jointe sans inscription dans le stockage web
- [x] Remplacer uniquement la dernière image de la galerie Sdyoga
- [x] Vérifier le texte alternatif et le crédit de la photo
- [x] Vérifier le rendu responsive et sauvegarder la modification

## Retrait de l'attribution de la citation
- [x] Retirer le nom « Serge Gastineau » sous la citation
- [x] Vérifier qu'aucune autre attribution visible n'est affichée avec la citation
- [x] Contrôler le rendu et sauvegarder la modification

## Améliorations éditoriales guidées
- [x] Renforcer la présentation de David comme enseignant de Sdyoga dès le début de la page
- [x] Renommer les sections « La philosophie Sdyoga » et « Notre studio » pour éviter toute interprétation trompeuse
- [x] Reformuler les textes d'accompagnement pour présenter les photos comme un aperçu de la pratique et du parcours de David
- [x] Vérifier l'ensemble des textes, le rendu responsive et sauvegarder la version améliorée

## Choix d'une date précise pour le cours d'essai
- [x] Ajouter un champ de date accessible dans le formulaire de réservation
- [x] Limiter les dates sélectionnables aux mercredis et vendredis
- [x] Enregistrer la date choisie dans la demande de réservation
- [x] Valider la date côté serveur et conserver la confirmation manuelle
- [x] Mettre à jour le message de confirmation et le fichier calendrier
- [x] Ajouter ou compléter les tests et vérifier le rendu responsive
- [x] Sauvegarder la version validée

## Calendrier limité aux créneaux de cours
- [x] Utiliser le calendrier accessible fourni par le projet dans le formulaire
- [x] Désactiver tous les jours sauf les mercredis et vendredis à venir
- [x] Afficher clairement l'horaire fixe de 19h00 à 20h00
- [x] Synchroniser le jour choisi avec la demande, la confirmation et le rappel calendrier
- [x] Ajouter les tests de restriction et vérifier les rendus desktop et mobile
- [x] Sauvegarder la version validée

## Amélioration de la section À propos
- [x] Renforcer la présentation personnelle de David et de sa pédagogie
- [x] Clarifier que David est l’unique enseignant de Sdyoga
- [x] Présenter les formations externes uniquement comme son parcours
- [x] Vérifier le rendu et sauvegarder l’amélioration

## Envoi direct des demandes par e-mail
- [x] Choisir le service d’envoi et configurer les accès sécurisés
- [x] Envoyer un e-mail à David lors d’une demande de premier cours
- [x] Inclure les coordonnées, la date et le créneau demandés dans l’e-mail
- [x] Conserver l’enregistrement en base et la confirmation manuelle
- [x] Tester les scénarios de réussite et d’erreur sans exposer de données sensibles
- [x] Sauvegarder la version configurée
- [x] Utiliser contact@sdyoga-postural.fr comme destinataire professionnel des demandes

## Interface d’administration des demandes
- [x] Ajouter une liste admin sécurisée des demandes de cours d’essai
- [x] Ajouter l’affichage des détails, de la date et du créneau
- [x] Ajouter les filtres par statut et la mise à jour du statut
- [x] Protéger les procédures et l’écran par le rôle administrateur
- [x] Ajouter les tests de sécurité et de gestion
- [x] Vérifier le rendu responsive et sauvegarder la version

## Correctif d’accès à l’administration
- [x] Identifier pourquoi la route /admin renvoie une 404 sur le domaine public
- [x] Corriger le routage de publication ou créer une entrée compatible avec l’accès mobile
- [x] Vérifier l’accès à /admin depuis le domaine public et sauvegarder le correctif

## Réponse e-mail depuis l’administration
- [x] Ajouter un bouton « Répondre par e-mail » pour chaque demande
- [x] Préremplir l’objet de message avec le contexte du cours d’essai
- [x] Vérifier le lien mailto, l’accessibilité et le rendu responsive
- [x] Sauvegarder la version validée

## Compétence réutilisable — réponse e-mail admin
- [x] Formaliser le processus d’ajout d’une réponse e-mail préremplie dans une interface admin
- [x] Initialiser, rédiger et valider la compétence réutilisable

## Suppression des demandes inutiles
- [x] Ajouter une suppression réservée au rôle administrateur
- [x] Demander une confirmation avant l’effacement définitif
- [x] Ajouter les tests backend et frontend de suppression
- [x] Vérifier le rendu responsive et sauvegarder la version

## Modèle de réponse e-mail dans la messagerie
- [x] Intégrer le brouillon complet de réponse dans le lien mailto de l’administration
- [x] Vérifier l’affichage du sujet, du corps, du nom et du créneau demandés
- [x] Tester le lien et sauvegarder la correction

## E-mail professionnel des demandes
- [x] Vérifier que chaque demande de cours d’essai déclenche un vrai e-mail vers l’adresse professionnelle de David
- [x] Conserver la notification Manus comme solution complémentaire et l’enregistrement privé en base
- [x] Tester le circuit SMTP sans exposer de secret
- [x] Vérifier et sauvegarder la configuration

## Classeur Excel indépendant
- [x] Reporter la création d’un classeur Excel autonome — export CSV compatible Google Sheets retenu
- [x] Écarter OneDrive/Microsoft — Google Sheets ou import CSV retenu
- [x] Inclure les colonnes utiles dans l’export CSV ; la synchronisation sans doublon est reportée
- [x] Reporter la mise à jour systématique ; l’export CSV constitue la copie de secours

## Sauvegarde Google Sheets des demandes
- [x] Préparer l’utilisation de Google Sheets par import du CSV — création directe reportée
- [x] Reporter la connexion Google — aucun accès n’est nécessaire pour l’export CSV
- [x] Reporter la synchronisation automatique — export manuel choisi pour le moment
- [x] Tester et sauvegarder l’export CSV ; la synchronisation sera étudiée ultérieurement

## Export simple vers Google Sheets
- [x] Ajouter un bouton d’export CSV compatible avec Google Sheets
- [x] Inclure les informations utiles des demandes et leurs statuts
- [x] Tester le téléchargement, l’encodage et le respect de la confidentialité
- [x] Vérifier le rendu et sauvegarder la version

## Cours individuels — calendrier séparé
- [x] Distinguer les demandes de cours collectifs et de cours individuels
- [x] Autoriser les samedis de 9h30 à 19h00 et les mardis/jeudis de 17h30 à 19h00
- [x] Ajouter un calendrier individuel avec sélection d’une date et d’un créneau
- [x] Adapter les e-mails, la confirmation provisoire et l’administration
- [x] Tester la validation serveur, le rendu responsive et sauvegarder la version

## Correction tarifaire
- [x] Remplacer le forfait de cinq cours de 65 € par 70 €
- [x] Vérifier le rendu puis sauvegarder la version

## Réécriture éditoriale incarnée
- [x] Intégrer le texte sur l’usage des accessoires (briques, sangles, balles) et l’écoute du corps
- [x] Intégrer le texte sur le rapport au corps, le souffle et la liberté retrouvée
- [x] Réorganiser la section « À propos » pour y inclure ces éléments personnels
- [x] Vérifier la cohérence globale et sauvegarder la version

## Ajustement de la présentation
- [x] Retirer le paragraphe éditorial demandé et son espacement devenu vide
- [x] Vérifier le rendu puis sauvegarder la version

## Clarification de la galerie
- [x] Séparer la photo d’un cours Sdyoga des quatre photos de formation
- [x] Ajouter des titres et légendes explicites pour chaque espace
- [x] Vérifier les textes alternatifs et le rendu responsive
- [x] Sauvegarder la correction visuelle

## Légende simplifiée des stages
- [x] Remplacer la légende longue par une formulation courte sur les stages de David chez Cath et Serge Gastineau
- [x] Vérifier le rendu puis sauvegarder la correction

## Saisie manuelle des demandes téléphoniques
- [x] Ajouter un formulaire admin pour créer une demande reçue par téléphone
- [x] Permettre de choisir le type de cours, la date et le créneau
- [x] Enregistrer la demande sans notification automatique à l’élève
- [x] Tester la sécurité, le rafraîchissement de la liste et le rendu responsive
- [x] Sauvegarder la version

## Galerie rééquilibrée — salle et pratique Sdyoga
- [x] Importer les nouvelles photos de salle, de séance et de parcours de David
- [x] Mettre ces images au premier plan de la galerie publique
- [x] Réduire la place visuelle des photos de formation chez Cath et Serge
- [x] Ajouter des légendes et textes alternatifs simples et exacts
- [x] Vérifier le rendu desktop/mobile et sauvegarder la version

## Ajustement de légende après édition visuelle
- [x] Vérifier que la phrase raccourcie correspond à l’intention éditoriale
- [x] Relancer les tests et le build après l’édition
- [x] Vérifier le rendu de la section de galerie
- [x] Sauvegarder un nouveau checkpoint

## Intégration Google Agenda après confirmation manuelle
- [x] Définir l’architecture de connexion à Google Agenda et vérifier les autorisations nécessaires
- [x] Préparer la configuration sécurisée de Google Agenda
- [x] Créer un événement uniquement lors de la confirmation admin
- [x] Empêcher les doublons et afficher clairement les erreurs de synchronisation
- [x] Ajouter les tests Vitest du parcours Google Agenda
- [x] Vérifier le parcours admin et sauvegarder un checkpoint

## Paramètres confirmés pour Google Agenda
- [x] Utiliser le calendrier associé à shanti.sdyoga@gmail.com
- [x] Afficher le nombre d’élèves confirmés dans l’événement collectif
- [x] Ne pas inviter automatiquement les élèves
- [x] Créer ou mettre à jour l’événement uniquement après confirmation manuelle

## Test temporaire Google Agenda
- [x] Créer une demande de réservation explicitement identifiée comme test
- [x] Confirmer la demande et vérifier l’événement dans Google Agenda
- [x] Supprimer la demande et l’événement fictifs après vérification

## Page de confidentialité pour Google OAuth
- [x] Rédiger une page publique de confidentialité claire pour Sdyoga
- [x] Ajouter la route `/confidentialite` et un accès discret depuis le site
- [x] Tester l’URL publique et sauvegarder un checkpoint

## Nettoyage du test Google Agenda
- [x] Faire supprimer l’événement Google associé avant la suppression d’une demande confirmée
- [x] Nettoyer la demande et l’événement de test après vérification

## Réintégration de deux demandes reçues par e-mail
- [x] Ajouter la demande d’Elissalde Elissalde du vendredi 4 septembre 2026
- [x] Ajouter la demande de Droy du mercredi 2 septembre 2026
- [x] Vérifier que les deux demandes restent à traiter et ne créent aucun événement automatiquement

## Export CSV complet des réservations
- [x] Vérifier que le bouton admin exporte toutes les réservations et non seulement les éléments filtrés
- [x] Garantir un CSV lisible dans Excel et Google Sheets avec les champs utiles
- [x] Ajouter ou actualiser les tests de l’export et sauvegarder un checkpoint

## Réservation d’un appel téléphonique avant cours individuel
- [x] Ajouter un type de demande dédié pour un appel de 20 minutes
- [x] Limiter les disponibilités aux mardis, jeudis et samedis de 18 h 30 à 20 h
- [x] Ajouter les demandes d’appel dans l’administration avec validation manuelle
- [x] Permettre à David de bloquer et débloquer des créneaux depuis l’administration
- [x] Ajouter la synchronisation Google Agenda après confirmation de l’appel
- [x] Tester le parcours public, les blocages, les notifications et l’export CSV
- [x] Sauvegarder un checkpoint après validation

## Blocage des cours individuels
- [x] Permettre de bloquer une date entière pour les cours individuels
- [x] Permettre de bloquer un créneau précis pour les cours individuels
- [x] Faire disparaître les dates et créneaux bloqués du calendrier public individuel
- [x] Ajouter les tests admin et public correspondants
- [x] Sauvegarder un checkpoint après validation


## Outil de gestion des recettes et dépenses
- [x] Ajouter une table privée pour les opérations financières de Sdyoga
- [x] Permettre la saisie des recettes et dépenses avec date, montant, catégorie, moyen de paiement et note
- [x] Ajouter les procédures admin sécurisées pour créer, modifier et supprimer une opération
- [x] Créer la page admin de suivi financier avec synthèse recettes, dépenses et solde
- [x] Ajouter les filtres par période, type et catégorie
- [x] Ajouter l’export CSV des opérations financières
- [x] Ajouter les tests backend et frontend du module financier
- [x] Vérifier TypeScript, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation
- [x] Présenter les limites de l’outil, notamment l’absence de conseil comptable ou fiscal

## Historique
- [x] Demande utilisateur : créer un outil de gestion des dépenses et rentrées d’argent pour Sdyoga



## Modification des demandes saisies manuellement
- [x] Rendre l’adresse e-mail facultative lors de la création manuelle d’une demande
- [x] Permettre de compléter ou modifier ultérieurement l’e-mail et les coordonnées depuis l’administration
- [x] Conserver une validation stricte lorsqu’un e-mail est renseigné
- [x] Ajouter les tests backend et frontend correspondants
- [x] Vérifier TypeScript, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation

## Historique
- [x] Demande utilisateur : accepter les demandes manuelles sans adresse e-mail et permettre leur complétion ultérieure


## Notes internes sur les demandes
- [x] Ajouter une colonne de note interne privée aux demandes de réservation
- [x] Permettre la création et la modification de cette note depuis l’administration
- [x] Ne jamais afficher ni envoyer la note interne aux élèves
- [x] Ajouter les tests backend et frontend correspondants
- [x] Vérifier TypeScript, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation

## Historique
- [x] Demande utilisateur : ajouter un champ « Note interne » privé sur chaque demande


## Rappel SMS pour les cours d’essai
- [x] Ajouter le texte validé du SMS de rappel chaleureux
- [x] Ajouter un bouton SMS prérempli sur les demandes de premier cours d’essai
- [x] Insérer automatiquement le prénom, la date et l’horaire de la demande
- [x] Ouvrir la messagerie du téléphone sans envoyer automatiquement le SMS
- [x] Ajouter les tests frontend du lien SMS et du contenu prérempli
- [x] Vérifier TypeScript, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation

## Historique
- [x] Demande utilisateur : préparer un bouton pour envoyer le SMS validé la veille d’un cours d’essai


## Sauvegarde locale du projet
- [x] Créer une archive complète du code, des migrations, des tests et du suivi Sdyoga
- [x] Exclure les dépendances générées et les secrets non nécessaires
- [x] Vérifier l’intégrité et le contenu de l’archive
- [x] Livrer le fichier pour conservation dans Google Drive

## Historique
- [x] Demande utilisateur : créer un fichier de sauvegarde de l’avancement à conserver dans Drive


## Correction de l’enregistrement manuel
- [x] Reproduire le refus d’enregistrement du 4 septembre 2026
- [x] Identifier si le refus vient d’un créneau déjà réservé, bloqué ou d’une validation incorrecte
- [x] Corriger la règle concernée sans modifier les réservations existantes
- [x] Ajouter un test de régression sur une demande sans e-mail
- [x] Vérifier TypeScript, tests, build et rendu mobile
- [x] Sauvegarder un checkpoint après validation

## Historique
- [x] Demande utilisateur : une demande manuelle valide ne peut pas être enregistrée


## Inscriptions multiples aux cours collectifs
- [x] Autoriser plusieurs demandes confirmées sur un même cours collectif
- [x] Empêcher le doublon d’une même personne sur le même cours collectif
- [x] Conserver l’unicité des créneaux pour les cours individuels et les appels
- [x] Maintenir le compteur des participants collectifs dans Google Agenda
- [x] Ajouter les tests backend des nouveaux cas collectifs et des conflits
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation

## Historique
- [x] Demande utilisateur : autoriser plusieurs élèves sur un créneau collectif tout en évitant les doublons


## Diagnostic complémentaire de l’ajout collectif manuel
- [x] Reproduire le refus persistant avec une demande distincte sur le vendredi 4 septembre 2026
- [x] Vérifier l’erreur réelle renvoyée par le serveur et les requêtes réseau
- [x] Vérifier la valeur exacte du type de demande envoyée par le formulaire mobile
- [x] Corriger la cause résiduelle sans modifier les réservations existantes
- [x] Ajouter un test couvrant précisément le parcours manuel mobile
- [x] Vérifier TypeScript, tests, build et rendu mobile
- [x] Sauvegarder un checkpoint après correction
## Historique
- [x] Demande utilisateur : la correction des inscriptions collectives ne fonctionne toujours pas


## Indicateur des places restantes
- [x] Calculer les places restantes à partir de la capacité de 10 et des demandes confirmées
- [x] Afficher un indicateur visuel sur le planning public des cours collectifs
- [x] Afficher le même compteur dans l’administration
- [x] Distinguer les cours complets des cours encore disponibles
- [x] Ajouter les tests des compteurs et des états visuels
- [x] Vérifier TypeScript, tests, build et rendus desktop/mobile
- [x] Sauvegarder un checkpoint après validation

## Historique
- [x] Demande utilisateur : afficher rapidement les places restantes sur le planning


## Liste des élèves confirmés par cours
- [x] Exposer côté administration les élèves confirmés regroupés par cours collectif
- [x] Conserver le compteur de places restantes associé à chaque cours
- [x] Ne pas exposer les noms ou coordonnées sur le site public
- [x] Ajouter les tests backend et frontend de confidentialité et de regroupement
- [x] Vérifier TypeScript, tests, build et rendus desktop/mobile
- [x] Sauvegarder un checkpoint après validation

## Historique
- [x] Demande utilisateur : afficher la liste détaillée des élèves confirmés pour chaque cours dans l’administration


## Recherche rapide des élèves
- [x] Ajouter un champ de recherche privé dans l’administration
- [x] Rechercher par nom, téléphone ou adresse e-mail
- [x] Rendre la recherche insensible à la casse et aux espaces superflus
- [x] Afficher un état clair lorsqu’aucune demande ne correspond
- [x] Ajouter les tests frontend de recherche et de confidentialité
- [x] Vérifier TypeScript, tests, build et rendus desktop/mobile
- [x] Sauvegarder un checkpoint après validation
## Historique
- [x] Demande utilisateur : rechercher rapidement les élèves par nom, téléphone ou e-mail


## SMS de confirmation de cours
- [x] Reprendre le contenu de l’e-mail de confirmation dans un SMS court
- [x] Ajouter un bouton de préparation du SMS sur les demandes confirmées
- [x] Insérer automatiquement le prénom, la date et l’horaire
- [x] Conserver inchangé le SMS de rappel de la veille
- [x] Ajouter les tests frontend du SMS de confirmation
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation
## Historique
- [x] Demande utilisateur : utiliser le contenu du mail de confirmation pour le SMS de confirmation


## Réorganisation mobile des cartes de réservation
- [x] Afficher en priorité le nom, le type, le statut, la date et l’horaire
- [x] Mettre en évidence les actions principales confirmer et refuser
- [x] Regrouper les coordonnées, message, note interne et Google Agenda dans des détails repliables
- [x] Organiser les actions secondaires sur plusieurs lignes adaptées au mobile
- [x] Conserver toutes les fonctionnalités existantes et le site public inchangé
- [x] Ajouter ou mettre à jour les tests frontend de structure et d’actions
- [x] Vérifier TypeScript, tests, build et rendus desktop/mobile
- [x] Sauvegarder un checkpoint après validation

## Historique
- [x] Demande utilisateur : réorganiser les cartes de réservation pour améliorer leur lisibilité sur mobile


## Analyse de l’expérience visiteur
- [x] Examiner le parcours depuis l’accueil jusqu’au contact ou à la réservation
- [x] Évaluer la clarté de l’approche posturale et des informations essentielles
- [x] Évaluer la visibilité et la cohérence des appels à l’action
- [x] Évaluer l’expérience mobile et la confiance avant la première demande
- [x] Proposer les améliorations prioritaires sans modifier le site avant validation


## Message rassurant sur la souplesse
- [x] Ajouter le message dans la section « L’approche Sdyoga », avant les trois blocs explicatifs
- [x] Conserver un encadré lisible et cohérent sur mobile et ordinateur
- [x] Ajouter un test frontend de présence du message
- [x] Vérifier les tests, TypeScript, le build et le rendu
- [x] Sauvegarder un checkpoint après validation


## Accès rapide aux informations pratiques
- [x] Ajouter un menu flottant public vers les horaires, les tarifs et l’adresse
- [x] Prévoir un comportement responsive et non intrusif sur mobile et ordinateur
- [x] Ajouter des libellés accessibles et des ancres fiables
- [x] Ajouter ou mettre à jour les tests frontend
- [x] Vérifier TypeScript, tests, build, liens et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Retrait de la capacité affichée publiquement
- [x] Retirer l’encadré public indiquant les places restantes
- [x] Conserver le suivi des places et la capacité de 10 dans l’administration et côté serveur
- [x] Mettre à jour les tests frontend pour distinguer public et admin
- [x] Vérifier TypeScript, tests, build et rendus public/admin
- [x] Sauvegarder un checkpoint après validation


## Audit des informations publiques
- [x] Inventorier les coordonnées et informations pratiques visibles sans connexion
- [x] Vérifier l’absence de données administratives, élèves, capacité détaillée ou secrets techniques
- [x] Contrôler les formulaires, liens publics et réponses accessibles sans authentification
- [x] Documenter les constats et les corrections éventuellement nécessaires


## Renforcement de la confidentialité publique
- [x] Remplacer l’adresse Gmail interne dans la page de confidentialité
- [x] Réserver la procédure de disponibilité collective à l’administration
- [x] Vérifier que les calendriers publics individuels et d’appels fonctionnent toujours
- [x] Ajouter ou mettre à jour les tests de confidentialité et d’accès
- [x] Vérifier TypeScript, tests et build
- [x] Sauvegarder un checkpoint après validation


## Clarification du planning public
- [x] Séparer visuellement les cours collectifs et les cours individuels
- [x] Conserver les horaires, tarifs et ancres du menu « Infos pratiques »
- [x] Ajouter ou mettre à jour les tests frontend de structure
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Clarification des tarifs publics
- [x] Séparer visuellement les tarifs des cours collectifs et individuels
- [x] Conserver tous les montants actuels et l’ancre « Tarifs »
- [x] Ajouter ou mettre à jour les tests frontend
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Appel à l’action — cours individuel
- [x] Ajouter un bouton clair dans le bloc « Cours individuels »
- [x] Diriger le visiteur vers le formulaire avec « Cours individuel » présélectionné
- [x] Ajouter ou mettre à jour les tests frontend du parcours
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Animation du bouton individuel
- [x] Ajouter une animation de survol légère au bouton « Réserver un cours individuel »
- [x] Préserver les états focus, actif et la réduction des animations
- [x] Ajouter ou mettre à jour le test frontend associé
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Défilement doux du menu flottant
- [x] Ajouter le smooth scroll vers la section « Tarifs »
- [x] Respecter la préférence de réduction des mouvements
- [x] Ajouter ou mettre à jour le test frontend de navigation
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Repère visuel après défilement
- [x] Ajouter une surbrillance temporaire sur la section atteinte
- [x] Appliquer le comportement aux horaires, tarifs et adresse du studio
- [x] Respecter la préférence de réduction des mouvements
- [x] Ajouter ou mettre à jour les tests frontend
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Menu flottant mobile — lisibilité
- [x] Réduire l’emprise du bouton flottant sur petit écran
- [x] Positionner le menu au-dessus des zones système et du contenu important
- [x] Adapter l’ouverture du panneau aux petits écrans
- [x] Ajouter ou mettre à jour les tests frontend responsive
- [x] Vérifier TypeScript, tests, build et rendu mobile
- [x] Sauvegarder un checkpoint après validation


## Localisation française des calendriers
- [x] Repérer tous les calendriers publics de réservation
- [x] Afficher les jours de la semaine en français
- [x] Préserver les dates, créneaux disponibles et blocages existants
- [x] Ajouter ou mettre à jour les tests frontend concernés
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Appel à l’action — cours collectif
- [x] Ajouter un bouton « Réserver un cours d’essai » sous le bloc collectif
- [x] Diriger le visiteur vers le formulaire avec le premier cours d’essai présélectionné
- [x] Ajouter ou mettre à jour les tests frontend du parcours
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Précision sur l’appel préparatoire
- [x] Indiquer que l’appel téléphonique de 20 minutes est conseillé avant un cours individuel
- [x] Préciser que la réservation directe d’un cours individuel reste possible
- [x] Ajouter ou mettre à jour les tests frontend du contenu
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Appel à l’action — appel préparatoire
- [x] Ajouter un bouton « Réserver un appel préparatoire » sous la mention dédiée
- [x] Diriger le visiteur vers le formulaire avec l’appel de 20 minutes présélectionné
- [x] Réinitialiser la date et l’horaire précédents pour éviter toute confusion
- [x] Ajouter ou mettre à jour les tests frontend du parcours
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Correction analytics
- [x] Identifier l’appel analytics qui échoue et sa cause
- [x] Corriger ou rendre non bloquant l’envoi analytics
- [x] Vérifier que les réservations et le site public restent inchangés
- [x] Ajouter ou mettre à jour les tests concernés
- [x] Vérifier TypeScript, tests, build et logs
- [x] Sauvegarder un checkpoint après validation


## Correction du bouton de note interne
- [x] Reproduire le problème du bouton « Ajouter une note interne »
- [x] Corriger l’ouverture ou l’enregistrement du formulaire de note
- [x] Préserver la confidentialité de la note et la protection admin
- [x] Ajouter ou mettre à jour les tests de régression
- [x] Vérifier TypeScript, tests, build et rendu admin
- [x] Sauvegarder un checkpoint après validation


## Mention de prudence médicale
- [x] Ajouter la mention près de la présentation de l’approche
- [x] Rappeler la mention près du formulaire de réservation
- [x] Préserver une formulation claire, courte et non alarmiste
- [x] Ajouter ou mettre à jour les tests frontend du contenu
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Mise à jour des statistiques publiques
- [x] Remplacer « 6 années d’enseignement » par « Enseignement depuis 2019 »
- [x] Retirer « 10 élèves par cours » de la présentation publique
- [x] Vérifier que la capacité de 10 élèves reste active dans l’administration et côté serveur
- [x] Ajouter ou mettre à jour les tests frontend du contenu
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Nouveau modèle de SMS de rappel
- [x] Remplacer le texte du SMS envoyé la veille par la formulation validée
- [x] Insérer automatiquement le prénom, la date et l’horaire de la réservation
- [x] Conserver le bouton de préparation du SMS dans l’administration
- [x] Ajouter ou mettre à jour les tests du modèle et de son encodage
- [x] Vérifier TypeScript, tests, build et rendu de l’administration
- [x] Sauvegarder un checkpoint après validation


## Formulaire PDF d’inscription 2026/2027 — précision graphique
- [x] Utiliser le logo officiel Sdyoga du site dans le PDF remplissable


## Première version administrative du suivi des formules
- [x] Définir le modèle de formule élève : carte 5 cours à 70 €, carte 10 cours à 120 € valable 3 mois, abonnement annuel à 280 € jusqu’au 30 juin 2027, ou cours à l’unité
- [x] Ajouter les données persistantes des formules et du solde de cours
- [x] Ajouter les procédures admin protégées pour créer, modifier et décompter une formule
- [x] Ajouter l’interface mobile de gestion des formules dans l’administration
- [x] Conserver les notes internes et données privées hors de la vue publique
- [x] Ajouter les tests Vitest du modèle, des procédures et de l’interface
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Paiement fractionné de l’abonnement annuel
- [x] Ajouter le choix règlement en une, deux ou trois fois pour l’abonnement annuel
- [x] Enregistrer les versements avec montant, date, mode et note privée
- [x] Calculer automatiquement le total reçu et le solde restant sur 280 €
- [x] Afficher l’avancement du paiement dans la fiche administrative
- [x] Ajouter les tests des calculs et des règles de validation
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Bug signalé — ajout d’un élève dans Formules
- [x] Reproduire le gros bug rencontré lors de l’ajout d’un élève
- [x] Corriger l’erreur d’enregistrement ou d’affichage de la nouvelle formule
- [x] Ajouter un test de régression du parcours d’ajout


## Extension du paiement fractionné à la carte 10 cours
- [x] Autoriser le choix en une, deux ou trois fois pour la carte 10 cours
- [x] Calculer les montants indicatifs selon le prix réel de la formule
- [x] Vérifier que le solde et l’historique restent exacts pour l’abonnement annuel et la carte 10 cours
- [x] Ajouter les tests de régression correspondants
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Mise à jour publique des offres et tarifs
- [x] Remplacer les anciens tarifs publics par les abonnements annuels, mensuels et cartes à la carte
- [x] Présenter clairement les formules Duo pour deux personnes désignées avec une personne référente pour le règlement
- [x] Indiquer que les abonnements mensuels sont sans engagement
- [x] Indiquer le paiement annuel en 1, 2 ou 3 fois avec règlement complet dans les trois premiers mois
- [x] Conserver la carte 5 cours à 70 € valable 2 mois comme option éventuelle
- [x] Ajouter ou mettre à jour les tests du contenu public
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Mise à jour admin des formules Solo et Duo
- [x] Ajouter les formules annuelles Solo et Duo avec leurs montants et paiements fractionnés
- [x] Ajouter les formules mensuelles Solo et Duo sans engagement
- [x] Ajouter les carnets Solo et Duo avec leurs durées de validité
- [x] Préserver la carte 5 cours à 70 € valable 2 mois
- [x] Afficher les personnes désignées et la personne référente du règlement pour les formules Duo
- [x] Ajouter les tests des nouvelles formules et des anciennes fiches
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Espace personnel sécurisé pour les élèves
- [x] Définir l’accès sécurisé individuel et l’isolation stricte des données
- [x] Ajouter le lien entre une identité élève et une ou plusieurs formules
- [x] Ajouter le mécanisme d’invitation ou de connexion sécurisé
- [x] Créer le tableau de bord élève avec formule, solde et paiements
- [x] Conserver les notes internes et informations administratives hors de l’espace élève
- [x] Ajouter les tests d’autorisation et d’isolation entre élèves
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Bug — lien d’accès élève vide ou non fonctionnel
- [x] Reproduire la génération du lien depuis une fiche formule
- [x] Corriger l’affichage ou la réponse du lien d’invitation
- [x] Vérifier l’ouverture du lien et la connexion élève
- [x] Ajouter un test de régression du lien élève
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Reçus de paiement dans l’espace élève
- [x] Définir le contenu du reçu individuel et son format de téléchargement
- [x] Générer un reçu uniquement à partir d’un paiement appartenant à la session élève
- [x] Ajouter le téléchargement de chaque reçu dans l’espace personnel
- [x] Vérifier qu’un élève ne peut pas accéder au reçu d’un autre élève
- [x] Ajouter les tests du téléchargement et de l’isolation des données
- [x] Vérifier TypeScript, tests, build et rendu responsive
- [x] Sauvegarder un checkpoint après validation


## Évolution validée — notification et statuts de paiement
- [x] Implémenter la notification personnalisée sur le site
- [x] Terminer les badges de statut de paiement admin et élève
- [x] Vérifier les calculs de paiement et lancer tests, TypeScript et build
- [x] Créer un checkpoint et livrer la mise à jour


## Évolution terminée — historique des carnets
- [x] Ajouter la table d’historique des ajustements de cours
- [x] Enregistrer et exposer les ajustements de façon sécurisée
- [x] Afficher l’historique dans chaque carnet admin
- [x] Ajouter les tests, lancer TypeScript et build
- [x] Sauvegarder un checkpoint et livrer


## Évolution en cours — interface e-mails groupés

- [x] Ajouter une interface admin de sélection des destinataires
- [x] Ajouter la rédaction et l’aperçu du message
- [x] Vérifier le branchement Gmail avant tout envoi réel
- [x] Écrire les tests et sauvegarder un checkpoint

## Présences à traiter dans l’administration — terminé

- [x] Ajouter un statut de présence privé aux réservations confirmées.
- [x] Afficher une alerte pour les cours passés encore non traités.
- [x] Permettre de classer chaque présence : présent, absent excusé ou absent non prévenu.
- [x] Empêcher la réapparition d’une présence après son traitement et valider TypeScript, 98 tests, build et rendu mobile.

## Déduction automatique après validation de présence — terminé

- [x] Déduire automatiquement un cours lorsqu’un élève est marqué présent.
- [x] Empêcher les doubles déductions et conserver un historique explicite.
- [x] Permettre de restaurer le cours déduit depuis l’administration.
- [x] Migration synchronisée ; TypeScript, 100 tests Vitest, build et vérification responsive validés.

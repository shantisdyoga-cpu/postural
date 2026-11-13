# Vérification — choix d'une date précise

Le formulaire affiche désormais un champ date HTML5 pour les demandes de premier cours d'essai. Une aide précise indique que les cours ont lieu le mercredi ou le vendredi de 19h00 à 20h00 et que David doit confirmer la disponibilité.

Les captures desktop (1280 × 720) et mobile (375 × 812) montrent que le champ et son aide restent intégrés dans la carte de réservation sans débordement horizontal. La page conserve sa mise en page responsive.

La validation serveur exige une date au format ISO valide et refuse les jours autres que mercredi ou vendredi. La date est persistée dans `booking_requests.preferred_date`, affichée dans la confirmation et utilisée pour générer le rappel iCalendar provisoire.

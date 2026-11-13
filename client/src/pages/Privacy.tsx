import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80">
        <div className="container flex items-center justify-between py-5">
          <Link href="/" className="text-xl font-semibold tracking-tight text-accent transition-colors hover:text-accent/80">
            Sdyoga
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Link>
        </div>
      </header>

      <article className="container max-w-3xl py-16 sm:py-20">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">Sdyoga · David Sarre</p>
        <h1 className="mb-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Politique de confidentialité</h1>
        <p className="mb-12 text-sm text-muted-foreground">Dernière mise à jour : 25 août 2026</p>

        <div className="space-y-10 text-base leading-8 text-muted-foreground">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">Responsable du traitement</h2>
            <p>
              Sdyoga est l’activité personnelle de David Sarre, à Lambesc. Pour toute question concernant vos données personnelles, vous pouvez écrire à
              {" "}<a className="font-medium text-accent underline underline-offset-4" href="mailto:contact@sdyoga-postural.fr">contact@sdyoga-postural.fr</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">Données recueillies</h2>
            <p>
              Lorsque vous utilisez le formulaire de réservation ou de contact, le site peut recueillir votre nom, votre adresse e-mail, votre numéro de téléphone, le type de cours souhaité, la date et l’horaire demandés ainsi que le message que vous choisissez d’ajouter. Les demandes reçues par téléphone peuvent être saisies manuellement dans l’espace privé de gestion.
            </p>
            <p className="mt-4">
              Le formulaire n’a pas vocation à recueillir des informations médicales. Merci de ne pas y inscrire de données de santé détaillées.
            </p>
            <p className="mt-4">
              Si vous vous inscrivez à la liste d’attente des ateliers, seule votre adresse e-mail est enregistrée afin de vous informer lorsque les dates et tarifs seront publiés. Cette adresse n’est pas affichée publiquement ni utilisée à d’autres fins.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">Utilisation des données</h2>
            <p>
              Ces informations servent à répondre à votre demande, vérifier les disponibilités, organiser les cours et vous recontacter. Une demande n’est pas une réservation définitive : David valide personnellement chaque créneau. Les données sont conservées dans l’espace de gestion privé de Sdyoga et ne sont pas publiées sur le site.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">Google Agenda</h2>
            <p>
              Avec l’autorisation de David, l’application peut utiliser l’agenda Google professionnel associé à Sdyoga pour créer un événement, uniquement après la confirmation manuelle d’une demande. Pour un cours collectif, l’événement peut indiquer le nombre d’élèves confirmés. Les élèves ne sont pas ajoutés comme invités et aucune invitation automatique ne leur est envoyée.
            </p>
            <p className="mt-4">
              L’autorisation Google est conservée de façon sécurisée côté serveur et peut être retirée depuis le compte Google concerné. Les données de connexion Google ne sont pas demandées aux élèves et aucun accès à leur agenda n’est nécessaire.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">Hébergement et sécurité</h2>
            <p>
              Le site et son espace de gestion sont hébergés par un prestataire technique. Des mesures raisonnables sont mises en œuvre pour limiter l’accès aux demandes aux personnes autorisées et protéger les informations enregistrées. Les données peuvent également transiter par les services techniques nécessaires à l’envoi des messages et à la gestion de l’agenda.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">Durée de conservation et vos droits</h2>
            <p>
              Les informations sont conservées pendant la durée nécessaire au traitement de la demande et au suivi de la relation avec l’élève, puis supprimées lorsqu’elles ne sont plus utiles. Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à l’adresse de contact ci-dessous.
            </p>
            <p className="mt-4">
              Pour exercer une demande, indiquez l’adresse e-mail utilisée lors de votre prise de contact et l’objet de votre demande. Une réponse vous sera apportée dans un délai raisonnable.
            </p>
          </section>

          <section className="rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:p-8">
            <h2 className="mb-3 text-2xl font-semibold text-foreground">Nous contacter</h2>
            <p>
              Pour toute question relative à cette politique ou à vos données personnelles, contactez David Sarre à l’adresse suivante :
            </p>
            <a className="mt-4 inline-flex items-center gap-2 font-semibold text-accent underline underline-offset-4" href="mailto:contact@sdyoga-postural.fr">
              <Mail className="h-4 w-4" />
              contact@sdyoga-postural.fr
            </a>
          </section>
        </div>
      </article>
    </main>
  );
}

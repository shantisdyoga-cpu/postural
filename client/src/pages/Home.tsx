import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { trpc } from "@/lib/trpc";
import { calendarSlotLabels, downloadCalendarEvent } from "@/lib/calendar";
import { siteNotice } from "@/lib/siteNotice";
import { fr } from "date-fns/locale";
import { CalendarCheck, CalendarPlus, CheckCircle2, ChevronDown, Clock3, Euro, Info, Loader2, MapPin, Phone, X } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

type BookingFormState = {
  name: string;
  email: string;
  phone: string;
  requestType: "first_course" | "individual_course" | "phone_call" | "question";
  preferredSlot: "wednesday" | "friday" | "either" | "tuesday" | "thursday" | "saturday";
  preferredDate: string;
  preferredTime: string;
  durationMinutes: 20 | 60 | 90;
  message: string;
};

const initialBookingForm: BookingFormState = {
  name: "",
  email: "",
  phone: "",
  requestType: "first_course",
  preferredSlot: "either",
  preferredDate: "",
  preferredTime: "",
  durationMinutes: 60,
  message: "",
};

function formatBookingDate(date: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeZone: "Europe/Paris" }).format(new Date(`${date}T12:00:00Z`));
}

function toDateInputValue(date: Date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 10);
}

function isFutureDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);
  return candidate >= today;
}

function isCollectiveClassDate(date: Date) {
  return isFutureDate(date) && [3, 5].includes(date.getDay());
}

function isIndividualClassDate(date: Date) {
  return isFutureDate(date) && [2, 4, 6].includes(date.getDay());
}

function isPhoneCallDate(date: Date) {
  return isFutureDate(date) && [2, 4, 6].includes(date.getDay());
}

function getPhoneCallStartTimes() {
  return ["18:30", "19:00", "19:30"];
}

function getPhoneCallEndTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + 20;
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, "0")}:${String(totalMinutes % 60).padStart(2, "0")}`;
}

function getIndividualStartTimes(date: Date, durationMinutes: 60 | 90) {
  if (date.getDay() === 2 || date.getDay() === 4) return ["17:30"];
  if (date.getDay() !== 6) return [];
  return durationMinutes === 90
    ? ["09:30", "11:00", "12:30", "14:00", "15:30", "17:00"]
    : ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:00"];
}
export default function Home() {
  const [bookingForm, setBookingForm] = useState<BookingFormState>(initialBookingForm);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [submittedRequestType, setSubmittedRequestType] = useState<BookingFormState["requestType"]>("first_course");
  const [submittedSlot, setSubmittedSlot] = useState<BookingFormState["preferredSlot"]>("either");
  const [submittedDate, setSubmittedDate] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");
  const [submittedDuration, setSubmittedDuration] = useState<20 | 60 | 90>(60);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [quickMenuOpen, setQuickMenuOpen] = useState(false);
  const [showSiteNotice, setShowSiteNotice] = useState(true);
  const [workshopWaitlistEmail, setWorkshopWaitlistEmail] = useState("");
  const [highlightedTarget, setHighlightedTarget] = useState<string | null>(null);
  const bookingFeedbackRef = useRef<HTMLDivElement>(null);
  const highlightTimeoutRef = useRef<number | undefined>(undefined);

  const handleQuickMenuNavigation = (target: string) => {
    setQuickMenuOpen(false);
    setHighlightedTarget(target);
    if (highlightTimeoutRef.current) window.clearTimeout(highlightTimeoutRef.current);
    highlightTimeoutRef.current = window.setTimeout(() => setHighlightedTarget(null), 1600);
    window.requestAnimationFrame(() => {
      document.querySelector(target)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  };
  const phoneCallBlockedSlotsQuery = trpc.booking.phoneCallBlockedSlots.useQuery();
  const individualBlockedSlotsQuery = trpc.booking.individualBlockedSlots.useQuery();
  const blockedPhoneCallDates = new Set((phoneCallBlockedSlotsQuery.data ?? []).filter((slot) => !slot.startTime).map((slot) => String(slot.blockDate).slice(0, 10)));
  const blockedPhoneCallSlots = new Set((phoneCallBlockedSlotsQuery.data ?? []).filter((slot) => slot.startTime).map((slot) => `${String(slot.blockDate).slice(0, 10)}|${slot.startTime}`));
  const blockedIndividualDates = new Set((individualBlockedSlotsQuery.data ?? []).filter((slot) => !slot.startTime).map((slot) => String(slot.blockDate).slice(0, 10)));
  const blockedIndividualSlots = new Set((individualBlockedSlotsQuery.data ?? []).filter((slot) => slot.startTime).map((slot) => `${String(slot.blockDate).slice(0, 10)}|${slot.startTime}`));
  const workshopWaitlistMutation = trpc.workshopWaitlist.join.useMutation({
    onSuccess: () => setWorkshopWaitlistEmail(""),
  });
  const bookingMutation = trpc.booking.request.useMutation({
    onSuccess: (result) => {
      setBookingMessage(result.message);
      setBookingError("");
      setBookingForm(initialBookingForm);
    },
    onError: () => {
      setBookingError("Impossible d'envoyer votre demande pour le moment. Vérifiez vos informations ou appelez David au 06 51 59 21 08.");
      setBookingMessage("");
    },
  });

  useEffect(() => {
    if (bookingMessage || bookingError) {
      bookingFeedbackRef.current?.focus();
    }
  }, [bookingMessage, bookingError]);

  const handleBookingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingMessage("");
    setBookingError("");

    if (bookingForm.requestType === "first_course" || bookingForm.requestType === "individual_course" || bookingForm.requestType === "phone_call") {
      const selectedDate = new Date(`${bookingForm.preferredDate}T12:00:00Z`);
      const weekday = selectedDate.getUTCDay();
      if (!bookingForm.preferredDate || Number.isNaN(selectedDate.getTime())) {
        setBookingError("Choisissez une date valide pour votre demande.");
        return;
      }
      if (bookingForm.requestType === "first_course" && (weekday !== 3 && weekday !== 5)) {
        setBookingError("Choisissez un mercredi ou un vendredi pour votre cours d'essai.");
        return;
      }
      if (bookingForm.requestType === "phone_call") {
        const allowedTimes = getPhoneCallStartTimes();
        const expectedSlot = weekday === 2 ? "tuesday" : weekday === 4 ? "thursday" : weekday === 6 ? "saturday" : "";
        if (!expectedSlot || bookingForm.preferredSlot !== expectedSlot || !allowedTimes.includes(bookingForm.preferredTime) || blockedPhoneCallDates.has(bookingForm.preferredDate) || blockedPhoneCallSlots.has(`${bookingForm.preferredDate}|${bookingForm.preferredTime}`)) {
          setBookingError("Ce créneau d’appel n’est pas disponible. Choisissez-en un autre.");
          return;
        }
      }
      if (bookingForm.requestType === "individual_course") {
        const selectedLocalDate = new Date(`${bookingForm.preferredDate}T12:00:00`);
        const allowedTimes = getIndividualStartTimes(selectedLocalDate, bookingForm.durationMinutes === 90 ? 90 : 60);
        const expectedSlot = weekday === 2 ? "tuesday" : weekday === 4 ? "thursday" : weekday === 6 ? "saturday" : "";
        if (!expectedSlot || bookingForm.preferredSlot !== expectedSlot || !allowedTimes.includes(bookingForm.preferredTime) || blockedIndividualDates.has(bookingForm.preferredDate) || blockedIndividualSlots.has(`${bookingForm.preferredDate}|${bookingForm.preferredTime}`)) {
          setBookingError("Choisissez une date et un horaire disponibles pour votre cours individuel.");
          return;
        }
      }
    }

    setSubmittedRequestType(bookingForm.requestType);
    setSubmittedSlot(bookingForm.preferredSlot);
    setSubmittedDate(bookingForm.preferredDate);
    setSubmittedTime(bookingForm.preferredTime);
    setSubmittedDuration(bookingForm.durationMinutes);
    setCalendarAdded(false);
    bookingMutation.mutate({
      ...bookingForm,
      message: bookingForm.message || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/bfb4ca62-735e-4daf-b48f-389ea7baf3c3-1_all_8878_088e145c.png" alt="Sdyoga Logo" className="h-12 w-12" />
            <span className="text-2xl font-bold text-accent">Sdyoga</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#home" className="hover:text-accent transition-colors">Accueil</a>
            <a href="#about" className="hover:text-accent transition-colors">À propos</a>
            <a href="#approche" className="hover:text-accent transition-colors">Approche</a>
            <a href="#philosophy" className="hover:text-accent transition-colors">Philosophie</a>
            <a href="#testimonials" className="hover:text-accent transition-colors">Témoignages</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="tel:+33651592108"
              aria-label="Appeler David au 06 51 59 21 08"
              className="inline-flex items-center gap-1.5 rounded-md border border-accent px-2.5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Appeler
            </a>
            <a
              href="#booking"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Réserver
            </a>
          </div>
        </div>
      </header>

      <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-3 z-40 flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2 sm:bottom-6 sm:right-6 sm:gap-3" aria-label="Accès rapide aux informations pratiques">
        {quickMenuOpen && (
          <nav id="quick-practical-links" className="max-h-[min(55vh,22rem)] w-[min(18rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-accent/20 bg-background/95 p-2.5 shadow-xl backdrop-blur sm:p-3" aria-label="Informations pratiques">
            <p className="px-2 pb-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:pb-2 sm:text-xs sm:tracking-[0.16em]">Informations pratiques</p>
            <div className="grid gap-1">
              <a href="#schedule" onClick={() => setQuickMenuOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <Clock3 className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />Horaires
              </a>
              <a href="#pricing" onClick={(event) => { event.preventDefault(); handleQuickMenuNavigation("#pricing"); }} className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <Euro className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />Tarifs
              </a>
              <a href="#studio" onClick={() => setQuickMenuOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />Adresse du studio
              </a>
            </div>
          </nav>
        )}
        <button type="button" aria-expanded={quickMenuOpen} aria-controls="quick-practical-links" aria-label={quickMenuOpen ? "Fermer l’accès rapide" : "Ouvrir l’accès rapide aux informations pratiques"} onClick={() => setQuickMenuOpen((current) => !current)} className="inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-full bg-accent px-3 py-2.5 text-xs font-semibold text-accent-foreground shadow-lg transition-transform hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-95 sm:min-h-12 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm">
          {quickMenuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <CalendarCheck className="h-4 w-4" aria-hidden="true" />}
          <span className="hidden sm:inline">{quickMenuOpen ? "Fermer" : "Infos pratiques"}</span>
        </button>
      </div>

      {showSiteNotice && (
        <div className="border-b border-accent/20 bg-accent/5" role="status" aria-label="Information Sdyoga">
          <div className="container mx-auto flex items-start gap-3 px-4 py-3 text-sm text-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <p className="flex-1 leading-relaxed"><strong className="font-semibold">{siteNotice.title}</strong> {siteNotice.message}</p>
            <button type="button" onClick={() => setShowSiteNotice(false)} className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Fermer la notification">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">Sdyoga · Lambesc</p>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Un yoga <span className="text-accent">postural</span>, structuré et bienveillant
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Avec David Sarre, à Lambesc : une pratique précise, adaptée à votre corps et à votre rythme.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Chez Sdyoga, chaque posture est un chemin d'exploration, jamais une performance à atteindre. David Sarre vous accompagne pour comprendre votre corps, ajuster votre pratique et progresser avec confiance.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-8">
              <a href="#booking" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
                Essayer un cours
              </a>
              <a href="#approche" className="inline-flex items-center justify-center rounded-md border border-accent px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10">
                Découvrir l'approche
              </a>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-accent" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Postural Approach Section */}
      <section id="approche" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent mb-4">L'approche Sdyoga</p>
              <h2 className="text-4xl font-bold text-foreground mb-6">Habiter son corps avec plus de justesse</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                L'approche posturale de Sdyoga ne consiste pas à rechercher une forme parfaite ou à forcer la souplesse. Elle invite à observer la manière dont chacun se place, respire et se meut, afin de trouver une organisation plus juste et plus confortable pour son propre corps.
              </p>
            </div>

            <Card className="mb-8 border-accent/20 bg-accent/5 p-5 text-center shadow-sm sm:p-6">
              <p className="text-base font-semibold leading-relaxed text-foreground sm:text-lg">
                Quel que soit votre niveau de souplesse, les cours sont faits pour vous.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Le travail sera simplement adapté à votre corps et à vos besoins. Vous n’avez pas besoin d’être souple pour commencer ; tel que vous êtes, vous êtes déjà au bon endroit.
              </p>
            </Card>

            <Card role="note" className="mb-8 border-amber-200/70 bg-amber-50/60 p-4 shadow-sm sm:p-5">
              <p className="text-sm leading-relaxed text-amber-950 sm:text-base">
                <strong className="font-semibold">À noter :</strong> le yoga accompagne votre bien-être, mais ne remplace pas un avis médical. En cas de douleur inhabituelle, persistante ou préoccupante, demandez conseil à votre médecin ou au professionnel de santé adapté avant de commencer ou de poursuivre la pratique.
              </p>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-7 bg-card border-border shadow-sm">
                <h3 className="text-xl font-semibold text-accent mb-4">La posture avant la performance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Une posture n'est pas une image à reproduire. C'est une expérience à ressentir. Vous apprenez à distinguer l'effort utile de la tension inutile et à respecter vos limites.
                </p>
              </Card>
              <Card className="p-7 bg-card border-border shadow-sm">
                <h3 className="text-xl font-semibold text-accent mb-4">Des supports adaptés</h3>
                <p className="text-muted-foreground leading-relaxed">
                  J'utilise différents accessoires — briques, bâtons, sangles et parfois même des balles de tennis — pour mieux sentir les appuis, clarifier les placements du corps et adapter la pratique à la physiologie de chacun. L'accessoire n'est pas là pour forcer le corps, mais pour l'accompagner. Il aide à trouver des repères, à se sentir guidé et à pratiquer avec davantage de sécurité et d'apaisement.
                </p>
              </Card>
              <Card className="p-7 bg-card border-border shadow-sm">
                <h3 className="text-xl font-semibold text-accent mb-4">Écouter pour évoluer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chaque posture est adaptée à votre morphologie, à votre histoire et à vos possibilités. L'objectif est de mieux vous mouvoir au quotidien, avec confiance et bienveillance.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
              À propos de David
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Après 15 ans de boulangerie, j'ai découvert le yoga comme une véritable révélation. Les conditions de travail nocturnes et stressantes avaient impacté mon corps. Après 5 ans de pratique personnelle, j'ai décidé de me former pour transmettre cette discipline à d'autres.
                </p>
                
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Le yoga ne m'a pas rendu souple, il m'a rendu mon corps, mon souffle et ma liberté.</span>
                  </p>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                  Je ne fais pas du yoga pour réussir des postures parfaites. Je le fais parce que le yoga m'a rendu mon corps. Pendant longtemps, il m'a été étranger, bloqué par trois hernies, fermé. Le yoga m'a réappris à habiter ma structure, à faire circuler mes émotions et à respirer à nouveau librement.
                  </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ce que je transmets aujourd'hui chez Sdyoga, ce ne sont pas des vérités absolues. Je ne veux pas qu'on me croie sur parole. Je veux que vous sortiez de mes cours avec des questions, de la curiosité et l'envie d'explorer. Mon rôle, c'est simplement de vous donner des clés pour que vous fassiez vos propres expériences — et que vous ressentiez la liberté dans votre propre corps.
                </p>

                <div className="pt-4">
                  <h3 className="text-xl font-semibold text-accent mb-4">Formation</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      <span>Yoga 200h (2018)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      <span>Formation en yoga thérapeutique suivie par David auprès de Cath et Serge Gastineau (2025-2026)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-3">✓</span>
                      <span>Formation continue en anatomie et posturologie</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-8 border border-border">
                <div className="text-center py-8">
                  <div className="text-5xl font-bold text-accent mb-2">2019</div>
                  <p className="text-muted-foreground">Enseignement depuis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-20 bg-gradient-to-r from-accent/5 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-foreground">
              Un principe qui guide ma pratique
            </h2>
            
            <Card className="p-12 bg-background border-accent/20 shadow-lg">
              <p className="text-3xl md:text-4xl font-serif italic text-foreground mb-6 leading-relaxed">
                Tu ne peux pas transmettre ce que tu n'as pas intégré dans ton corps.
              </p>
              
              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-muted-foreground leading-relaxed">
                  Ces mots expriment l'engagement de David envers une transmission authentique. Chaque cours s'appuie sur sa pratique personnelle, sa formation continue et une attention concrète à ce que chaque élève ressent dans son corps.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent mb-4">Sdyoga en images</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">La salle et la pratique</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ces images donnent un aperçu de l’espace où David accueille ses élèves et de l’atmosphère des cours Sdyoga, à Lambesc.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 max-w-5xl mx-auto">
            <div className="bg-card rounded-lg overflow-hidden border border-accent/30 shadow-sm">
              <img
                src="/manus-storage/IMG_3301_f05041fb.webp"
                alt="La salle de yoga Sdyoga à Lambesc, lumineuse et équipée de tapis"
                className="w-full object-cover object-top aspect-[16/9]"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-accent mb-2">La salle Sdyoga</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Un espace lumineux et calme, pensé pour pratiquer avec attention, confort et sécurité.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {[
                {
                  src: '/manus-storage/6321_d8beb22b.jpg',
                  alt: 'David accompagne un cours de yoga Sdyoga',
                  title: 'Dans les cours Sdyoga',
                  description: 'Une photo prise pendant un cours animé par David.'
                },
                {
                  src: '/manus-storage/7573-visage-floute_b13092e4.jpg',
                  alt: 'Élèves en pratique dans la salle Sdyoga avec des supports',
                  title: 'Une pratique adaptée',
                  description: 'Les accessoires accompagnent les élèves dans une pratique concrète et progressive.'
                },
                {
                  src: '/manus-storage/7577_a5eca8cb.jpg',
                  alt: 'David accompagne un élève dans une posture avec des supports',
                  title: 'Un accompagnement précis',
                  description: 'Les supports et les ajustements permettent de trouver des repères adaptés à chacun.',
                  objectPosition: 'center 18%'
                },
              ].map((photo) => (
                <article key={photo.src} className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
                  <img src={photo.src} alt={photo.alt} style={photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined} className="w-full object-cover aspect-[4/3]" />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-accent mb-1">{photo.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{photo.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h3 className="text-2xl font-semibold text-foreground mb-3">Quelques étapes de mon parcours</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ces photos montrent des formations suivies par David.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { src: '/manus-storage/IMG_1233_5f98b17b.JPG', alt: 'Groupe de stagiaires réunis avec leurs diplômes lors d’une formation de yoga enfant', caption: 'Une étape de formation en yoga enfant' },
                { src: '/manus-storage/6156_4048f4a7.png', alt: 'David pendant une formation suivie auprès de Cath et Serge Gastineau', caption: 'Formation de David' },
                { src: '/manus-storage/sdyoga-formation-sans-inscription_6f6c278c.webp', alt: 'David accompagne une posture avec une sangle pendant une formation', caption: 'Travail postural en formation' },
              ].map((photo) => (
                <figure key={photo.src} className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
                  <img src={photo.src} alt={photo.alt} className="w-full object-cover aspect-square" />
                  <figcaption className="p-4 text-sm text-muted-foreground text-center">{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6">Photos de stage de David chez Cath et Serge Gastineau.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Ce que disent nos élèves
          </h2>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pascal — mise en avant inspirée du format Instagram Sdyoga */}
            <Card className="relative overflow-hidden border-0 bg-accent p-8 text-accent-foreground shadow-xl lg:scale-[1.03]">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-accent-foreground/20" aria-hidden="true" />
              <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full border border-accent-foreground/20" aria-hidden="true" />
              <div className="relative text-center mb-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent-foreground/75">Avis de Pascal</p>
                <div className="flex justify-center gap-1" aria-label="Cinq étoiles sur cinq">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl text-amber-300" aria-hidden="true">★</span>
                  ))}
                </div>
              </div>
              <blockquote className="relative text-center font-serif text-lg leading-relaxed text-accent-foreground">
                « David vous fera évoluer à votre rythme avec altruisme, empathie et bienveillance. »
              </blockquote>
              <p className="relative mt-6 border-t border-accent-foreground/20 pt-5 text-center text-sm leading-relaxed text-accent-foreground/85">
                Après 2 saisons de pratique à ses côtés, ce que j'apprécie chez lui c'est sa générosité de cœur. C'est rare et c'est précieux chez un professeur de yoga.
              </p>
              <p className="relative mt-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground/70">Pascal</p>
            </Card>

            {/* Laure M */}
            <Card className="p-8 bg-card border-border shadow-lg">
              <div className="text-center mb-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl text-yellow-500">★</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-accent mb-1">Laure M.</h3>
                <p className="text-xs text-muted-foreground">Juin 2024</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Une séance hebdomadaire durant un an aux côtés de David pour découvrir le yoga. David est très pédagogue et surtout s'adapte à toutes les situations. Il écoute nos besoins et nous fait progresser en douceur."
              </p>
            </Card>

            {/* Julie M */}
            <Card className="p-8 bg-card border-border shadow-lg">
              <div className="text-center mb-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl text-yellow-500">★</span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-accent mb-1">Julie M.</h3>
                <p className="text-xs text-muted-foreground">Juin 2025</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "Première année de yoga pour moi et une très belle découverte. David est un excellent professeur qui s'adapte aux besoins de chacun. Un bel équilibre entre étirements, renforcement et relaxation qui me font vraiment du bien."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Schedule & Pricing Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Planning et tarifs
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Schedule */}
            <div id="schedule" className={`scroll-mt-24 transition-all duration-500 motion-reduce:transition-none ${highlightedTarget === "#schedule" ? "rounded-2xl ring-2 ring-accent/35 shadow-lg" : ""}`}>
              <h3 className="text-2xl font-semibold text-accent mb-6">Horaires des cours</h3>
              <div className="space-y-6">
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-foreground">Cours collectifs</h4>
                    <p className="mt-1 text-sm text-muted-foreground">Une pratique en petit groupe, le soir.</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { day: 'Mercredi', time: '19h00 - 20h00' },
                      { day: 'Vendredi', time: '19h00 - 20h00' },
                    ].map((schedule) => (
                      <div key={schedule.day} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
                        <span className="font-semibold text-foreground">{schedule.day}</span>
                        <span className="text-right text-muted-foreground">{schedule.time}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#booking"
                    onClick={() => setBookingForm((current) => ({ ...current, requestType: "first_course", preferredSlot: "either", preferredDate: "", preferredTime: "" }))}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    Réserver un cours d’essai
                  </a>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-foreground">Cours individuels</h4>
                    <p className="mt-1 text-sm text-muted-foreground">Un accompagnement personnalisé, selon vos disponibilités.</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { day: 'Mardi et jeudi', time: '17h30 - 19h00' },
                      { day: 'Samedi', time: '9h30 - 19h00' },
                    ].map((schedule) => (
                      <div key={schedule.day} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
                        <span className="font-semibold text-foreground">{schedule.day}</span>
                        <span className="text-right text-muted-foreground">{schedule.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                  <div className="mb-2">
                    <h4 className="text-lg font-semibold text-foreground">Ateliers de yoga · 2 h</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Des temps de pratique avec supports pour approfondir la compréhension du corps, du mouvement et du souffle.</p>
                    <details className="group mt-4 rounded-xl border border-accent/15 bg-background/70 p-4">
                      <summary className="cursor-pointer list-none text-sm font-semibold text-foreground outline-none marker:hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
                        <span className="inline-flex items-center gap-2">Découvrir les détails de l’atelier <span aria-hidden="true" className="text-accent transition-transform duration-200 group-open:rotate-180">⌄</span></span>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">Survolez ou cliquez pour ouvrir</span>
                      </summary>
                      <div className="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-96 group-hover:opacity-100 group-focus-within:max-h-96 group-focus-within:opacity-100 group-open:max-h-96 group-open:opacity-100 motion-reduce:transition-none">
                        <p className="text-sm font-semibold text-foreground">Quelques thèmes possibles</p>
                        <ul className="mt-2 grid gap-1.5 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
                          <li>• Comprendre et affiner ses appuis</li>
                          <li>• Mobilité du bassin et de la colonne</li>
                          <li>• Respirer pour mieux habiter son corps</li>
                          <li>• Explorer les épaules et la cage thoracique</li>
                        </ul>
                        <p className="mt-3 text-xs italic text-muted-foreground">Ces thèmes sont indicatifs et pourront évoluer selon les prochains ateliers.</p>
                        <p className="mt-3 rounded-lg border border-accent/20 bg-accent/10 px-3 py-2 text-sm font-semibold text-accent">Premier atelier prévu : samedi 6 mars 2027 · 10 h – 12 h</p>
                        <p className="mt-2 text-sm italic text-muted-foreground">Tarifs à venir prochainement</p>
                      </div>
                    </details>
                  </div>
                  <form
                    className="mt-4 space-y-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      workshopWaitlistMutation.mutate({ email: workshopWaitlistEmail });
                    }}
                  >
                    <label htmlFor="workshop-waitlist-email" className="block text-sm font-medium text-foreground">Être informé(e) des prochains ateliers</label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        id="workshop-waitlist-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={workshopWaitlistEmail}
                        onChange={(event) => setWorkshopWaitlistEmail(event.target.value)}
                        placeholder="Votre adresse e-mail"
                        className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <Button type="submit" size="sm" disabled={workshopWaitlistMutation.isPending} className="h-10 shrink-0">
                        {workshopWaitlistMutation.isPending ? "Inscription…" : "M’inscrire"}
                      </Button>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">Votre adresse sera utilisée uniquement pour vous informer des futurs ateliers.</p>
                    {workshopWaitlistMutation.data?.message && <p role="status" aria-live="polite" className="text-sm font-medium text-accent">{workshopWaitlistMutation.data.message}</p>}
                    {workshopWaitlistMutation.error && <p role="alert" className="text-sm text-destructive">{workshopWaitlistMutation.error.message}</p>}
                  </form>
                </div>
              </div>
            </div>
            
            {/* Pricing */}
            <div id="pricing" className={`scroll-mt-24 transition-all duration-500 motion-reduce:transition-none ${highlightedTarget === "#pricing" ? "rounded-2xl ring-2 ring-accent/35 shadow-lg" : ""}`}>
              <h3 className="text-2xl font-semibold text-accent mb-6">Tarifs</h3>
              <div className="space-y-6">
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                  <div className="mb-5">
                    <h4 className="text-lg font-semibold text-foreground">Cours collectifs</h4>
                    <p className="mt-1 text-sm text-muted-foreground">Des formules adaptées à votre rythme, seul ou à deux.</p>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">Abonnements — régularité</p>
                      <div className="space-y-3">
                        <div className="rounded-lg border border-border bg-background p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-foreground">Annuel Solo</p><p className="mt-1 text-sm text-muted-foreground">2 cours par semaine</p></div><p className="text-lg font-bold text-accent">280 €<span className="block text-xs font-medium text-muted-foreground">par an</span></p></div><p className="mt-2 text-xs text-muted-foreground">Paiement possible en 1, 2 ou 3 fois, avec règlement complet dans les trois premiers mois.</p></div>
                        <div className="rounded-lg border border-border bg-background p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-foreground">Annuel Duo / Couple</p><p className="mt-1 text-sm text-muted-foreground">2 cours par semaine chacun</p></div><p className="text-lg font-bold text-accent">490 €<span className="block text-xs font-medium text-muted-foreground">par an</span></p></div><p className="mt-2 text-xs text-muted-foreground">Pour 2 personnes désignées. Une personne référente assure le règlement. Paiement en 1, 2 ou 3 fois, complet dans les trois premiers mois.</p></div>
                        <div className="rounded-lg border border-border bg-background p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-foreground">Mensuel Solo</p><p className="mt-1 text-sm text-muted-foreground">2 cours par semaine</p></div><p className="text-lg font-bold text-accent">40 €<span className="block text-xs font-medium text-muted-foreground">par mois</span></p></div><p className="mt-2 text-xs text-muted-foreground">Sans engagement.</p></div>
                        <div className="rounded-lg border border-border bg-background p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-foreground">Mensuel Duo / Couple</p><p className="mt-1 text-sm text-muted-foreground">2 cours par semaine chacun</p></div><p className="text-lg font-bold text-accent">70 €<span className="block text-xs font-medium text-muted-foreground">par mois</span></p></div><p className="mt-2 text-xs text-muted-foreground">Pour 2 personnes désignées, sans engagement. Une personne référente assure le règlement.</p></div>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">À la carte — flexibilité</p>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background p-4"><div><p className="font-semibold text-foreground">Carnet 10 cours Solo</p><p className="mt-1 text-xs text-muted-foreground">Pour une personne · valable 6 mois</p></div><span className="text-lg font-bold text-accent">120 €</span></div>
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background p-4"><div><p className="font-semibold text-foreground">Carnet 20 cours Duo</p><p className="mt-1 text-xs text-muted-foreground">À partager entre 2 personnes · valable 6 mois</p></div><span className="text-lg font-bold text-accent">210 €</span></div>
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background p-4"><div><p className="font-semibold text-foreground">Carnet 10 cours Duo</p><p className="mt-1 text-xs text-muted-foreground">À partager entre 2 personnes · valable 3 mois</p></div><span className="text-lg font-bold text-accent">120 €</span></div>
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-background p-4"><div><p className="font-semibold text-foreground">Cours à l’unité</p><p className="mt-1 text-xs text-muted-foreground">Par personne</p></div><span className="text-lg font-bold text-accent">15 €</span></div>
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-dashed border-accent/40 bg-background/70 p-4"><div><p className="font-semibold text-foreground">Carte 5 cours</p><p className="mt-1 text-xs text-muted-foreground">Option éventuelle · valable 2 mois</p></div><span className="text-lg font-bold text-accent">70 €</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-foreground">Cours individuels</h4>
                    <p className="mt-1 text-sm text-muted-foreground">Un accompagnement personnalisé, selon la durée choisie.</p>
                  </div>
                  <p className="mb-4 rounded-lg border border-accent/20 bg-accent/5 px-3 py-2.5 text-sm leading-relaxed text-foreground"><strong className="font-semibold text-accent">À savoir :</strong> un appel téléphonique préparatoire de 20 minutes est conseillé avant toute réservation, afin de faire connaissance et de mieux cerner vos besoins. La réservation directe d’un cours individuel reste bien entendu possible.</p>
                  <a
                    href="#booking"
                    onClick={() => setBookingForm((current) => ({ ...current, requestType: "phone_call", preferredSlot: "tuesday", preferredDate: "", preferredTime: "", durationMinutes: 20 }))}
                    className="mb-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-accent px-4 py-3 text-sm font-semibold text-accent transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent/10 hover:shadow-sm active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    Réserver un appel préparatoire
                  </a>
                  <div className="space-y-3">
                    {[
                      { type: '1 h', price: '50€' },
                      { type: '1 h 30', price: '70€' },
                    ].map((pricing) => (
                      <div key={pricing.type} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background p-4">
                        <span className="font-semibold text-foreground">{pricing.type}</span>
                        <span className="text-lg font-bold text-accent">{pricing.price}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#booking"
                    onClick={() => setBookingForm((current) => ({ ...current, requestType: "individual_course", preferredSlot: "saturday", preferredDate: "", preferredTime: "" }))}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    Réserver un cours individuel
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div id="studio" className={`mt-12 scroll-mt-24 p-8 bg-muted/50 rounded-lg border border-border text-center max-w-2xl mx-auto transition-all duration-500 motion-reduce:transition-none ${highlightedTarget === "#studio" ? "ring-2 ring-accent/35 shadow-lg" : ""}`}>
            <h3 className="text-xl font-semibold text-foreground mb-2">Lieu</h3>
            <p className="text-muted-foreground mb-2">Espace Maitai</p>
            <p className="text-muted-foreground mb-4">22 bis René Dumont, 13410 Lambesc</p>
            <p className="text-muted-foreground">Email: contact@sdyoga-postural.fr</p>
            <p className="text-muted-foreground">Téléphone: 06.51.59.21.08</p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="scroll-mt-24 py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-3">Premier contact</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">Réserver un cours</h2>
            <p className="text-muted-foreground leading-relaxed">
              Envoyez votre demande pour un premier cours d'essai ou posez une question. David vous répondra personnellement pour confirmer le créneau disponible.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8 max-w-5xl mx-auto items-start">
            <Card className="p-6 sm:p-8 bg-card border-border shadow-lg">
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="booking-name" className="block text-sm font-semibold text-foreground mb-2">Nom *</label>
                    <input
                      id="booking-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={bookingForm.name}
                      onChange={(event) => setBookingForm((current) => ({ ...current, name: event.target.value }))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-email" className="block text-sm font-semibold text-foreground mb-2">Email *</label>
                    <input
                      id="booking-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={bookingForm.email}
                      onChange={(event) => setBookingForm((current) => ({ ...current, email: event.target.value }))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="booking-phone" className="block text-sm font-semibold text-foreground mb-2">Téléphone *</label>
                    <input
                      id="booking-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={bookingForm.phone}
                      onChange={(event) => setBookingForm((current) => ({ ...current, phone: event.target.value }))}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="06 00 00 00 00"
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-type" className="block text-sm font-semibold text-foreground mb-2">Votre demande *</label>
                    <select
                      id="booking-type"
                      name="requestType"
                      value={bookingForm.requestType}
                      onChange={(event) => {
                        const requestType = event.target.value as BookingFormState["requestType"];
                        setBookingForm((current) => ({
                          ...current,
                          requestType,
                          preferredDate: "",
                          preferredTime: "",
                          preferredSlot: requestType === "first_course" ? "either" : requestType === "individual_course" || requestType === "phone_call" ? "saturday" : "either",
                        }));
                      }}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="first_course">Premier cours d'essai</option>
                          <option value="individual_course">Cours individuel</option>
                          <option value="phone_call">Appel téléphonique — 20 min</option>
                          <option value="question">Question générale</option>
                    </select>
                  </div>
                </div>

                  {bookingForm.requestType === "first_course" && (
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">Date souhaitée pour le cours d'essai *</p>
                      <p id="booking-date-help" className="mb-3 text-xs text-muted-foreground">Seuls les mercredis et vendredis sont disponibles, de 19h00 à 20h00. Les autres jours sont désactivés.</p>
                      <Calendar
                        id="booking-date"
                        mode="single"
                        locale={fr}
                        selected={bookingForm.preferredDate ? new Date(`${bookingForm.preferredDate}T12:00:00`) : undefined}
                        onSelect={(selectedDate) => {
                          if (!selectedDate) return;
                          const value = toDateInputValue(selectedDate);
                          const weekday = selectedDate.getDay();
                          setBookingForm((current) => ({
                            ...current,
                            preferredDate: value,
                            preferredSlot: weekday === 3 ? "wednesday" : "friday",
                          }));
                        }}
                        disabled={(date) => !isCollectiveClassDate(date)}
                        fromMonth={new Date()}
                        showOutsideDays={false}
                        aria-describedby="booking-date-help"
                        className="w-full rounded-lg border border-border bg-background p-3"
                        classNames={{ disabled: "cursor-not-allowed text-muted-foreground/35 opacity-40" }}
                      />
                      {bookingForm.preferredDate && <p className="mt-3 text-sm font-medium text-accent">Créneau sélectionné : {formatBookingDate(bookingForm.preferredDate)}, 19h00–20h00.</p>}
                    </div>
                  )}

                  {bookingForm.requestType === "individual_course" && (
                    <div className="space-y-5 rounded-xl border border-accent/20 bg-accent/5 p-4 sm:p-5">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">Cours individuel *</p>
                        <p className="mb-3 text-xs text-muted-foreground">Choisissez une durée, puis une date et un horaire. Les cours individuels ont lieu le samedi de 9h30 à 19h00, ou le mardi et le jeudi de 17h30 à 19h00.</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {[{ value: 60 as const, label: "1 h — 50 €" }, { value: 90 as const, label: "1 h 30 — 70 €" }].map((option) => (
                            <label key={option.value} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors ${bookingForm.durationMinutes === option.value ? "border-accent bg-background text-accent" : "border-border bg-background/70 text-foreground"}`}>
                              <input
                                type="radio"
                                name="durationMinutes"
                                value={option.value}
                                checked={bookingForm.durationMinutes === option.value}
                                onChange={() => setBookingForm((current) => ({ ...current, durationMinutes: option.value, preferredTime: "" }))}
                                className="h-4 w-4 accent-accent"
                              />
                              <span className="font-medium">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">Date souhaitée *</p>
                        <p id="individual-date-help" className="mb-3 text-xs text-muted-foreground">Les dates disponibles sont le mardi, le jeudi et le samedi. Les autres jours sont désactivés.</p>
                        <Calendar
                          id="individual-date"
                          mode="single"
                          locale={fr}
                          selected={bookingForm.preferredDate ? new Date(`${bookingForm.preferredDate}T12:00:00`) : undefined}
                          onSelect={(selectedDate) => {
                            if (!selectedDate) return;
                            const value = toDateInputValue(selectedDate);
                            const weekday = selectedDate.getDay();
                            const preferredSlot = weekday === 2 ? "tuesday" : weekday === 4 ? "thursday" : "saturday";
                            setBookingForm((current) => ({
                              ...current,
                              preferredDate: value,
                              preferredSlot,
                              preferredTime: getIndividualStartTimes(selectedDate, current.durationMinutes === 90 ? 90 : 60).find((time) => !blockedIndividualSlots.has(`${value}|${time}`)) ?? "",
                            }));
                          }}
                          disabled={(date) => {
                            if (!isIndividualClassDate(date)) return true;
                            const dateValue = toDateInputValue(date);
                            if (blockedIndividualDates.has(dateValue)) return true;
                            const times = getIndividualStartTimes(date, bookingForm.durationMinutes === 90 ? 90 : 60);
                            return times.length > 0 && times.every((time) => blockedIndividualSlots.has(`${dateValue}|${time}`));
                          }}
                          fromMonth={new Date()}
                          showOutsideDays={false}
                          aria-describedby="individual-date-help"
                          className="w-full rounded-lg border border-border bg-background p-3"
                          classNames={{ disabled: "cursor-not-allowed text-muted-foreground/35 opacity-40" }}
                        />
                      </div>
                      <div>
                        <label htmlFor="individual-time" className="block text-sm font-semibold text-foreground mb-2">Horaire souhaité *</label>
                        <select
                          id="individual-time"
                          name="preferredTime"
                          required
                          disabled={!bookingForm.preferredDate}
                          value={bookingForm.preferredTime}
                          onChange={(event) => setBookingForm((current) => ({ ...current, preferredTime: event.target.value }))}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {!bookingForm.preferredDate && <option value="">Choisissez d'abord une date</option>}
                          {bookingForm.preferredDate && getIndividualStartTimes(new Date(`${bookingForm.preferredDate}T12:00:00`), bookingForm.durationMinutes === 90 ? 90 : 60).filter((time) => !blockedIndividualSlots.has(`${bookingForm.preferredDate}|${time}`)).map((time) => <option key={time} value={time}>{time}</option>)}
                        </select>
                        {bookingForm.preferredDate && blockedIndividualDates.has(bookingForm.preferredDate) && <p className="mt-2 text-sm text-destructive">Cette date est entièrement bloquée. Choisissez une autre date.</p>}
                        {bookingForm.preferredDate && !blockedIndividualDates.has(bookingForm.preferredDate) && getIndividualStartTimes(new Date(`${bookingForm.preferredDate}T12:00:00`), bookingForm.durationMinutes === 90 ? 90 : 60).every((time) => blockedIndividualSlots.has(`${bookingForm.preferredDate}|${time}`)) && <p className="mt-2 text-sm text-destructive">Tous les créneaux de cette date sont bloqués. Choisissez une autre date.</p>}
                        {bookingForm.preferredDate && bookingForm.preferredTime && <p className="mt-3 text-sm font-medium text-accent">Créneau sélectionné : {formatBookingDate(bookingForm.preferredDate)}, {bookingForm.preferredTime} ({bookingForm.durationMinutes === 90 ? "1 h 30 — 70 €" : "1 h — 50 €"}).</p>}
                      </div>
                    </div>
                  )}

                  {bookingForm.requestType === "phone_call" && (
                    <div className="space-y-5 rounded-xl border border-accent/20 bg-accent/5 p-4 sm:p-5">
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-2">Appel téléphonique préparatoire *</p>
                        <p id="phone-call-date-help" className="mb-3 text-xs text-muted-foreground">Un échange de 20 minutes est proposé le mardi, le jeudi ou le samedi, entre 18h30 et 20h00. Les créneaux bloqués par David sont désactivés.</p>
                        <Calendar
                          id="phone-call-date"
                          mode="single"
                          locale={fr}
                          selected={bookingForm.preferredDate ? new Date(`${bookingForm.preferredDate}T12:00:00`) : undefined}
                          onSelect={(selectedDate) => {
                            if (!selectedDate) return;
                            const value = toDateInputValue(selectedDate);
                            const weekday = selectedDate.getDay();
                            const preferredSlot = weekday === 2 ? "tuesday" : weekday === 4 ? "thursday" : "saturday";
                            const firstAvailable = getPhoneCallStartTimes().find((time) => !blockedPhoneCallSlots.has(`${value}|${time}`)) ?? "";
                            setBookingForm((current) => ({ ...current, preferredDate: value, preferredSlot, preferredTime: firstAvailable }));
                          }}
                          disabled={(date) => {
                            if (!isPhoneCallDate(date)) return true;
                            const value = toDateInputValue(date);
                            return blockedPhoneCallDates.has(value) || getPhoneCallStartTimes().every((time) => blockedPhoneCallSlots.has(`${value}|${time}`));
                          }}
                          fromMonth={new Date()}
                          showOutsideDays={false}
                          aria-describedby="phone-call-date-help"
                          className="w-full rounded-lg border border-border bg-background p-3"
                          classNames={{ disabled: "cursor-not-allowed text-muted-foreground/35 opacity-40" }}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone-call-time" className="block text-sm font-semibold text-foreground mb-2">Horaire souhaité *</label>
                        <select
                          id="phone-call-time"
                          name="phoneCallTime"
                          required
                          disabled={!bookingForm.preferredDate}
                          value={bookingForm.preferredTime}
                          onChange={(event) => setBookingForm((current) => ({ ...current, preferredTime: event.target.value }))}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {!bookingForm.preferredDate && <option value="">Choisissez d'abord une date</option>}
                          {bookingForm.preferredDate && getPhoneCallStartTimes().filter((time) => !blockedPhoneCallDates.has(bookingForm.preferredDate) && !blockedPhoneCallSlots.has(`${bookingForm.preferredDate}|${time}`)).map((time) => <option key={time} value={time}>{time} — 20 minutes</option>)}
                        </select>
                        {bookingForm.preferredDate && (blockedPhoneCallDates.has(bookingForm.preferredDate) || !getPhoneCallStartTimes().some((time) => !blockedPhoneCallSlots.has(`${bookingForm.preferredDate}|${time}`))) && <p className="mt-2 text-sm text-destructive">Tous les créneaux de cette date sont bloqués. Choisissez une autre date.</p>}
                        {bookingForm.preferredDate && bookingForm.preferredTime && <p className="mt-3 text-sm font-medium text-accent">Appel sélectionné : {formatBookingDate(bookingForm.preferredDate)}, {bookingForm.preferredTime}–{getPhoneCallEndTime(bookingForm.preferredTime)} · 20 minutes.</p>}
                      </div>
                    </div>
                  )}

                <div>
                  <label htmlFor="booking-message" className="block text-sm font-semibold text-foreground mb-2">Message <span className="font-normal text-muted-foreground">(facultatif)</span></label>
                  <textarea
                    id="booking-message"
                    name="message"
                    rows={4}
                    value={bookingForm.message}
                    onChange={(event) => setBookingForm((current) => ({ ...current, message: event.target.value }))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
                    placeholder="Parlez-moi de votre demande..."
                  />
                </div>

                <p className="rounded-lg border border-amber-200/70 bg-amber-50/60 px-3 py-2.5 text-xs leading-relaxed text-amber-950">
                  <strong className="font-semibold">Important :</strong> le yoga ne remplace pas un avis médical. En cas de douleur inhabituelle, persistante ou préoccupante, demandez conseil à un professionnel de santé avant de commencer ou de poursuivre la pratique.
                </p>
                <p className="text-xs text-muted-foreground">
                  Votre demande reste privée et ne vaut pas confirmation de réservation. David vous recontactera pour valider la disponibilité.
                </p>

                {(bookingMessage || bookingError) && (
                  <div ref={bookingFeedbackRef} tabIndex={-1} className="outline-none" aria-live="polite">
                    {bookingMessage && (
                      <div role="status" className="booking-confirmation relative overflow-hidden rounded-xl border border-accent/25 bg-accent/10 p-5 text-accent shadow-sm">
                        <div className="booking-confirmation-glow absolute -right-8 -top-10 h-28 w-28 rounded-full bg-accent/15" aria-hidden="true" />
                        <div className="relative flex items-start gap-3">
                          <span className="booking-confirmation-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm" aria-hidden="true">
                            <CheckCircle2 className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="font-semibold">Votre demande a bien été envoyée</p>
                            <p className="mt-1 text-sm leading-relaxed text-accent/90">{bookingMessage}</p>
                            <p className="mt-3 text-xs leading-relaxed text-accent/75">Merci pour votre confiance. David reviendra vers vous personnellement pour confirmer le créneau.</p>
                            {submittedRequestType !== "question" && (
                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    downloadCalendarEvent(submittedSlot, submittedDate, new Date(), submittedTime || "19:00", submittedDuration);
                                    setCalendarAdded(true);
                                  }}
                                  className="border-accent bg-background text-accent hover:bg-accent/10"
                                >
                                  <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                                  Ajouter au calendrier
                                </Button>
                                <span className="text-xs leading-relaxed text-accent/75">
                                  {calendarAdded
                                    ? "Le rappel provisoire a été téléchargé."
                                    : `Date souhaitée : ${formatBookingDate(submittedDate)} · ${calendarSlotLabels[submittedSlot]}${submittedTime ? ` à ${submittedTime}` : ""}${submittedRequestType === "phone_call" ? " · appel de 20 minutes" : submittedRequestType === "individual_course" ? ` · ${submittedDuration === 90 ? "1 h 30 — 70 €" : "1 h — 50 €"}` : ""}.`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {bookingError && <p role="alert" className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{bookingError}</p>}
                  </div>
                )}

                <Button type="submit" disabled={bookingMutation.isPending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {bookingMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />Envoi en cours…</> : <><CalendarCheck className="mr-2 h-4 w-4" aria-hidden="true" />Envoyer ma demande</>}
                </Button>
              </form>
            </Card>

            <Card className="p-6 sm:p-8 bg-card border-border">
              <h3 className="text-2xl font-semibold text-accent mb-4">Une réponse rapide ?</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Si vous préférez échanger directement, appelez David. Il pourra répondre à vos questions et vous orienter vers le créneau le plus adapté.
              </p>
              <a
                href="tel:+33651592108"
                aria-label="Appeler David au 06 51 59 21 08"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Appeler le 06 51 59 21 08
              </a>
              <a
                href="mailto:contact@sdyoga-postural.fr"
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-accent px-5 py-3 font-semibold text-accent transition-colors hover:bg-accent/10"
              >
                Écrire un email
              </a>
              <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Espace Maitai</p>
                <p>22 bis René Dumont</p>
                <p>13410 Lambesc</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent to-accent/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-accent-foreground">
            Prêt à commencer votre pratique ?
          </h2>
          <p className="text-lg text-accent-foreground/90 mb-8 max-w-2xl mx-auto">
            Rejoignez-nous pour un premier cours et découvrez un yoga adapté à votre rythme.
          </p>
          <a href="#booking" className="inline-flex items-center justify-center rounded-md bg-accent-foreground px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent-foreground/90">
            Réserver votre premier cours
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <img src="/manus-storage/bfb4ca62-735e-4daf-b48f-389ea7baf3c3-1_all_8878_088e145c.png" alt="Sdyoga Logo" className="h-10 w-10" />
                <h3 className="text-xl font-bold text-accent">Sdyoga</h3>
              </div>
              <p className="text-muted-foreground">
                Un yoga structuré, bienveillant et adapté à votre rythme.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Navigation</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#home" className="hover:text-accent transition-colors">Accueil</a></li>
                <li><a href="#about" className="hover:text-accent transition-colors">À propos</a></li>
                <li><a href="#philosophy" className="hover:text-accent transition-colors">Philosophie</a></li>
                <li><a href="#testimonials" className="hover:text-accent transition-colors">Témoignages</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> <a href="mailto:contact@sdyoga-postural.fr" className="underline decoration-accent/40 underline-offset-4 hover:text-accent">contact@sdyoga-postural.fr</a></p>
                <p><strong>Téléphone:</strong> <a href="tel:+33651592108" className="underline decoration-accent/40 underline-offset-4 hover:text-accent">06.51.59.21.08</a></p>
                <p><strong>Adresse:</strong></p>
                <p>Espace Maitai</p>
                <p>22 bis René Dumont</p>
                <p>13410 Lambesc</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
              <p>&copy; 2026 Sdyoga. Tous droits réservés.</p>
              <span className="hidden text-border sm:inline" aria-hidden="true">·</span>
              <a href="/confidentialite" className="underline decoration-accent/40 underline-offset-4 hover:text-accent">Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, Ban, CalendarDays, Check, Clock3, Download, ExternalLink, Mail, Pencil, Phone, RefreshCw, Reply, Save, Search, Trash2, UserRound, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";

const statusLabels = {
  pending: "À traiter",
  confirmed: "Confirmée",
  declined: "Refusée",
} as const;

const requestTypeLabels = {
  first_course: "Premier cours d'essai",
  individual_course: "Cours individuel",
  phone_call: "Appel téléphonique — 20 min",
  question: "Question générale",
} as const;

const statusStyles = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  declined: "border-slate-200 bg-slate-100 text-slate-700",
} as const;

const slotLabels = {
  wednesday: "Mercredi, 19h00–20h00",
  friday: "Vendredi, 19h00–20h00",
  either: "Mercredi ou vendredi, 19h00–20h00",
  tuesday: "Mardi",
  thursday: "Jeudi",
  saturday: "Samedi",
} as const;

type ManualBookingFormState = {
  name: string;
  email: string;
  phone: string;
  requestType: "first_course" | "individual_course" | "phone_call";
  preferredSlot: "wednesday" | "friday" | "tuesday" | "thursday" | "saturday";
  preferredDate: string;
  preferredTime: string;
  durationMinutes: 60 | 90;
  status: "pending" | "confirmed" | "declined";
  message: string;
};

const initialManualBookingForm: ManualBookingFormState = {
  name: "",
  email: "",
  phone: "",
  requestType: "first_course",
  preferredSlot: "wednesday",
  preferredDate: "",
  preferredTime: "",
  durationMinutes: 60,
  status: "pending",
  message: "",
};

function formatDate(date: Date | string | null) {
  if (!date) return "Date non précisée";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeZone: "Europe/Paris",
  }).format(new Date(date));
}

function bookingDateKey(value: Date | string | null) {
  if (!value) return "";
  const parsed = value instanceof Date ? value : new Date(`${String(value).slice(0, 10)}T12:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

function todayDateKey() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

const attendanceLabels = {
  pending: "Présence à traiter",
  present: "Présent — à déduire du carnet si concerné",
  absent_excused: "Absent excusé — rien à déduire",
  absent_unexcused: "Absent non prévenu — à vérifier",
} as const;

function normalizeSearchValue(value: string | null | undefined) {
  return (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

type BookingForReply = {
  name: string;
  email: string | null;
  phone: string;
  requestType: "first_course" | "individual_course" | "phone_call" | "question";
  preferredDate: Date | string | null;
  preferredSlot: keyof typeof slotLabels;
  preferredTime?: string | null;
  durationMinutes?: number;
};

function formatBookingSlot(booking: { requestType: BookingForReply["requestType"]; preferredSlot: keyof typeof slotLabels; preferredTime?: string | null; durationMinutes?: number }) {
  if (booking.requestType === "phone_call") return `${slotLabels[booking.preferredSlot]}${booking.preferredTime ? ` à ${booking.preferredTime}` : ""} · 20 minutes`;
  if (booking.requestType !== "individual_course") return slotLabels[booking.preferredSlot];
  const duration = booking.durationMinutes === 90 ? "1 h 30 — 70 €" : "1 h — 50 €";
  return `${slotLabels[booking.preferredSlot]}${booking.preferredTime ? ` à ${booking.preferredTime}` : ""} · ${duration}`;
}

function buildReminderSmsUrl(booking: BookingForReply) {
  const firstName = booking.name.trim().split(/\s+/)[0] || booking.name;
  const time = booking.preferredTime ?? "l’horaire convenu";
  const message = `Bonjour ${firstName},\n\nPetit rappel pour votre cours d’essai demain à ${time}.\nÇa se passe à l’Espace Maitai, à cette adresse : 22 bis Rue René Dumont, 13410 Lambesc.\n\nSi vous avez un tapis, pensez à l’apporter ; sinon, dites-le-moi et je vous en préparerai un avec plaisir.\nN’hésitez pas si vous avez d’autres questions.\nJe vous dis à demain.\n\nDavid`;
  return `sms:${booking.phone}?body=${encodeURIComponent(message)}`;
}

function buildConfirmationSmsUrl(booking: BookingForReply) {
  const firstName = booking.name.trim().split(/\s+/)[0] || booking.name;
  const time = booking.preferredTime ?? "19h00";
  const message = `Bonjour ${firstName}, votre cours d’essai chez Sdyoga est confirmé pour ${formatDate(booking.preferredDate)} à ${time}. Je vous accueillerai à l’Espace Maitai. À bientôt, David.`;
  return `sms:${booking.phone}?body=${encodeURIComponent(message)}`;
}

function buildReplyGmailUrl(booking: BookingForReply) {
  const isIndividual = booking.requestType === "individual_course";
  const isPhoneCall = booking.requestType === "phone_call";
  const subject = isPhoneCall ? "Sdyoga — votre demande d’appel téléphonique" : isIndividual ? "Sdyoga — votre demande de cours individuel" : "Sdyoga — votre demande de cours d'essai";
  const dateAndSlot = `${formatDate(booking.preferredDate)} · ${formatBookingSlot(booking)}`;
  const body = [
    `Bonjour ${booking.name},`,
    "",
    `Merci pour votre demande de ${isPhoneCall ? "appel téléphonique de 20 minutes" : isIndividual ? "cours individuel" : "cours d'essai"} pour le ${dateAndSlot}.`,
    "",
    "Je vais revenir vers vous rapidement pour vous confirmer personnellement la disponibilité de ce créneau. Votre demande n'est donc pas encore une réservation définitive.",
    "",
    "Bien cordialement,",
    "David Sarre",
    "Sdyoga · Yoga postural à Lambesc",
  ].join("\n");
  return `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(booking.email ?? "")}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

type BookingForExport = {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  requestType: "first_course" | "individual_course" | "phone_call" | "question";
  preferredSlot: keyof typeof slotLabels;
  preferredDate: Date | string | null;
  preferredTime: string | null;
  durationMinutes: number;
  message: string | null;
  status: keyof typeof statusLabels;
  createdAt: Date | string;
};

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function buildBookingsCsv(bookings: BookingForExport[]) {
  const headers = ["ID", "Nom", "E-mail", "Téléphone", "Type", "Date souhaitée", "Heure", "Durée / tarif", "Jour", "Statut", "Message", "Demande reçue le"];
  const rows = bookings.map((booking) => [
    booking.id,
    booking.name,
    booking.email,
    booking.phone,
    requestTypeLabels[booking.requestType],
    formatDate(booking.preferredDate),
    booking.preferredTime ?? "",
    booking.requestType === "individual_course" ? `${booking.durationMinutes === 90 ? "1 h 30" : "1 h"} — ${booking.durationMinutes === 90 ? "70 €" : "50 €"}` : booking.requestType === "phone_call" ? "20 minutes" : "",
    slotLabels[booking.preferredSlot],
    statusLabels[booking.status],
    booking.message,
    formatDate(booking.createdAt),
  ].map(csvCell).join(";"));
  return `\uFEFF${[headers.map(csvCell).join(";"), ...rows].join("\r\n")}`;
}

function downloadBookingsCsv(bookings: BookingForExport[]) {
  const blob = new Blob([buildBookingsCsv(bookings)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sdyoga-demandes-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function AdminBookingsContent() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "declined">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const bookingsQuery = trpc.admin.listBookings.useQuery(undefined, {
    enabled: isAdmin,
    retry: false,
  });
  const collectiveAvailabilityQuery = trpc.admin.collectiveAvailability.useQuery(undefined, { enabled: isAdmin, staleTime: 30_000 });
  const collectiveClassRostersQuery = trpc.admin.collectiveClassRosters.useQuery(undefined, { enabled: isAdmin, staleTime: 30_000 });
  const calendarStatusQuery = trpc.admin.googleCalendarStatus.useQuery(undefined, {
    enabled: isAdmin,
    retry: false,
  });
  const availabilityBlocksQuery = trpc.admin.listAvailabilityBlocks.useQuery(undefined, {
    enabled: isAdmin,
    retry: false,
  });
  const utils = trpc.useUtils();
  const updateStatus = trpc.admin.updateBookingStatus.useMutation({
    onSuccess: async () => {
      await utils.admin.listBookings.invalidate();
    },
  });
  const updateAttendanceStatus = trpc.admin.updateBookingAttendanceStatus.useMutation({
    onSuccess: async () => {
      await utils.admin.listBookings.invalidate();
    },
  });
  const recordAttendancePresent = trpc.admin.recordBookingAttendancePresent.useMutation({ onSuccess: async () => { await utils.admin.listBookings.invalidate(); } });
  const restoreAttendanceDeduction = trpc.admin.restoreBookingAttendanceDeduction.useMutation({ onSuccess: async () => { await utils.admin.listBookings.invalidate(); } });
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const deleteBooking = trpc.admin.deleteBooking.useMutation({
    onSuccess: async () => {
      setBookingToDelete(null);
      await utils.admin.listBookings.invalidate();
    },
  });
  const [manualForm, setManualForm] = useState<ManualBookingFormState>(initialManualBookingForm);
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [editingContact, setEditingContact] = useState({ name: "", email: "", phone: "" });
  const [editingNoteBookingId, setEditingNoteBookingId] = useState<number | null>(null);
  const [internalNoteDraft, setInternalNoteDraft] = useState("");
  const [blockForm, setBlockForm] = useState({ blockDate: "", bookingType: "phone_call" as "phone_call" | "individual_course", startTime: "18:30" as "09:30" | "10:30" | "11:30" | "12:30" | "13:30" | "14:30" | "15:30" | "16:30" | "17:30" | "18:00" | "18:30" | "19:00" | "19:30" | null, reason: "" });
  const updateBookingContact = trpc.admin.updateBookingContact.useMutation({
    onSuccess: async () => {
      setEditingBookingId(null);
      await utils.admin.listBookings.invalidate();
    },
  });
  const updateBookingInternalNote = trpc.admin.updateBookingInternalNote.useMutation({
    onSuccess: async () => {
      setEditingNoteBookingId(null);
      setInternalNoteDraft("");
      await utils.admin.listBookings.invalidate();
    },
  });
  const createManualBooking = trpc.admin.createManualBooking.useMutation({
    onSuccess: async () => {
      setManualForm(initialManualBookingForm);
      await utils.admin.listBookings.invalidate();
    },
  });
  const createAvailabilityBlock = trpc.admin.createAvailabilityBlock.useMutation({
    onSuccess: async () => {
      setBlockForm({ blockDate: "", bookingType: "phone_call", startTime: "18:30", reason: "" });
      await utils.admin.listAvailabilityBlocks.invalidate();
    },
  });
  const deleteAvailabilityBlock = trpc.admin.deleteAvailabilityBlock.useMutation({
    onSuccess: async () => {
      await utils.admin.listAvailabilityBlocks.invalidate();
    },
  });

  const bookings = useMemo(() => {
    const rows = bookingsQuery.data ?? [];
    const statusRows = filter === "all" ? rows : rows.filter((booking) => booking.status === filter);
    const term = normalizeSearchValue(searchQuery);
    if (!term) return statusRows;
    const compactTerm = term.replace(/\s/g, "");
    return statusRows.filter((booking) => {
      const name = normalizeSearchValue(booking.name);
      const email = normalizeSearchValue(booking.email);
      const phone = normalizeSearchValue(booking.phone).replace(/\s/g, "");
      return name.includes(term) || email.includes(term) || phone.includes(compactTerm);
    });
  }, [bookingsQuery.data, filter, searchQuery]);

  const counts = useMemo(() => {
    const rows = bookingsQuery.data ?? [];
    return {
      all: rows.length,
      pending: rows.filter((booking) => booking.status === "pending").length,
      confirmed: rows.filter((booking) => booking.status === "confirmed").length,
      declined: rows.filter((booking) => booking.status === "declined").length,
    };
  }, [bookingsQuery.data]);
  const attendanceToProcess = useMemo(() => {
    const today = todayDateKey();
    return (bookingsQuery.data ?? []).filter((booking) =>
      booking.status === "confirmed" &&
      (booking.requestType === "first_course" || booking.requestType === "individual_course") &&
      bookingDateKey(booking.preferredDate) < today &&
      booking.attendanceStatus === "pending"
    );
  }, [bookingsQuery.data]);
  const attendanceWithoutDeduction = useMemo(() => {
    const today = todayDateKey();
    return (bookingsQuery.data ?? []).filter((booking) =>
      booking.status === "confirmed" &&
      (booking.requestType === "first_course" || booking.requestType === "individual_course") &&
      bookingDateKey(booking.preferredDate) < today &&
      booking.attendanceStatus === "present" &&
      booking.attendanceCourseDeducted === 0
    );
  }, [bookingsQuery.data]);


  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Sdyoga · espace privé</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Demandes de cours</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Consultez les demandes reçues et confirmez manuellement les créneaux avec vos élèves.</p>
          </div>
          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            <Button variant="outline" onClick={() => bookingsQuery.refetch()} disabled={!isAdmin || bookingsQuery.isFetching} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${bookingsQuery.isFetching ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadBookingsCsv(bookingsQuery.data ?? [])}
              disabled={!isAdmin || bookingsQuery.isLoading || !(bookingsQuery.data?.length)}
              className="gap-2"
              title="Télécharger toutes les réservations, même si une vue filtrée est active"
              aria-label="Télécharger toutes les réservations au format CSV"
            >
              <Download className="h-4 w-4" />
              Exporter toutes les réservations (CSV)
            </Button>
          </div>
        </header>

        {isAdmin && (
          <Card className={calendarStatusQuery.data?.connected ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/70"}>
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-foreground">Google Agenda</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {calendarStatusQuery.isLoading
                    ? "Vérification de la connexion…"
                    : calendarStatusQuery.data?.connected
                      ? `Connecté à ${calendarStatusQuery.data.accountEmail}. Les événements sont créés après votre confirmation.`
                      : "Connectez le calendrier de shanti.sdyoga@gmail.com pour créer les événements après confirmation."}
                </p>
              </div>
              <Button asChild variant="outline" className="shrink-0 gap-2">
                <a href="/api/google-calendar/connect">
                  <CalendarDays className="h-4 w-4" />
                  {calendarStatusQuery.data?.connected ? "Reconnecter Google Agenda" : "Connecter Google Agenda"}
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {!isAdmin ? (
          <Card className="border-amber-200 bg-amber-50/70">
            <CardContent className="p-6 text-amber-900">
              <h2 className="font-semibold">Accès réservé à David</h2>
              <p className="mt-2 text-sm leading-relaxed">Cette page est privée. Connectez-vous avec le compte administrateur du projet pour consulter les demandes Sdyoga.</p>
            </CardContent>
          </Card>
        ) : bookingsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-xl bg-muted" />)}
          </div>
        ) : bookingsQuery.isError ? (
          <Card className="border-destructive/30">
            <CardContent className="p-6">
              <h2 className="font-semibold text-foreground">Impossible de charger les demandes</h2>
              <p className="mt-2 text-sm text-muted-foreground">Vérifiez votre connexion puis réessayez.</p>
              <Button className="mt-4" onClick={() => bookingsQuery.refetch()}>Réessayer</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className={attendanceToProcess.length > 0 ? "border-amber-300 bg-amber-50/80" : "border-accent/20 bg-accent/5"} role={attendanceToProcess.length > 0 ? "alert" : "status"} aria-live="polite">
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-xl text-foreground"><AlertTriangle className={`h-5 w-5 ${attendanceToProcess.length > 0 ? "text-amber-700" : "text-accent"}`} />Suivi des présences</CardTitle><p className="text-sm text-muted-foreground">Après chaque cours confirmé passé, vérifiez si l’élève était présent. Le bouton « Présent » débite automatiquement un cours si un carnet actif correspondant est trouvé.</p></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-amber-200 bg-background p-3"><p className="text-sm text-muted-foreground">À valider</p><p className="text-2xl font-semibold text-foreground">{attendanceToProcess.length}</p><p className="text-xs text-muted-foreground">cours passé{attendanceToProcess.length > 1 ? "s" : ""} en attente</p></div>
                  <div className="rounded-lg border border-orange-200 bg-background p-3"><p className="text-sm text-muted-foreground">Sans déduction</p><p className="text-2xl font-semibold text-foreground">{attendanceWithoutDeduction.length}</p><p className="text-xs text-muted-foreground">présence enregistrée sans carnet débité</p></div>
                </div>
                {attendanceToProcess.length === 0 ? <p className="text-sm text-muted-foreground">Aucun cours passé n’attend actuellement votre validation. Revenez après le cours du mercredi ou du vendredi, puis cliquez sur « Actualiser ».</p> : <div className="space-y-2">{attendanceToProcess.slice(0, 6).map((booking) => <div key={booking.id} className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-background p-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-foreground">{booking.name}</p><p className="text-sm text-muted-foreground">{formatDate(booking.preferredDate)} · {formatBookingSlot(booking)}</p></div><div className="flex flex-wrap gap-2"><Button type="button" size="sm" className="gap-1.5 bg-emerald-700 hover:bg-emerald-800" disabled={updateAttendanceStatus.isPending || recordAttendancePresent.isPending} onClick={() => recordAttendancePresent.mutate({ id: booking.id })}><Check className="h-4 w-4" />Présent — débiter</Button><Button type="button" size="sm" variant="outline" disabled={updateAttendanceStatus.isPending} onClick={() => updateAttendanceStatus.mutate({ id: booking.id, attendanceStatus: "absent_excused" })}>Absent excusé</Button><Button type="button" size="sm" variant="ghost" className="text-amber-800" disabled={updateAttendanceStatus.isPending} onClick={() => updateAttendanceStatus.mutate({ id: booking.id, attendanceStatus: "absent_unexcused" })}>Non prévenu</Button></div></div>)}{attendanceToProcess.length > 6 && <p className="pt-1 text-sm text-amber-900">+ {attendanceToProcess.length - 6} autre{attendanceToProcess.length - 6 > 1 ? "s" : ""} à traiter dans les demandes ci-dessous.</p>}</div>}
              </CardContent>
            </Card>
            <Card className="border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Phone className="h-5 w-5 text-accent" />Ajouter une demande reçue par téléphone</CardTitle>
                <p className="text-sm text-muted-foreground">Cette saisie reste privée dans l’administration et n’envoie aucun e-mail automatique à l’élève.</p>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => {
                  event.preventDefault();
                  createManualBooking.mutate({
                    ...manualForm,
                    email: manualForm.email.trim() || undefined,
                    preferredDate: manualForm.preferredDate || undefined,
                    preferredTime: manualForm.preferredTime || undefined,
                    message: manualForm.message || undefined,
                  });
                }}>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Nom de l’élève<input required minLength={2} value={manualForm.name} onChange={(event) => setManualForm((current) => ({ ...current, name: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" placeholder="Prénom Nom" /></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">E-mail <span className="font-normal text-muted-foreground">(facultatif)</span><input type="email" value={manualForm.email} onChange={(event) => setManualForm((current) => ({ ...current, email: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" placeholder="À compléter plus tard si besoin" /></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Téléphone<input required value={manualForm.phone} onChange={(event) => setManualForm((current) => ({ ...current, phone: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" placeholder="06 00 00 00 00" /></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Type de demande<select value={manualForm.requestType} onChange={(event) => setManualForm((current) => ({ ...current, requestType: event.target.value as ManualBookingFormState["requestType"], preferredSlot: event.target.value === "individual_course" || event.target.value === "phone_call" ? "saturday" : "wednesday", preferredTime: event.target.value === "individual_course" ? "09:30" : event.target.value === "phone_call" ? "18:30" : "" }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal"><option value="first_course">Premier cours d’essai</option><option value="individual_course">Cours individuel</option><option value="phone_call">Appel téléphonique — 20 min</option></select></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Date souhaitée<input required type="date" value={manualForm.preferredDate} onChange={(event) => setManualForm((current) => ({ ...current, preferredDate: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Jour<select value={manualForm.preferredSlot} onChange={(event) => setManualForm((current) => ({ ...current, preferredSlot: event.target.value as ManualBookingFormState["preferredSlot"] }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal">{manualForm.requestType === "individual_course" || manualForm.requestType === "phone_call" ? <><option value="saturday">Samedi</option><option value="tuesday">Mardi</option><option value="thursday">Jeudi</option></> : <><option value="wednesday">Mercredi</option><option value="friday">Vendredi</option></>}</select></label>
                  {manualForm.requestType === "individual_course" && <>
                    <label className="grid gap-1.5 text-sm font-medium text-foreground">Heure de début<input required type="time" value={manualForm.preferredTime} onChange={(event) => setManualForm((current) => ({ ...current, preferredTime: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /></label>
                    <label className="grid gap-1.5 text-sm font-medium text-foreground">Durée et tarif<select value={manualForm.durationMinutes} onChange={(event) => setManualForm((current) => ({ ...current, durationMinutes: Number(event.target.value) as 60 | 90 }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal"><option value={60}>1 h — 50 €</option><option value={90}>1 h 30 — 70 €</option></select></label>
                  </>}
                  {manualForm.requestType === "phone_call" && <label className="grid gap-1.5 text-sm font-medium text-foreground">Horaire de l’appel<select required value={manualForm.preferredTime} onChange={(event) => setManualForm((current) => ({ ...current, preferredTime: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal"><option value="18:30">18 h 30 — 20 minutes</option><option value="19:00">19 h 00 — 20 minutes</option><option value="19:30">19 h 30 — 20 minutes</option></select></label>}
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Statut<select value={manualForm.status} onChange={(event) => setManualForm((current) => ({ ...current, status: event.target.value as ManualBookingFormState["status"] }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal"><option value="pending">À traiter</option><option value="confirmed">Confirmée</option><option value="declined">Refusée</option></select></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground md:col-span-2">Note éventuelle<textarea value={manualForm.message} onChange={(event) => setManualForm((current) => ({ ...current, message: event.target.value }))} className="min-h-20 rounded-md border border-border bg-background px-3 py-2 font-normal" placeholder="Note prise lors de l’appel…" /></label>
                  <div className="flex items-center gap-3 md:col-span-2"><Button type="submit" disabled={createManualBooking.isPending} className="gap-2"><Phone className="h-4 w-4" />{createManualBooking.isPending ? "Enregistrement…" : "Ajouter la demande"}</Button>{createManualBooking.isError && <p className="text-sm text-destructive">Impossible d’enregistrer cette demande. Vérifiez la date et le créneau.</p>}</div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-slate-50/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Ban className="h-5 w-5 text-accent" />Gérer les indisponibilités</CardTitle>
                <p className="text-sm text-muted-foreground">Bloquez une date entière ou un créneau précis ; il disparaîtra immédiatement du calendrier public concerné.</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <form className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_1.4fr_auto] md:items-end" onSubmit={(event) => { event.preventDefault(); createAvailabilityBlock.mutate(blockForm); }}>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Date<input required type="date" value={blockForm.blockDate} onChange={(event) => setBlockForm((current) => ({ ...current, blockDate: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Réservation<select value={blockForm.bookingType} onChange={(event) => setBlockForm((current) => ({ ...current, bookingType: event.target.value as typeof current.bookingType, startTime: event.target.value === "individual_course" ? "17:30" : "18:30" }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal"><option value="phone_call">Appel téléphonique</option><option value="individual_course">Cours individuel</option></select></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Portée<select value={blockForm.startTime ?? "ALL"} onChange={(event) => setBlockForm((current) => ({ ...current, startTime: event.target.value === "ALL" ? null : event.target.value as typeof current.startTime }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal"><option value="ALL">Date entière</option>{blockForm.bookingType === "phone_call" ? <><option value="18:30">18 h 30 — 20 min</option><option value="19:00">19 h 00 — 20 min</option><option value="19:30">19 h 30 — 20 min</option></> : <><option value="17:30">17 h 30 — cours</option><option value="09:30">09 h 30 — samedi</option><option value="10:30">10 h 30 — samedi</option><option value="11:30">11 h 30 — samedi</option><option value="12:30">12 h 30 — samedi</option><option value="13:30">13 h 30 — samedi</option><option value="14:30">14 h 30 — samedi</option><option value="15:30">15 h 30 — samedi</option><option value="16:30">16 h 30 — samedi</option><option value="17:30">17 h 30 — samedi</option><option value="18:00">18 h 00 — samedi</option></>}</select></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Motif (facultatif)<input value={blockForm.reason} onChange={(event) => setBlockForm((current) => ({ ...current, reason: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" placeholder="Indisponibilité ponctuelle" /></label>
                  <Button type="submit" disabled={createAvailabilityBlock.isPending} className="gap-2"><Ban className="h-4 w-4" />{createAvailabilityBlock.isPending ? "Blocage…" : "Bloquer"}</Button>
                </form>
                {createAvailabilityBlock.isError && <p className="text-sm text-destructive">{createAvailabilityBlock.error.message || "Impossible de bloquer ce créneau."}</p>}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Créneaux actuellement bloqués</p>
                  {(availabilityBlocksQuery.data ?? []).length === 0 ? <p className="text-sm text-muted-foreground">Aucune indisponibilité n’est enregistrée.</p> : <div className="grid gap-2 sm:grid-cols-2">{(availabilityBlocksQuery.data ?? []).map((block) => <div key={block.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm"><span><strong className="font-medium text-foreground">{formatDate(block.blockDate)}</strong><br /><span className="text-muted-foreground">{block.bookingType === "individual_course" ? "Cours individuel" : "Appel téléphonique"} · {block.startTime ? `${block.startTime} · créneau` : "Date entière"}{block.reason ? ` · ${block.reason}` : ""}</span></span><Button type="button" size="sm" variant="ghost" className="gap-1.5 text-accent" disabled={deleteAvailabilityBlock.isPending} onClick={() => deleteAvailabilityBlock.mutate({ id: block.id })}>Débloquer</Button></div>)}</div>}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-accent/20 bg-accent/5 sm:col-span-1">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Total des demandes</p>
                  <p className="mt-2 text-3xl font-bold text-accent">{counts.all}</p>
                </CardContent>
              </Card>
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">À traiter</p>
                  <p className="mt-2 text-3xl font-bold text-amber-700">{counts.pending}</p>
                </CardContent>
              </Card>
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Confirmées</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-700">{counts.confirmed}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-accent/20 bg-accent/5">
              <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-xl"><Users className="h-5 w-5 text-accent" />Places restantes — cours collectifs</CardTitle><p className="text-sm text-muted-foreground">Compteur basé sur les demandes confirmées, sur une capacité de 10 élèves par cours.</p></CardHeader>
              <CardContent>
                {collectiveAvailabilityQuery.isLoading ? <p className="text-sm text-muted-foreground">Calcul des places…</p> : collectiveAvailabilityQuery.isError ? <p className="text-sm text-destructive">Impossible de calculer les places pour le moment.</p> : <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{(collectiveAvailabilityQuery.data ?? []).slice(0, 8).map((slot) => <div key={`${slot.date}-${slot.slot}`} className={`rounded-lg border px-3 py-2 ${slot.isFull ? "border-red-200 bg-red-50" : slot.remainingPlaces <= 2 ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}><p className="text-xs font-medium text-foreground">{formatDate(`${slot.date}T12:00:00Z`)}</p><p className={`mt-1 text-sm font-semibold ${slot.isFull ? "text-red-700" : slot.remainingPlaces <= 2 ? "text-amber-700" : "text-emerald-700"}`}>{slot.isFull ? "Complet" : `${slot.remainingPlaces} place${slot.remainingPlaces > 1 ? "s" : ""} restante${slot.remainingPlaces > 1 ? "s" : ""}`}</p><p className="text-xs text-muted-foreground">{slot.slot === "wednesday" ? "19h00–20h00 · mercredi" : "19h00–20h00 · vendredi"}</p></div>)}</div>}
                <div className="mt-5 space-y-3" aria-label="Élèves confirmés par cours collectif">
                  <p className="text-sm font-semibold text-foreground">Élèves confirmés par cours</p>
                  {collectiveClassRostersQuery.isLoading ? <p className="text-sm text-muted-foreground">Chargement des listes…</p> : collectiveClassRostersQuery.isError ? <p className="text-sm text-destructive">Impossible de charger les élèves confirmés.</p> : <div className="grid gap-3 md:grid-cols-2">{(collectiveClassRostersQuery.data ?? []).slice(0, 8).map((slot) => <div key={`${slot.date}-${slot.slot}`} className="rounded-lg border border-border bg-background p-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-foreground">{formatDate(`${slot.date}T12:00:00Z`)}</p><p className="text-xs text-muted-foreground">{slot.slot === "wednesday" ? "Mercredi · 19h00–20h00" : "Vendredi · 19h00–20h00"}</p></div><span className="text-right text-xs font-medium text-accent">{slot.confirmedCount}/10 confirmé{slot.confirmedCount > 1 ? "s" : ""}</span></div>{slot.students.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Aucun élève confirmé pour le moment.</p> : <ul className="mt-3 space-y-2">{slot.students.map((student) => <li key={student.id} className="rounded-md bg-muted/40 px-3 py-2"><p className="text-sm font-medium text-foreground">{student.name}</p><p className="text-xs text-muted-foreground">{student.phone}{student.email ? ` · ${student.email}` : ""}</p></li>)}</ul>}</div>)}</div>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-4">
                <label className="grid gap-2 text-sm font-medium text-foreground" htmlFor="admin-student-search">
                  <span className="flex items-center gap-2"><Search className="h-4 w-4 text-accent" />Recherche rapide des élèves</span>
                  <input id="admin-student-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-10 rounded-md border border-border bg-background px-3 font-normal" placeholder="Nom, téléphone ou e-mail" />
                </label>
                {searchQuery.trim() && <p className="mt-2 text-xs text-muted-foreground">{bookings.length} demande{bookings.length > 1 ? "s" : ""} correspondante{bookings.length > 1 ? "s" : ""}.</p>}
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2" aria-label="Filtrer les demandes">
              {(Object.keys(statusLabels) as Array<keyof typeof statusLabels>).map((status) => (
                <Button key={status} variant={filter === status ? "default" : "outline"} size="sm" onClick={() => setFilter(status)} aria-pressed={filter === status}>
                  {statusLabels[status]} ({counts[status]})
                </Button>
              ))}
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")} aria-pressed={filter === "all"}>Toutes ({counts.all})</Button>
            </div>

            {bookings.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center">
                  <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground/60" />
                  <h2 className="mt-4 font-semibold text-foreground">{searchQuery.trim() ? "Aucun élève trouvé" : "Aucune demande dans cette catégorie"}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{searchQuery.trim() ? "Essayez un autre nom, téléphone ou e-mail." : "Les nouvelles demandes apparaîtront ici automatiquement."}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden border-border shadow-sm">
                    <CardHeader className="flex flex-col gap-4 bg-muted/20 pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-xl leading-tight">{booking.name}</CardTitle>
                          <Badge variant="outline" className="border-accent/30 text-accent">{requestTypeLabels[booking.requestType]}</Badge>
                          <Badge className={statusStyles[booking.status]}>{statusLabels[booking.status]}</Badge>{booking.attendanceStatus !== "pending" && <Badge variant="outline" className="border-slate-300 text-slate-600">{attendanceLabels[booking.attendanceStatus]}</Badge>}{booking.attendanceCourseDeducted === 1 && <Badge variant="outline" className="border-emerald-300 text-emerald-700">1 cours déduit</Badge>}
                        </div>
                        <div className="mt-3 rounded-lg border border-accent/20 bg-background px-3 py-2.5 shadow-sm">
                          <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><CalendarDays className="h-4 w-4 shrink-0 text-accent" />{formatDate(booking.preferredDate)}</p>
                          <p className="mt-1 pl-6 text-sm font-medium text-accent">{formatBookingSlot(booking)}</p>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">Demande reçue le {formatDate(booking.createdAt)}</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground sm:pt-1">Demande #{booking.id}</span>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
                      <details open={editingNoteBookingId === booking.id ? true : undefined} className="group rounded-lg border border-border bg-background">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                          <span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-accent" />Coordonnées et détails</span>
                          <span className="text-xs font-normal text-muted-foreground group-open:hidden">Afficher</span>
                          <span className="hidden text-xs font-normal text-muted-foreground group-open:inline">Réduire</span>
                        </summary>
                        <div className="grid gap-3 border-t border-border px-3 py-3 text-sm text-muted-foreground sm:grid-cols-2">
                        {editingBookingId === booking.id ? (
                          <form className="grid gap-3 rounded-lg border border-accent/20 bg-accent/5 p-3 sm:col-span-2" onSubmit={(event) => { event.preventDefault(); updateBookingContact.mutate({ id: booking.id, name: editingContact.name, email: editingContact.email || undefined, phone: editingContact.phone }); }}>
                            <p className="text-sm font-semibold text-foreground">Modifier les coordonnées</p>
                            <div className="grid gap-3 sm:grid-cols-3">
                              <input aria-label="Nom de l’élève à modifier" required minLength={2} value={editingContact.name} onChange={(event) => setEditingContact((current) => ({ ...current, name: event.target.value }))} className="h-9 rounded-md border border-border bg-background px-3 text-sm" />
                              <input aria-label="E-mail à modifier" type="email" value={editingContact.email} onChange={(event) => setEditingContact((current) => ({ ...current, email: event.target.value }))} className="h-9 rounded-md border border-border bg-background px-3 text-sm" placeholder="E-mail facultatif" />
                              <input aria-label="Téléphone à modifier" required value={editingContact.phone} onChange={(event) => setEditingContact((current) => ({ ...current, phone: event.target.value }))} className="h-9 rounded-md border border-border bg-background px-3 text-sm" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button type="submit" size="sm" className="gap-1.5" disabled={updateBookingContact.isPending}><Save className="h-4 w-4" />{updateBookingContact.isPending ? "Enregistrement…" : "Enregistrer"}</Button>
                              <Button type="button" size="sm" variant="ghost" onClick={() => setEditingBookingId(null)} disabled={updateBookingContact.isPending}>Annuler</Button>
                            </div>
                          </form>
                        ) : (
                          <>
                            {booking.email ? <a className="flex items-center gap-2 hover:text-accent" href={`mailto:${booking.email}`}><Mail className="h-4 w-4 text-accent" />{booking.email}</a> : <p className="flex items-center gap-2 text-amber-700"><Mail className="h-4 w-4" />E-mail non renseigné</p>}
                            <a className="flex items-center gap-2 hover:text-accent" href={`tel:${booking.phone}`}><Phone className="h-4 w-4 text-accent" />{booking.phone}</a>
                          </>
                        )}
                        <p className="flex items-start gap-2 sm:col-span-2"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span><strong className="font-medium text-foreground">{formatDate(booking.preferredDate)}</strong><br />{formatBookingSlot(booking)}</span></p>
                        {booking.status === "confirmed" && <p className={`flex items-start gap-2 sm:col-span-2 ${booking.googleCalendarSyncError ? "text-amber-700" : "text-emerald-700"}`}><CalendarDays className="mt-0.5 h-4 w-4 shrink-0" /><span>{booking.googleCalendarSyncError ? `Google Agenda : ${booking.googleCalendarSyncError}` : booking.googleEventId ? "Événement ajouté dans Google Agenda" : "Événement Google Agenda en attente de synchronisation"}</span></p>}
                        {booking.message && <p className="flex items-start gap-2 sm:col-span-2"><UserRound className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span><strong className="font-medium text-foreground">Message :</strong> {booking.message}</span></p>}
                        {editingNoteBookingId === booking.id ? (
                          <form className="grid gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-3 sm:col-span-2" onSubmit={(event) => { event.preventDefault(); updateBookingInternalNote.mutate({ id: booking.id, internalNote: internalNoteDraft || undefined }); }}>
                            <p className="text-sm font-semibold text-amber-900">Note interne privée</p>
                            <textarea aria-label={`Note interne pour ${booking.name}`} value={internalNoteDraft} onChange={(event) => setInternalNoteDraft(event.target.value)} maxLength={2000} rows={3} className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm text-foreground" placeholder="Commentaire privé concernant cet élève…" />
                            <div className="flex flex-wrap gap-2">
                              <Button type="submit" size="sm" className="gap-1.5" disabled={updateBookingInternalNote.isPending}><Save className="h-4 w-4" />{updateBookingInternalNote.isPending ? "Enregistrement…" : "Enregistrer la note"}</Button>
                              <Button type="button" size="sm" variant="ghost" onClick={() => { setEditingNoteBookingId(null); setInternalNoteDraft(""); }} disabled={updateBookingInternalNote.isPending}>Annuler</Button>
                            </div>
                          </form>
                        ) : (
                          <p className="flex items-start gap-2 sm:col-span-2 text-amber-800"><Pencil className="mt-0.5 h-4 w-4 shrink-0" /><span><strong className="font-medium">Note interne :</strong> {booking.internalNote || "Aucune note interne."}</span></p>
                        )}
                        </div>
                      </details>
                      <div className="flex flex-col gap-3 rounded-lg border border-accent/20 bg-accent/5 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Actions de gestion</p>
                        <div className="flex flex-wrap items-center gap-2">
                        <Button size="sm" variant="outline" className="order-10 gap-1.5 border-accent/30 text-accent hover:bg-accent/10" onClick={() => { setEditingBookingId(booking.id); setEditingContact({ name: booking.name, email: booking.email ?? "", phone: booking.phone }); }}>
                          <Pencil className="h-4 w-4" />Modifier les coordonnées
                        </Button>
                        <Button size="sm" variant="outline" className="order-10 gap-1.5 border-amber-200 text-amber-800 hover:bg-amber-50" onClick={() => { setEditingNoteBookingId(booking.id); setInternalNoteDraft(booking.internalNote ?? ""); }}>
                          <Pencil className="h-4 w-4" />{booking.internalNote ? "Modifier la note interne" : "Ajouter une note interne"}
                        </Button>
                        {booking.requestType === "first_course" && booking.status === "confirmed" && <Button asChild size="sm" variant="outline" className="order-10 gap-1.5 border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                          <a href={buildConfirmationSmsUrl(booking)} aria-label={`Préparer le SMS de confirmation pour ${booking.name}`}>
                            <Check className="h-4 w-4" />Préparer le SMS de confirmation
                          </a>
                        </Button>}
                        {booking.requestType === "first_course" && <Button asChild size="sm" variant="outline" className="order-10 gap-1.5 border-blue-200 text-blue-800 hover:bg-blue-50">
                          <a href={buildReminderSmsUrl(booking)} aria-label={`Préparer le SMS de rappel pour ${booking.name}`}>
                            <Phone className="h-4 w-4" />Préparer le SMS de rappel
                          </a>
                        </Button>}
                        {booking.email && <Button asChild size="sm" variant="outline" className="order-10 gap-1.5 border-accent/30 text-accent hover:bg-accent/10">
                          <a href={buildReplyGmailUrl(booking)} target="_blank" rel="noopener noreferrer" aria-label={`Répondre par e-mail à ${booking.name}`}>
                            <Reply className="h-4 w-4" />Répondre par e-mail
                          </a>
                        </Button>}
                        {booking.attendanceStatus === "present" && booking.attendanceCourseDeducted === 1 && <Button size="sm" variant="outline" className="order-9 gap-1.5 border-amber-200 text-amber-800 hover:bg-amber-50" disabled={restoreAttendanceDeduction.isPending} onClick={() => restoreAttendanceDeduction.mutate({ id: booking.id })}>Restaurer le cours déduit</Button>}
                        <Button size="sm" variant="outline" className="order-1 gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" disabled={updateStatus.isPending || booking.status === "confirmed"} onClick={() => updateStatus.mutate({ id: booking.id, status: "confirmed" })}><Check className="h-4 w-4" />Confirmer</Button>
                        <Button size="sm" variant="outline" className="order-2 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50" disabled={updateStatus.isPending || booking.status === "declined"} onClick={() => updateStatus.mutate({ id: booking.id, status: "declined" })}><X className="h-4 w-4" />Refuser</Button>
                        <Button size="sm" variant="ghost" className="order-3 gap-1.5" disabled={updateStatus.isPending || booking.status === "pending"} onClick={() => updateStatus.mutate({ id: booking.id, status: "pending" })}><Clock3 className="h-4 w-4" />À traiter</Button>
                        <div className="order-10"><AlertDialog open={bookingToDelete === booking.id} onOpenChange={(open) => { if (!open && !deleteBooking.isPending) setBookingToDelete(null); }}>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={deleteBooking.isPending} onClick={() => setBookingToDelete(booking.id)}>
                              <Trash2 className="h-4 w-4" />Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cette demande ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                La demande de {booking.name} sera définitivement supprimée de l’administration. Cette action ne peut pas être annulée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={deleteBooking.isPending}>Annuler</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteBooking.isPending} onClick={() => deleteBooking.mutate({ id: booking.id })}>
                                {deleteBooking.isPending ? "Suppression…" : "Supprimer définitivement"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"><ExternalLink className="h-4 w-4" />Retourner au site public</Link>
      </div>
    </div>
  );
}

export default function AdminBookings() {
  return <DashboardLayout><AdminBookingsContent /></DashboardLayout>;
}

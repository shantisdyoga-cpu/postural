import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Check, Mail, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";

type MailingRecipient = { id: string; label: string; email: string; source: string };
type StudentPlan = { id: number; studentName: string; email: string | null; expiresDate: Date | string | null };
type WorkshopWaitlistEntry = { id: number; email: string; createdAt: Date | string };

function dateValue(value: Date | string | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(`${String(value).slice(0, 10)}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}
function todayAsIsoDate() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function CommunicationContent() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const plansQuery = trpc.admin.listStudentPlans.useQuery(undefined, { enabled: isAdmin, retry: false });
  const workshopWaitlistQuery = trpc.admin.listWorkshopWaitlist.useQuery(undefined, { enabled: isAdmin, retry: false });
  const [selectedMailRecipientIds, setSelectedMailRecipientIds] = useState<string[]>([]);
  const [mailSubject, setMailSubject] = useState("Informations Sdyoga");
  const [mailMessage, setMailMessage] = useState("");
  const [mailError, setMailError] = useState("");
  const [mailCopyNotice, setMailCopyNotice] = useState("");
  useEffect(() => {
    if (!mailCopyNotice) return;
    const timeout = window.setTimeout(() => setMailCopyNotice(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [mailCopyNotice]);

  const plans = (plansQuery.data ?? []) as StudentPlan[];
  const workshopWaitlist = (workshopWaitlistQuery.data ?? []) as WorkshopWaitlistEntry[];
  const mailingRecipients = useMemo<MailingRecipient[]>(() => {
    const candidates = [
      ...plans.filter((plan) => plan.email).map((plan) => ({ id: `plan-${plan.id}`, label: plan.studentName, email: plan.email!, source: "Élèves et formules" })),
      ...workshopWaitlist.map((entry) => ({ id: `waitlist-${entry.id}`, label: entry.email, email: entry.email, source: "Liste d’attente ateliers" })),
    ];
    const seen = new Set<string>();
    return candidates.filter((recipient) => {
      const normalized = recipient.email.trim().toLowerCase();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
  }, [plans, workshopWaitlist]);
  const selectedMailRecipients = mailingRecipients.filter((recipient) => selectedMailRecipientIds.includes(recipient.id));
  const activeMailRecipientIds = useMemo(() => plans.filter((plan) => plan.email && (!plan.expiresDate || dateValue(plan.expiresDate) >= todayAsIsoDate())).map((plan) => `plan-${plan.id}`).filter((id) => mailingRecipients.some((recipient) => recipient.id === id)), [plans, mailingRecipients]);
  const waitlistMailRecipientIds = useMemo(() => mailingRecipients.filter((recipient) => recipient.id.startsWith("waitlist-")).map((recipient) => recipient.id), [mailingRecipients]);

  const openGmailDraft = () => {
    const subject = mailSubject.trim();
    const message = mailMessage.trim();
    if (!selectedMailRecipients.length) return setMailError("Sélectionnez au moins un destinataire.");
    if (!subject || !message) return setMailError("Renseignez un objet et un message avant d’ouvrir Gmail.");
    setMailError("");
    const bcc = selectedMailRecipients.map((recipient) => recipient.email).join(",");
    const mailtoUrl = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&bcc=${encodeURIComponent(bcc)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) window.location.href = mailtoUrl;
    else window.open(gmailUrl, "_blank", "noopener,noreferrer");
  };
  const copyMailDetails = async () => {
    const subject = mailSubject.trim();
    const message = mailMessage.trim();
    if (!selectedMailRecipients.length) return setMailError("Sélectionnez au moins un destinataire.");
    if (!subject || !message) return setMailError("Renseignez un objet et un message avant de copier.");
    const details = `CCI : ${selectedMailRecipients.map((recipient) => recipient.email).join(", ")}\nObjet : ${subject}\n\n${message}`;
    try {
      await navigator.clipboard.writeText(details);
      setMailError("");
      setMailCopyNotice("Destinataires, objet et message copiés. Vous pouvez les coller dans Gmail.");
    } catch {
      setMailCopyNotice("La copie automatique n’est pas disponible sur cet appareil.");
    }
  };

  return <div className="min-h-screen bg-background"><div className="mx-auto max-w-6xl space-y-8">
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Sdyoga · espace privé</p><h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Communication</h1><p className="mt-2 max-w-2xl text-muted-foreground">Préparez vos messages et sélectionnez rapidement les groupes à contacter. Aucun e-mail n’est envoyé automatiquement.</p></div><Button variant="outline" onClick={() => { void plansQuery.refetch(); void workshopWaitlistQuery.refetch(); }} disabled={!isAdmin || plansQuery.isFetching || workshopWaitlistQuery.isFetching} className="gap-2 self-start"><RefreshCw className={`h-4 w-4 ${plansQuery.isFetching || workshopWaitlistQuery.isFetching ? "animate-spin" : ""}`} />Actualiser</Button></header>
    {!isAdmin ? <Card className="border-amber-200 bg-amber-50/70"><CardContent className="p-6 text-amber-950">Cet espace est réservé à l’administration.</CardContent></Card> : <Card className="border-accent/20 bg-card"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-xl"><Mail className="h-5 w-5 text-accent" />E-mail groupé</CardTitle></CardHeader><CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground">Choisissez un groupe ou sélectionnez les destinataires individuellement. Les adresses seront placées en copie cachée (CCI) dans Gmail.</p>
      <div className="flex flex-wrap items-center gap-2"><Button type="button" size="sm" variant="outline" onClick={() => setSelectedMailRecipientIds(activeMailRecipientIds)} disabled={!activeMailRecipientIds.length}>Élèves actifs</Button><Button type="button" size="sm" variant="outline" onClick={() => setSelectedMailRecipientIds(waitlistMailRecipientIds)} disabled={!waitlistMailRecipientIds.length}>Liste d’attente</Button><Button type="button" size="sm" variant="outline" onClick={() => setSelectedMailRecipientIds(mailingRecipients.map((recipient) => recipient.id))} disabled={!mailingRecipients.length}>Tout sélectionner</Button><Button type="button" size="sm" variant="ghost" onClick={() => setSelectedMailRecipientIds([])} disabled={!selectedMailRecipientIds.length}>Tout désélectionner</Button><span className="text-sm text-muted-foreground">{selectedMailRecipients.length} destinataire{selectedMailRecipients.length > 1 ? "s" : ""} sélectionné{selectedMailRecipients.length > 1 ? "s" : ""}</span></div>
      {mailingRecipients.length === 0 ? <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">Aucune adresse e-mail disponible pour le moment.</p> : <div className="grid max-h-60 gap-2 overflow-y-auto rounded-lg border border-border bg-background p-3 sm:grid-cols-2">{mailingRecipients.map((recipient) => <label key={recipient.id} className="flex cursor-pointer items-start gap-3 rounded-md p-2 text-sm hover:bg-muted/50"><input type="checkbox" checked={selectedMailRecipientIds.includes(recipient.id)} onChange={(event) => setSelectedMailRecipientIds((current) => event.target.checked ? [...current, recipient.id] : current.filter((id) => id !== recipient.id))} className="mt-1 h-4 w-4 accent-accent" /><span className="min-w-0"><strong className="block truncate text-foreground">{recipient.label}</strong><span className="block truncate text-muted-foreground">{recipient.email}</span><span className="text-xs text-muted-foreground">{recipient.source}</span></span></label>)}</div>}
      <div className="grid gap-3"><label className="grid gap-1.5 text-sm font-medium">Objet<input value={mailSubject} onChange={(event) => setMailSubject(event.target.value)} className="h-10 rounded-md border border-border bg-background px-3 font-normal" placeholder="Objet du message" /></label><label className="grid gap-1.5 text-sm font-medium">Message<textarea value={mailMessage} onChange={(event) => setMailMessage(event.target.value)} rows={7} className="rounded-md border border-border bg-background px-3 py-2 font-normal" placeholder="Rédigez votre message…" /></label></div>
      {mailMessage.trim() && <div className="rounded-lg border border-accent/20 bg-accent/5 p-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">Aperçu</p><p className="font-semibold text-foreground">{mailSubject || "Sans objet"}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{mailMessage}</p></div>}
      {mailError && <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">{mailError}</p>}{mailCopyNotice && <div role="status" aria-live="polite" className="mail-copy-toast fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 shadow-lg sm:left-auto sm:right-5 sm:w-auto sm:translate-x-0"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"><Check className="h-4 w-4" aria-hidden="true" /></span><span>{mailCopyNotice}</span></div>}
      <div className="flex flex-wrap gap-2"><Button type="button" onClick={openGmailDraft} disabled={!mailingRecipients.length} className="gap-2"><Mail className="h-4 w-4" />Ouvrir Gmail</Button><Button type="button" variant="outline" onClick={copyMailDetails} disabled={!mailingRecipients.length}>Copier pour Gmail</Button></div>
    </CardContent></Card>}
  </div></div>;
}

export default function Communication() { return <DashboardLayout><CommunicationContent /></DashboardLayout>; }

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getPaymentStatus } from "@/lib/paymentStatus";
import { Check, Copy, Edit3, History, Link2, Plus, RefreshCw, Trash2, UserRound, WalletCards, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Fragment, FormEvent, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";

type PlanType = "single" | "five" | "ten" | "annual" | "annual_solo" | "annual_duo" | "monthly_solo" | "monthly_duo" | "ten_solo" | "ten_duo" | "twenty_duo";
type PaymentStatus = "pending" | "paid";
type PaymentPlan = "one" | "two" | "three";
type PaymentMethod = "cash" | "bank_transfer" | "card" | "cheque" | "direct_debit" | "other";
type PlanForm = {
  studentName: string;
  secondaryStudentName: string;
  payerName: string;
  email: string;
  phone: string;
  planType: PlanType;
  amount: string;
  paymentStatus: PaymentStatus;
  paymentPlan: PaymentPlan;
  paymentMethod: PaymentMethod;
  paidDate: string;
  expiresDate: string;
  totalCourses: string;
  usedCourses: string;
  internalNote: string;
};
type StudentPlanPayment = { id: number; studentPlanId: number; amountCents: number; paymentDate: Date | string; paymentMethod: PaymentMethod; note: string | null };
type StudentPlanCourseAdjustment = { id: number; studentPlanId: number; action: "reduce" | "restore"; previousUsedCourses: number; nextUsedCourses: number; createdAt: Date | string };
type WorkshopWaitlistEntry = { id: number; email: string; createdAt: Date | string };
type MailingRecipient = { id: string; label: string; email: string; source: string };
type StudentPlan = {
  id: number;
  studentName: string;
  secondaryStudentName: string | null;
  payerName: string | null;
  email: string | null;
  phone: string | null;
  planType: PlanType;
  amountCents: number;
  paymentStatus: PaymentStatus;
  paymentPlan: PaymentPlan;
  paymentMethod: PaymentMethod;
  paidDate: Date | string | null;
  expiresDate: Date | string | null;
  totalCourses: number;
  usedCourses: number;
  internalNote: string | null;
};

const planLabels: Record<PlanType, string> = {
  single: "Cours à l’unité",
  five: "Carte 5 cours — 2 mois",
  ten: "Carnet 10 cours Solo — 6 mois",
  annual: "Ancien abonnement annuel",
  annual_solo: "Annuel Solo — 280 €",
  annual_duo: "Annuel Duo / Couple — 490 €",
  monthly_solo: "Mensuel Solo — 40 € / mois",
  monthly_duo: "Mensuel Duo / Couple — 70 € / mois",
  ten_solo: "Carnet 10 cours Solo — 6 mois",
  ten_duo: "Carnet 10 cours Duo — 3 mois",
  twenty_duo: "Carnet 20 cours Duo — 6 mois",
};
function dateAfterMonths(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
const planDefaults: Record<PlanType, { amount: number; totalCourses: number; expiresDate: string }> = {
  single: { amount: 1500, totalCourses: 1, expiresDate: "" },
  five: { amount: 7000, totalCourses: 5, expiresDate: dateAfterMonths(2) },
  ten: { amount: 12000, totalCourses: 10, expiresDate: dateAfterMonths(6) },
  annual: { amount: 28000, totalCourses: 0, expiresDate: "2027-06-30" },
  annual_solo: { amount: 28000, totalCourses: 0, expiresDate: "2027-06-30" },
  annual_duo: { amount: 49000, totalCourses: 0, expiresDate: "2027-06-30" },
  monthly_solo: { amount: 4000, totalCourses: 0, expiresDate: "" },
  monthly_duo: { amount: 7000, totalCourses: 0, expiresDate: "" },
  ten_solo: { amount: 12000, totalCourses: 10, expiresDate: dateAfterMonths(6) },
  ten_duo: { amount: 12000, totalCourses: 10, expiresDate: dateAfterMonths(3) },
  twenty_duo: { amount: 21000, totalCourses: 20, expiresDate: dateAfterMonths(6) },
};
const duoPlanTypes = new Set<PlanType>(["annual_duo", "monthly_duo", "ten_duo", "twenty_duo"]);
const installmentPlanTypes = new Set<PlanType>(["annual", "annual_solo", "annual_duo", "ten", "ten_solo", "ten_duo", "twenty_duo"]);
const periodPlanTypes = new Set<PlanType>(["annual", "annual_solo", "annual_duo", "monthly_solo", "monthly_duo"]);
const tenCoursePlanTypes = new Set<PlanType>(["ten", "ten_solo", "ten_duo"]);
const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "Espèces",
  bank_transfer: "Virement",
  card: "Carte bancaire",
  cheque: "Chèque",
  direct_debit: "Prélèvement",
  other: "Autre",
};

function todayAsIsoDate() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}
function makeEmptyForm(): PlanForm {
  return {
    studentName: "",
    secondaryStudentName: "",
    payerName: "",
    email: "",
    phone: "",
    planType: "five",
    amount: "70",
    paymentStatus: "pending",
    paymentPlan: "one",
    paymentMethod: "bank_transfer",
    paidDate: "",
    expiresDate: "",
    totalCourses: "5",
    usedCourses: "0",
    internalNote: "",
  };
}
function asDate(value: Date | string) {
  if (value instanceof Date) return value;
  return new Date(`${String(value).slice(0, 10)}T12:00:00Z`);
}
function dateValue(value: Date | string | null) {
  if (!value) return "";
  const parsed = asDate(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}
function formatDate(value: Date | string | null) {
  if (!value) return "Sans échéance";
  const parsed = asDate(value);
  if (Number.isNaN(parsed.getTime())) return "Date invalide";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "Europe/Paris" }).format(parsed);
}
function formatCurrency(amountCents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amountCents / 100);
}
function installmentLabel(amount: string, count: 2 | 3) {
  const euros = Number(amount.replace(",", "."));
  if (!Number.isFinite(euros) || euros <= 0) return `En ${count} fois`;
  return `En ${count} fois — ${(euros / count).toFixed(2).replace(".", ",")} € indicatifs`;
}

function SubscriptionManagementContent() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const plansQuery = trpc.admin.listStudentPlans.useQuery(undefined, { enabled: isAdmin, retry: false });
  const paymentsQuery = trpc.admin.listStudentPlanPayments.useQuery(undefined, { enabled: isAdmin, retry: false });
  const adjustmentsQuery = trpc.admin.listStudentPlanCourseAdjustments.useQuery(undefined, { enabled: isAdmin, retry: false });
  const workshopWaitlistQuery = trpc.admin.listWorkshopWaitlist.useQuery(undefined, { enabled: isAdmin, retry: false });
  const utils = trpc.useUtils();
  const [form, setForm] = useState<PlanForm>(makeEmptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [selectedPaymentPlanId, setSelectedPaymentPlanId] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(todayAsIsoDate());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [paymentNote, setPaymentNote] = useState("");
  const [portalInviteUrl, setPortalInviteUrl] = useState("");
  const createPlan = trpc.admin.createStudentPlan.useMutation({ onSuccess: async () => { setForm(makeEmptyForm()); setError(""); await utils.admin.listStudentPlans.invalidate(); } });
  const updatePlan = trpc.admin.updateStudentPlan.useMutation({ onSuccess: async () => { setEditingId(null); setForm(makeEmptyForm()); setError(""); await utils.admin.listStudentPlans.invalidate(); } });
  const adjustCourses = trpc.admin.adjustStudentPlanCourses.useMutation({ onSuccess: async () => { await utils.admin.listStudentPlans.invalidate(); } });
  const deletePlan = trpc.admin.deleteStudentPlan.useMutation({ onSuccess: async () => { await utils.admin.listStudentPlans.invalidate(); } });
  const createPayment = trpc.admin.createStudentPlanPayment.useMutation({ onSuccess: async () => { setSelectedPaymentPlanId(null); setPaymentAmount(""); setPaymentNote(""); await Promise.all([utils.admin.listStudentPlans.invalidate(), utils.admin.listStudentPlanPayments.invalidate()]); } });
  const deletePayment = trpc.admin.deleteStudentPlanPayment.useMutation({ onSuccess: async () => { await Promise.all([utils.admin.listStudentPlans.invalidate(), utils.admin.listStudentPlanPayments.invalidate()]); } });
  const createPortalInvite = trpc.admin.createStudentPortalInvite.useMutation({ onSuccess: ({ inviteUrl }) => setPortalInviteUrl(inviteUrl) });
  const revokePortalInvite = trpc.admin.revokeStudentPortalInvite.useMutation();
  const plans = plansQuery.data ?? [];
  const payments = (paymentsQuery.data ?? []) as StudentPlanPayment[];
  const adjustments = (adjustmentsQuery.data ?? []) as StudentPlanCourseAdjustment[];
  const workshopWaitlist = (workshopWaitlistQuery.data ?? []) as WorkshopWaitlistEntry[];
  const orderedPlans = useMemo(() => [...plans].sort((first, second) => {
    const tenCourseOrder = Number(tenCoursePlanTypes.has(second.planType)) - Number(tenCoursePlanTypes.has(first.planType));
    return tenCourseOrder || first.studentName.localeCompare(second.studentName, "fr");
  }), [plans]);
  const activeCount = useMemo(() => plans.filter((plan) => plan.paymentStatus === "paid").length, [plans]);

  const handlePlanTypeChange = (planType: PlanType) => {
    const defaults = planDefaults[planType];
    setForm((current) => ({ ...current, planType, amount: String(defaults.amount / 100), totalCourses: String(defaults.totalCourses), usedCourses: "0", expiresDate: defaults.expiresDate }));
  };
  const startEdit = (plan: StudentPlan) => {
    setEditingId(plan.id);
    setForm({ studentName: plan.studentName, secondaryStudentName: plan.secondaryStudentName ?? "", payerName: plan.payerName ?? "", email: plan.email ?? "", phone: plan.phone ?? "", planType: plan.planType, amount: String(plan.amountCents / 100), paymentStatus: plan.paymentStatus, paymentPlan: plan.paymentPlan, paymentMethod: plan.paymentMethod, paidDate: dateValue(plan.paidDate), expiresDate: dateValue(plan.expiresDate), totalCourses: String(plan.totalCourses), usedCourses: String(plan.usedCourses), internalNote: plan.internalNote ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const cancelEdit = () => { setEditingId(null); setForm(makeEmptyForm()); setError(""); };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const amountCents = Math.round(Number(form.amount.replace(",", ".")) * 100);
    const totalCourses = Number(form.totalCourses);
    const usedCourses = Number(form.usedCourses);
    if (!form.studentName.trim() || !Number.isFinite(amountCents) || amountCents <= 0 || !Number.isInteger(totalCourses) || !Number.isInteger(usedCourses) || usedCourses < 0 || totalCourses < 0 || (totalCourses > 0 && usedCourses > totalCourses)) {
      setError("Vérifiez le nom, le montant et le solde de cours.");
      return;
    }
    const payload = { studentName: form.studentName.trim(), secondaryStudentName: form.secondaryStudentName.trim() || undefined, payerName: form.payerName.trim() || undefined, email: form.email.trim() || undefined, phone: form.phone.trim() || undefined, planType: form.planType, amountCents, paymentStatus: form.paymentStatus, paymentPlan: ["annual", "annual_solo", "annual_duo", "ten", "ten_solo", "ten_duo", "twenty_duo"].includes(form.planType) ? form.paymentPlan : "one" as PaymentPlan, paymentMethod: form.paymentMethod, paidDate: form.paidDate || undefined, expiresDate: form.expiresDate || undefined, totalCourses, usedCourses, internalNote: form.internalNote.trim() || undefined };
    if (editingId) updatePlan.mutate({ ...payload, id: editingId });
    else createPlan.mutate(payload);
  };
  const startPayment = (plan: StudentPlan) => {
    setSelectedPaymentPlanId(plan.id);
    const defaultAmount = plan.paymentPlan === "two" ? plan.amountCents / 200 : plan.paymentPlan === "three" ? plan.amountCents / 300 : plan.amountCents / 100;
    setPaymentAmount(String(Number(defaultAmount.toFixed(2))));
    setPaymentDate(todayAsIsoDate());
    setPaymentMethod(plan.paymentMethod);
    setPaymentNote("");
  };
  const handlePaymentSubmit = (event: FormEvent<HTMLFormElement>, plan: StudentPlan) => {
    event.preventDefault();
    const amountCents = Math.round(Number(paymentAmount.replace(",", ".")) * 100);
    const received = payments.filter((payment) => payment.studentPlanId === plan.id).reduce((sum, payment) => sum + payment.amountCents, 0);
    if (!Number.isFinite(amountCents) || amountCents <= 0 || received + amountCents > plan.amountCents) return;
    createPayment.mutate({ studentPlanId: plan.id, amountCents, paymentDate, paymentMethod, note: paymentNote.trim() || undefined });
  };
  const isSaving = createPlan.isPending || updatePlan.isPending;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Sdyoga · espace privé</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Formules et soldes</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Un suivi numérique simple des formules de vos élèves. Cette page n’est accessible qu’à l’administration.</p>
          </div>
          <Button variant="outline" onClick={() => plansQuery.refetch()} disabled={!isAdmin || plansQuery.isFetching} className="gap-2 self-start"><RefreshCw className={`h-4 w-4 ${plansQuery.isFetching ? "animate-spin" : ""}`} />Actualiser</Button>
        </header>

        {!isAdmin ? <Card className="border-amber-200 bg-amber-50/70"><CardContent className="p-6 text-amber-950">Cet espace est réservé à l’administration.</CardContent></Card> : <>
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-foreground">{plans.length} formule{plans.length > 1 ? "s" : ""} enregistrée{plans.length > 1 ? "s" : ""}</p><p className="text-sm text-muted-foreground">{activeCount} paiement{activeCount > 1 ? "s" : ""} marqué{activeCount > 1 ? "s" : ""} comme réglé{activeCount > 1 ? "s" : ""}.</p></div><p className="text-sm text-muted-foreground">Aucun élève n’est visible publiquement.</p></CardContent>
          </Card>
          <Card className="border-accent/20 bg-accent/5">
            <CardHeader className="pb-3"><CardTitle className="text-xl">Liste d’attente des ateliers</CardTitle></CardHeader>
            <CardContent className="space-y-3"><p className="text-sm text-muted-foreground">{workshopWaitlist.length} inscription{workshopWaitlist.length > 1 ? "s" : ""} · adresses visibles uniquement dans cet espace administrateur.</p>{workshopWaitlistQuery.isLoading ? <p className="text-sm text-muted-foreground">Chargement…</p> : workshopWaitlistQuery.isError ? <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">Impossible de charger la liste pour le moment.</p> : workshopWaitlist.length === 0 ? <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">Aucune inscription pour le moment.</p> : <div className="grid gap-2 sm:grid-cols-2">{workshopWaitlist.map((entry) => <div key={entry.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm"><span className="min-w-0 truncate text-foreground">{entry.email}</span><span className="shrink-0 text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span></div>)}</div>}</CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><WalletCards className="h-5 w-5 text-accent" />{editingId ? "Modifier une formule" : "Ajouter une formule"}</CardTitle></CardHeader>
            <CardContent><form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium">Nom de l’élève<input required value={form.studentName} onChange={(event) => setForm((current) => ({ ...current, studentName: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" placeholder="Prénom Nom" /></label>
              {duoPlanTypes.has(form.planType) && <>
                <label className="grid gap-1.5 text-sm font-medium">Deuxième personne<input required value={form.secondaryStudentName} onChange={(event) => setForm((current) => ({ ...current, secondaryStudentName: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" placeholder="Prénom Nom" /></label>
                <label className="grid gap-1.5 text-sm font-medium">Personne référente pour le règlement<input required value={form.payerName} onChange={(event) => setForm((current) => ({ ...current, payerName: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" placeholder="Prénom Nom" /></label>
              </>}
              <label className="grid gap-1.5 text-sm font-medium">E-mail <span className="font-normal text-muted-foreground">(facultatif)</span><input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /></label>
              <label className="grid gap-1.5 text-sm font-medium">Téléphone <span className="font-normal text-muted-foreground">(facultatif)</span><input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /></label>
              <label className="grid gap-1.5 text-sm font-medium">Formule<select value={form.planType} onChange={(event) => handlePlanTypeChange(event.target.value as PlanType)} className="h-10 rounded-md border border-border bg-background px-3 font-normal">{Object.entries(planLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="grid gap-1.5 text-sm font-medium">Montant réglé (€)<input required inputMode="decimal" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /></label>
              <label className="grid gap-1.5 text-sm font-medium">État du paiement<select value={form.paymentStatus} onChange={(event) => setForm((current) => ({ ...current, paymentStatus: event.target.value as PaymentStatus }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal"><option value="pending">À recevoir</option><option value="paid">Réglé</option></select></label>
              {installmentPlanTypes.has(form.planType) ? <label className="grid gap-1.5 text-sm font-medium">Règlement en plusieurs fois<select value={form.paymentPlan} onChange={(event) => setForm((current) => ({ ...current, paymentPlan: event.target.value as PaymentPlan }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal"><option value="one">En une fois — {form.amount.replace(".", ",")} €</option><option value="two">{installmentLabel(form.amount, 2)}</option><option value="three">{installmentLabel(form.amount, 3)}</option></select><span className="text-xs font-normal text-muted-foreground">Les versements réels seront enregistrés séparément.</span></label> : <div className="hidden md:block" />}
              <label className="grid gap-1.5 text-sm font-medium">Mode de règlement<select value={form.paymentMethod} onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value as PaymentMethod }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal">{Object.entries(paymentMethodLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="grid gap-1.5 text-sm font-medium">Date du règlement <span className="font-normal text-muted-foreground">(facultatif)</span><input type="date" value={form.paidDate} onChange={(event) => setForm((current) => ({ ...current, paidDate: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /></label>
              <label className="grid gap-1.5 text-sm font-medium">Date d’expiration <span className="font-normal text-muted-foreground">(facultatif)</span><input type="date" value={form.expiresDate} onChange={(event) => setForm((current) => ({ ...current, expiresDate: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /><span className="text-xs font-normal text-muted-foreground">{form.planType === "monthly_solo" || form.planType === "monthly_duo" ? "Sans engagement : laissez vide." : "La date est préremplie selon la validité de la formule ; vous pouvez la modifier."}</span></label>
              <label className="grid gap-1.5 text-sm font-medium">Cours achetés<input type="number" min="0" value={form.totalCourses} onChange={(event) => setForm((current) => ({ ...current, totalCourses: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /><span className="text-xs font-normal text-muted-foreground">Pour l’abonnement annuel, laissez 0 : le suivi se fait par période.</span></label>
              <label className="grid gap-1.5 text-sm font-medium">Cours utilisés<input type="number" min="0" value={form.usedCourses} onChange={(event) => setForm((current) => ({ ...current, usedCourses: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /></label>
              <label className="grid gap-1.5 text-sm font-medium md:col-span-2">Note interne <span className="font-normal text-muted-foreground">(privée)</span><textarea value={form.internalNote} onChange={(event) => setForm((current) => ({ ...current, internalNote: event.target.value }))} maxLength={2000} rows={2} className="rounded-md border border-border bg-background px-3 py-2 font-normal" placeholder="Commentaire de gestion…" /></label>
              {error && <p role="alert" className="md:col-span-2 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
              <div className="flex flex-wrap gap-2 md:col-span-2"><Button type="submit" disabled={isSaving} className="gap-2"><Check className="h-4 w-4" />{isSaving ? "Enregistrement…" : editingId ? "Enregistrer les modifications" : "Ajouter la formule"}</Button>{editingId && <Button type="button" variant="outline" onClick={cancelEdit} className="gap-2"><X className="h-4 w-4" />Annuler</Button>}</div>
            </form></CardContent>
          </Card>
          {portalInviteUrl && <Card className="border-accent/30 bg-accent/5"><CardContent className="space-y-3 p-4"><p className="text-sm font-semibold text-foreground">Lien personnel élève — valable 30 jours</p><div className="flex flex-col gap-2 sm:flex-row"><input readOnly value={portalInviteUrl} aria-label="Lien personnel élève" className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-xs" /><Button type="button" variant="outline" className="gap-2" onClick={() => void navigator.clipboard.writeText(portalInviteUrl)}><Copy className="h-4 w-4" />Copier</Button></div><p className="text-xs text-muted-foreground">Transmettez ce lien uniquement à l’élève concerné. Il ouvre un accès limité à sa propre formule et à ses paiements.</p></CardContent></Card>}

          <section className="space-y-4" aria-labelledby="plans-title"><div className="flex items-center justify-between gap-3"><h2 id="plans-title" className="text-2xl font-semibold text-foreground">Élèves et formules</h2><span className="text-sm text-muted-foreground">{plans.length} fiche{plans.length > 1 ? "s" : ""}</span></div>{plansQuery.isLoading ? <Card><CardContent className="p-6 text-muted-foreground">Chargement des formules…</CardContent></Card> : plansQuery.isError ? <Card className="border-rose-200 bg-rose-50"><CardContent className="p-6 text-rose-800">Impossible de charger les formules pour le moment.</CardContent></Card> : plans.length === 0 ? <Card className="border-dashed"><CardContent className="p-8 text-center"><UserRound className="mx-auto h-9 w-9 text-accent" /><p className="mt-3 font-semibold">Aucune formule enregistrée</p><p className="mt-1 text-sm text-muted-foreground">Ajoutez votre première fiche ci-dessus. Rien n’est créé automatiquement.</p></CardContent></Card> : <div className="grid gap-4 lg:grid-cols-2">{orderedPlans.map((plan, index) => { const remaining = Math.max(0, plan.totalCourses - plan.usedCourses); const received = payments.filter((payment) => payment.studentPlanId === plan.id).reduce((sum, payment) => sum + payment.amountCents, 0); const paymentBadge = getPaymentStatus({ paymentStatus: plan.paymentStatus, amountCents: plan.amountCents, receivedCents: received }); const planAdjustments = adjustments.filter((adjustment) => adjustment.studentPlanId === plan.id); const isTenCourse = tenCoursePlanTypes.has(plan.planType); const previousIsTenCourse = tenCoursePlanTypes.has(orderedPlans[index - 1]?.planType ?? "single"); const showTenCourseHeading = isTenCourse && !previousIsTenCourse; const showOtherHeading = !isTenCourse && (index === 0 || previousIsTenCourse); return <Fragment key={plan.id}>{showTenCourseHeading && <div className="lg:col-span-2 rounded-lg border border-accent/25 bg-accent/5 px-4 py-3"><p className="font-semibold text-foreground">Carnets 10 cours</p><p className="text-sm text-muted-foreground">Tous les carnets de 10 cours sont regroupés ici pour retrouver rapidement les boutons « Réduire » et « Restaurer ».</p></div>}{showOtherHeading && <div className="lg:col-span-2 border-t border-border pt-6"><p className="font-semibold text-foreground">Autres formules</p></div>}<Card className="border-border"><CardContent className="space-y-4 p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold text-foreground">{plan.studentName}</h3><p className="text-sm text-accent">{planLabels[plan.planType]}</p></div><Badge variant="outline" className={paymentBadge.className}>{paymentBadge.label}</Badge></div>{(plan.secondaryStudentName || plan.payerName) && <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-sm"><p className="font-semibold text-foreground">Formule Duo</p>{plan.secondaryStudentName && <p className="text-muted-foreground">Deuxième personne : {plan.secondaryStudentName}</p>}{plan.payerName && <p className="text-muted-foreground">Règlement géré par : {plan.payerName}</p>}</div>}<div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3 text-sm"><div><p className="text-muted-foreground">Montant</p><p className="font-semibold">{formatCurrency(plan.amountCents)}</p></div><div><p className="text-muted-foreground">Règlement</p><p className="font-semibold">{paymentMethodLabels[plan.paymentMethod]}</p></div><div><p className="text-muted-foreground">Solde</p><p className="font-semibold">{periodPlanTypes.has(plan.planType) ? "Abonnement en cours" : `${remaining} / ${plan.totalCourses} cours`}</p></div><div><p className="text-muted-foreground">Échéance</p><p className="font-semibold">{formatDate(plan.expiresDate)}</p></div></div>{(() => { const received = payments.filter((payment) => payment.studentPlanId === plan.id).reduce((sum, payment) => sum + payment.amountCents, 0); const remainingPayment = Math.max(0, plan.amountCents - received); const planPayments = payments.filter((payment) => payment.studentPlanId === plan.id); return <div className="space-y-3 rounded-lg border border-accent/20 bg-accent/5 p-3"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-sm font-semibold text-foreground">Paiement{plan.paymentPlan !== "one" ? ` en ${plan.paymentPlan === "two" ? "2" : "3"} fois` : ""}</p><p className="text-xs text-muted-foreground">Reçu : {formatCurrency(received)} · Solde : {formatCurrency(remainingPayment)}</p></div>{remainingPayment > 0 ? <Button type="button" size="sm" variant="outline" onClick={() => startPayment(plan)}>Enregistrer un versement</Button> : <span className="text-xs font-semibold text-emerald-700">Paiement complet</span>}</div>{planPayments.length > 0 && <div className="space-y-1">{planPayments.map((payment) => <div key={payment.id} className="flex items-center justify-between gap-2 text-xs text-muted-foreground"><span>{formatDate(payment.paymentDate)} · {paymentMethodLabels[payment.paymentMethod]}</span><span className="flex items-center gap-2"><strong className="text-foreground">{formatCurrency(payment.amountCents)}</strong><button type="button" className="text-destructive underline" onClick={() => { if (window.confirm("Supprimer ce versement ?")) deletePayment.mutate({ id: payment.id }); }}>retirer</button></span></div>)}</div>}{selectedPaymentPlanId === plan.id && remainingPayment > 0 && <form onSubmit={(event) => handlePaymentSubmit(event, plan)} className="grid gap-2 sm:grid-cols-[1fr_auto_auto]"><input required inputMode="decimal" aria-label="Montant du versement" value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} className="h-9 rounded-md border border-border bg-background px-2 text-sm" placeholder="Montant en €" /><input required type="date" aria-label="Date du versement" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} className="h-9 rounded-md border border-border bg-background px-2 text-sm" /><Button type="submit" size="sm" disabled={createPayment.isPending}>{createPayment.isPending ? "…" : "Valider"}</Button><input aria-label="Note du versement" value={paymentNote} onChange={(event) => setPaymentNote(event.target.value)} className="h-9 rounded-md border border-border bg-background px-2 text-sm sm:col-span-2" placeholder="Note facultative" /><Button type="button" size="sm" variant="ghost" onClick={() => setSelectedPaymentPlanId(null)}>Annuler</Button></form>}</div>; })()}{<div className="space-y-3 rounded-lg border border-border bg-background/70 p-3" aria-label={`Historique du solde de ${plan.studentName}`}><div className="flex items-center gap-2"><History className="h-4 w-4 text-accent" aria-hidden="true" /><p className="text-sm font-semibold text-foreground">Historique du solde</p></div>{planAdjustments.length === 0 ? <p className="text-xs text-muted-foreground">Aucune réduction ou restauration enregistrée.</p> : <div className="space-y-2">{planAdjustments.map((adjustment) => { const beforeRemaining = Math.max(0, plan.totalCourses - adjustment.previousUsedCourses); const afterRemaining = Math.max(0, plan.totalCourses - adjustment.nextUsedCourses); return <div key={adjustment.id} className="flex flex-col gap-1 border-b border-border pb-2 text-xs last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-3"><div><p className="font-semibold text-foreground">{adjustment.action === "reduce" ? "Réduction" : "Restauration"} · {formatDate(adjustment.createdAt)}</p><p className="text-muted-foreground">Cours utilisés : {adjustment.previousUsedCourses} → {adjustment.nextUsedCourses} · Solde restant : {beforeRemaining} → {afterRemaining}</p></div><span className="shrink-0 font-medium text-accent">{adjustment.action === "reduce" ? "− 1 cours" : "+ 1 cours"}</span></div>; })}</div>}</div>}{(plan.email || plan.phone) && <p className="text-sm text-muted-foreground">{plan.phone}{plan.phone && plan.email ? " · " : ""}{plan.email}</p>}{plan.internalNote && <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"><strong>Note interne :</strong> {plan.internalNote}</p>}<div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => adjustCourses.mutate({ id: plan.id, delta: 1 })} disabled={periodPlanTypes.has(plan.planType) || plan.usedCourses >= plan.totalCourses || adjustCourses.isPending}>− Réduire</Button><Button variant="outline" size="sm" onClick={() => adjustCourses.mutate({ id: plan.id, delta: -1 })} disabled={periodPlanTypes.has(plan.planType) || plan.usedCourses <= 0 || adjustCourses.isPending}>+ Restaurer</Button>{plan.email && <><Button variant="outline" size="sm" onClick={() => { setPortalInviteUrl(""); createPortalInvite.mutate({ studentPlanId: plan.id }); }} disabled={createPortalInvite.isPending} className="gap-1.5"><Link2 className="h-3.5 w-3.5" />{createPortalInvite.isPending ? "Création…" : "Lien élève"}</Button><Button variant="ghost" size="sm" onClick={() => revokePortalInvite.mutate({ studentPlanId: plan.id })} disabled={revokePortalInvite.isPending}>Révoquer</Button></>}<Button variant="outline" size="sm" onClick={() => startEdit(plan)} className="gap-1.5"><Edit3 className="h-3.5 w-3.5" />Modifier</Button><Button variant="outline" size="sm" onClick={() => { if (window.confirm("Supprimer cette formule ?")) deletePlan.mutate({ id: plan.id }); }} className="gap-1.5 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" />Supprimer</Button></div></CardContent></Card></Fragment>; })}</div>}</section>
        </>}
      </div>
    </div>
  );
}

export default function SubscriptionManagement() {
  return <DashboardLayout><SubscriptionManagementContent /></DashboardLayout>;
}

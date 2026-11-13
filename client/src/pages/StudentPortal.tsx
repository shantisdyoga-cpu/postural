import { useEffect, useState } from "react";
import { CheckCircle2, Download, LogOut, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getPaymentStatus } from "@/lib/paymentStatus";

const planLabels: Record<string, string> = {
  single: "Cours à l’unité",
  five: "Carte 5 cours",
  ten: "Carnet 10 cours",
  annual: "Abonnement annuel",
  annual_solo: "Annuel Solo",
  annual_duo: "Annuel Duo / Couple",
  monthly_solo: "Mensuel Solo",
  monthly_duo: "Mensuel Duo / Couple",
  ten_solo: "Carnet 10 cours Solo",
  ten_duo: "Carnet 10 cours Duo",
  twenty_duo: "Carnet 20 cours Duo",
};
const paymentMethodLabels: Record<string, string> = {
  cash: "Espèces",
  bank_transfer: "Virement",
  card: "Carte bancaire",
  cheque: "Chèque",
  direct_debit: "Prélèvement",
  other: "Autre",
};

function formatCurrency(amountCents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amountCents / 100);
}

function ReceiptDownloadButton({ paymentId }: { paymentId: number }) {
  const receiptQuery = trpc.studentPortal.receipt.useQuery({ paymentId }, { enabled: false, retry: false });
  const downloadReceipt = async () => {
    const result = await receiptQuery.refetch();
    if (!result.data) return;
    const binary = atob(result.data.contentBase64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: result.data.contentType }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = result.data.filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => void downloadReceipt()} disabled={receiptQuery.isFetching}><Download className="h-4 w-4" />{receiptQuery.isFetching ? "Préparation…" : "Télécharger"}</Button>;
}

function formatDate(value: Date | string | null) {
  if (!value) return "Sans échéance";
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date non disponible";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "Europe/Paris" }).format(parsed);
}

export default function StudentPortal() {
  const [ready, setReady] = useState(false);
  const token = useState(() => new URLSearchParams(window.location.search).get("token"))[0];
  const utils = trpc.useUtils();
  const exchangeToken = trpc.studentPortal.exchangeToken.useMutation({
    onSuccess: async () => {
      window.history.replaceState({}, document.title, "/espace-eleve");
      setReady(true);
      await utils.studentPortal.me.invalidate();
    },
    onError: () => setReady(true),
  });
  const portalQuery = trpc.studentPortal.me.useQuery(undefined, { enabled: ready, retry: false });
  const logout = trpc.studentPortal.logout.useMutation({
    onSuccess: () => {
      setReady(false);
      void utils.studentPortal.me.invalidate();
    },
  });

  useEffect(() => {
    if (token) exchangeToken.mutate({ token });
    else setReady(true);
  }, [token]);

  if (!ready || exchangeToken.isPending || portalQuery.isLoading) {
    return <main className="flex min-h-screen items-center justify-center bg-background px-4"><Card className="w-full max-w-md"><CardContent className="p-8 text-center text-muted-foreground">Ouverture de votre espace personnel…</CardContent></Card></main>;
  }

  if (portalQuery.isError || !portalQuery.data) {
    return <main className="flex min-h-screen items-center justify-center bg-background px-4"><Card className="w-full max-w-md border-accent/20"><CardHeader><CardTitle className="text-2xl text-foreground">Espace élève</CardTitle></CardHeader><CardContent className="space-y-4 text-sm text-muted-foreground"><p>Votre lien d’accès est invalide, expiré ou n’a pas encore été ouvert.</p><Button asChild className="w-full"><a href="/">Retour au site</a></Button></CardContent></Card></main>;
  }

  const { student, plan, payments } = portalQuery.data;
  const isPeriodPlan = ["annual", "annual_solo", "annual_duo", "monthly_solo", "monthly_duo"].includes(plan.planType);
  const paymentProgress = plan.amountCents > 0 ? Math.min(100, Math.round((plan.receivedCents / plan.amountCents) * 100)) : 0;
  const paymentStatus = getPaymentStatus(plan);

  return <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6"><div className="mx-auto max-w-3xl space-y-6"><header className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Sdyoga · espace personnel</p><h1 className="mt-2 text-3xl font-semibold">Bonjour {student.name}</h1><p className="mt-1 text-sm text-muted-foreground">Retrouvez ici les informations de votre formule.</p></div><Button variant="outline" size="sm" onClick={() => logout.mutate()} className="gap-2"><LogOut className="h-4 w-4" />Quitter</Button></header>

  <section className="grid gap-4 sm:grid-cols-2"><Card className="border-accent/20 bg-accent/5"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><WalletCards className="h-5 w-5 text-accent" />Votre formule</CardTitle></CardHeader><CardContent className="space-y-2"><p className="text-xl font-semibold">{planLabels[plan.planType] ?? "Formule Sdyoga"}</p><p className="text-sm text-muted-foreground">Montant total : {formatCurrency(plan.amountCents)}</p><p className="text-sm text-muted-foreground">{isPeriodPlan ? "Abonnement en cours" : `${Math.max(0, plan.totalCourses - plan.usedCourses)} cours restants sur ${plan.totalCourses}`}</p>{plan.expiresDate && <p className="text-sm text-muted-foreground">Valable jusqu’au {formatDate(plan.expiresDate)}</p>}</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center justify-between gap-3 text-lg">Paiement <Badge variant="outline" className={paymentStatus.className}>{paymentStatus.label}</Badge></CardTitle></CardHeader><CardContent className="space-y-2"><p className="text-xl font-semibold">{formatCurrency(plan.receivedCents)} reçu</p><p className="text-sm text-muted-foreground">{plan.remainingPaymentCents > 0 ? `Solde restant : ${formatCurrency(plan.remainingPaymentCents)}` : "Paiement complet"}</p><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${paymentProgress}%` }} /></div></CardContent></Card></section>

  <Card><CardHeader><CardTitle className="text-lg">Historique des paiements</CardTitle></CardHeader><CardContent>{payments.length === 0 ? <p className="text-sm text-muted-foreground">Aucun versement enregistré pour le moment.</p> : <div className="space-y-3">{payments.map((payment) => <div key={payment.id} className="flex items-center justify-between gap-4 border-b border-border pb-3 text-sm last:border-0 last:pb-0"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /><span>{formatDate(payment.paymentDate)} · {paymentMethodLabels[payment.paymentMethod] ?? "Règlement"}</span></div><div className="flex items-center gap-3"><strong>{formatCurrency(payment.amountCents)}</strong><ReceiptDownloadButton paymentId={payment.id} /></div></div>)}</div>}</CardContent></Card>

  <p className="text-center text-xs text-muted-foreground">Une question sur votre formule ? Contactez David directement depuis le site Sdyoga.</p></div></main>;
}

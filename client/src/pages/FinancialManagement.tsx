import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Download, Edit3, Euro, Plus, ReceiptText, RefreshCw, Trash2, WalletCards } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";

const transactionTypeLabels = {
  income: "Recette",
  expense: "Dépense",
} as const;

const paymentMethodLabels = {
  cash: "Espèces",
  bank_transfer: "Virement",
  card: "Carte bancaire",
  cheque: "Chèque",
  direct_debit: "Prélèvement",
  other: "Autre",
} as const;

const incomeCategories = ["Cours collectifs", "Cours individuels", "Appels téléphoniques", "Forfaits", "Autre recette"];
const expenseCategories = ["Location de salle", "Matériel", "Formation", "Communication", "Frais bancaires", "Déplacement", "Assurance", "Autre dépense"];

const typeStyles = {
  income: "border-emerald-200 bg-emerald-50 text-emerald-800",
  expense: "border-rose-200 bg-rose-50 text-rose-800",
} as const;

type TransactionType = keyof typeof transactionTypeLabels;
type PaymentMethod = keyof typeof paymentMethodLabels;

type FinancialFormState = {
  id?: number;
  transactionDate: string;
  type: TransactionType;
  amount: string;
  category: string;
  paymentMethod: PaymentMethod;
  note: string;
};

type FinancialTransaction = {
  id: number;
  transactionDate: Date | string;
  type: TransactionType;
  amountCents: number;
  category: string;
  paymentMethod: PaymentMethod;
  note: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

function todayAsIsoDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function makeInitialForm(): FinancialFormState {
  return {
    transactionDate: todayAsIsoDate(),
    type: "income",
    amount: "",
    category: incomeCategories[0],
    paymentMethod: "bank_transfer",
    note: "",
  };
}

function formatCurrency(amountCents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amountCents / 100);
}

function formatDate(date: Date | string) {
  const value = date instanceof Date ? date : new Date(`${String(date).slice(0, 10)}T12:00:00Z`);
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "Europe/Paris" }).format(value);
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function buildTransactionsCsv(transactions: FinancialTransaction[]) {
  const headers = ["ID", "Date", "Type", "Montant", "Catégorie", "Moyen de paiement", "Note"];
  const rows = transactions.map((transaction) => [
    transaction.id,
    formatDate(transaction.transactionDate),
    transactionTypeLabels[transaction.type],
    formatCurrency(transaction.amountCents),
    transaction.category,
    paymentMethodLabels[transaction.paymentMethod],
    transaction.note,
  ].map(csvCell).join(";"));
  return `\uFEFF${[headers.map(csvCell).join(";"), ...rows].join("\r\n")}`;
}

function downloadTransactionsCsv(transactions: FinancialTransaction[]) {
  const blob = new Blob([buildTransactionsCsv(transactions)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sdyoga-finances-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function FinancialManagementContent() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const transactionsQuery = trpc.admin.listFinancialTransactions.useQuery(undefined, { enabled: isAdmin, retry: false });
  const utils = trpc.useUtils();
  const [form, setForm] = useState<FinancialFormState>(makeInitialForm);
  const [periodFilter, setPeriodFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);

  const refreshTransactions = () => transactionsQuery.refetch();
  const invalidateTransactions = async () => {
    await utils.admin.listFinancialTransactions.invalidate();
  };
  const createTransaction = trpc.admin.createFinancialTransaction.useMutation({ onSuccess: async () => { setForm(makeInitialForm()); await invalidateTransactions(); } });
  const updateTransaction = trpc.admin.updateFinancialTransaction.useMutation({ onSuccess: async () => { setForm(makeInitialForm()); await invalidateTransactions(); } });
  const deleteTransaction = trpc.admin.deleteFinancialTransaction.useMutation({ onSuccess: async () => { setTransactionToDelete(null); await invalidateTransactions(); } });

  const allTransactions = (transactionsQuery.data ?? []) as FinancialTransaction[];
  const categories = useMemo(() => Array.from(new Set([...incomeCategories, ...expenseCategories])), []);
  const filteredTransactions = useMemo(() => allTransactions.filter((transaction) => {
    const matchesPeriod = !periodFilter || String(transaction.transactionDate).slice(0, 7) === periodFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
    return matchesPeriod && matchesType && matchesCategory;
  }), [allTransactions, categoryFilter, periodFilter, typeFilter]);
  const totals = useMemo(() => filteredTransactions.reduce((result, transaction) => {
    if (transaction.type === "income") result.income += transaction.amountCents;
    else result.expense += transaction.amountCents;
    return result;
  }, { income: 0, expense: 0 }), [filteredTransactions]);
  const balance = totals.income - totals.expense;

  function handleTypeChange(type: TransactionType) {
    setForm((current) => ({ ...current, type, category: type === "income" ? incomeCategories[0] : expenseCategories[0] }));
  }

  function editTransaction(transaction: FinancialTransaction) {
    setForm({
      id: transaction.id,
      transactionDate: String(transaction.transactionDate).slice(0, 10),
      type: transaction.type,
      amount: (transaction.amountCents / 100).toFixed(2),
      category: transaction.category,
      paymentMethod: transaction.paymentMethod,
      note: transaction.note ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amountCents = Math.round(Number(form.amount.replace(",", ".")) * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) return;
    const input = {
      transactionDate: form.transactionDate,
      type: form.type,
      amountCents,
      category: form.category,
      paymentMethod: form.paymentMethod,
      note: form.note || undefined,
    };
    if (form.id) updateTransaction.mutate({ id: form.id, ...input });
    else createTransaction.mutate(input);
  }

  const isSaving = createTransaction.isPending || updateTransaction.isPending;
  const formError = createTransaction.error?.message || updateTransaction.error?.message;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Sdyoga · espace privé</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Recettes et dépenses</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Suivez simplement les mouvements financiers liés à votre activité Sdyoga.</p>
          </div>
          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            <Button variant="outline" onClick={refreshTransactions} disabled={!isAdmin || transactionsQuery.isFetching} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${transactionsQuery.isFetching ? "animate-spin" : ""}`} />Actualiser
            </Button>
            <Button variant="outline" onClick={() => downloadTransactionsCsv(filteredTransactions)} disabled={!isAdmin || !filteredTransactions.length} className="gap-2" aria-label="Exporter les opérations affichées au format CSV">
              <Download className="h-4 w-4" />Exporter la vue (CSV)
            </Button>
          </div>
        </header>

        {!isAdmin ? (
          <Card className="border-amber-200 bg-amber-50/70">
            <CardContent className="p-6 text-amber-900">
              <h2 className="font-semibold">Accès réservé à David</h2>
              <p className="mt-2 text-sm leading-relaxed">Cette page est privée. Connectez-vous avec le compte administrateur du projet pour consulter les données financières.</p>
            </CardContent>
          </Card>
        ) : transactionsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-3"><div className="h-28 animate-pulse rounded-xl bg-muted" /><div className="h-28 animate-pulse rounded-xl bg-muted" /><div className="h-28 animate-pulse rounded-xl bg-muted" /></div>
        ) : transactionsQuery.isError ? (
          <Card className="border-destructive/30"><CardContent className="p-6"><h2 className="font-semibold text-foreground">Impossible de charger les opérations</h2><p className="mt-2 text-sm text-muted-foreground">Vérifiez votre connexion puis réessayez.</p><Button className="mt-4" onClick={refreshTransactions}>Réessayer</Button></CardContent></Card>
        ) : (
          <>
            <Card className="border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Plus className="h-5 w-5 text-accent" />{form.id ? "Modifier une opération" : "Ajouter une opération"}</CardTitle>
                <p className="text-sm text-muted-foreground">Saisissez le montant en euros. Il sera enregistré en centimes pour conserver un calcul fiable du solde.</p>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" onSubmit={handleSubmit}>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Date<input required type="date" value={form.transactionDate} onChange={(event) => setForm((current) => ({ ...current, transactionDate: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Type<select value={form.type} onChange={(event) => handleTypeChange(event.target.value as TransactionType)} className="h-10 rounded-md border border-border bg-background px-3 font-normal"><option value="income">Recette</option><option value="expense">Dépense</option></select></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Montant (€)<input required type="number" min="0.01" step="0.01" inputMode="decimal" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" placeholder="50,00" /></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Catégorie<select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal">{(form.type === "income" ? incomeCategories : expenseCategories).map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Moyen de paiement<select value={form.paymentMethod} onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value as PaymentMethod }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal">{(Object.keys(paymentMethodLabels) as PaymentMethod[]).map((method) => <option key={method} value={method}>{paymentMethodLabels[method]}</option>)}</select></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground md:col-span-2 lg:col-span-1">Note facultative<input value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} className="h-10 rounded-md border border-border bg-background px-3 font-normal" placeholder="Précision utile…" /></label>
                  <div className="flex flex-wrap items-center gap-3 md:col-span-2 lg:col-span-3"><Button type="submit" disabled={isSaving || !form.amount} className="gap-2">{form.id ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{isSaving ? "Enregistrement…" : form.id ? "Enregistrer la modification" : "Ajouter l’opération"}</Button>{form.id && <Button type="button" variant="outline" onClick={() => setForm(makeInitialForm())} disabled={isSaving}>Annuler</Button>}{formError && <p className="text-sm text-destructive">{formError}</p>}</div>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-emerald-200 bg-emerald-50/50"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Recettes{periodFilter ? " sur la période" : ""}</p><p className="mt-2 text-3xl font-bold text-emerald-700">{formatCurrency(totals.income)}</p></CardContent></Card>
              <Card className="border-rose-200 bg-rose-50/50"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Dépenses{periodFilter ? " sur la période" : ""}</p><p className="mt-2 text-3xl font-bold text-rose-700">{formatCurrency(totals.expense)}</p></CardContent></Card>
              <Card className={balance >= 0 ? "border-accent/20 bg-accent/5" : "border-amber-200 bg-amber-50/60"}><CardContent className="p-5"><p className="text-sm text-muted-foreground">Solde</p><p className={`mt-2 text-3xl font-bold ${balance >= 0 ? "text-accent" : "text-amber-700"}`}>{formatCurrency(balance)}</p></CardContent></Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><ReceiptText className="h-5 w-5 text-accent" />Opérations enregistrées</CardTitle><p className="text-sm text-muted-foreground">{filteredTransactions.length} opération{filteredTransactions.length > 1 ? "s" : ""} affichée{filteredTransactions.length > 1 ? "s" : ""}. Les données restent accessibles uniquement depuis l’espace administrateur.</p></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 rounded-xl bg-muted/30 p-4 md:grid-cols-3">
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Période<input type="month" value={periodFilter} onChange={(event) => setPeriodFilter(event.target.value)} className="h-10 rounded-md border border-border bg-background px-3 font-normal" /></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Type<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "all" | TransactionType)} className="h-10 rounded-md border border-border bg-background px-3 font-normal"><option value="all">Tous les types</option><option value="income">Recettes</option><option value="expense">Dépenses</option></select></label>
                  <label className="grid gap-1.5 text-sm font-medium text-foreground">Catégorie<select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-10 rounded-md border border-border bg-background px-3 font-normal"><option value="all">Toutes les catégories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
                </div>

                {filteredTransactions.length === 0 ? <div className="rounded-xl border border-dashed border-border p-10 text-center"><WalletCards className="mx-auto h-10 w-10 text-muted-foreground/60" /><h2 className="mt-4 font-semibold text-foreground">Aucune opération enregistrée</h2><p className="mt-2 text-sm text-muted-foreground">Ajoutez votre première recette ou dépense pour commencer le suivi.</p></div> : <div className="space-y-3">{filteredTransactions.map((transaction) => <div key={transaction.id} className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-start gap-3"><div className={`mt-0.5 rounded-lg p-2 ${transaction.type === "income" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}><Euro className="h-4 w-4" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="font-semibold text-foreground">{transaction.category}</strong><Badge variant="outline" className={typeStyles[transaction.type]}>{transactionTypeLabels[transaction.type]}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{formatDate(transaction.transactionDate)} · {paymentMethodLabels[transaction.paymentMethod]}{transaction.note ? ` · ${transaction.note}` : ""}</p></div></div><div className="flex items-center justify-between gap-3 sm:justify-end"><strong className={`text-lg ${transaction.type === "income" ? "text-emerald-700" : "text-rose-700"}`}>{transaction.type === "income" ? "+" : "−"}{formatCurrency(transaction.amountCents)}</strong><Button size="sm" variant="ghost" className="gap-1.5" onClick={() => editTransaction(transaction)} aria-label={`Modifier l'opération ${transaction.category}`}><Edit3 className="h-4 w-4" />Modifier</Button><AlertDialog open={transactionToDelete === transaction.id} onOpenChange={(open) => { if (!open && !deleteTransaction.isPending) setTransactionToDelete(null); }}><AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setTransactionToDelete(transaction.id)} disabled={deleteTransaction.isPending}><Trash2 className="h-4 w-4" />Supprimer</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Supprimer cette opération ?</AlertDialogTitle><AlertDialogDescription>Cette opération sera définitivement retirée du suivi financier. Cette action ne peut pas être annulée.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={deleteTransaction.isPending}>Annuler</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={deleteTransaction.isPending} onClick={() => deleteTransaction.mutate({ id: transaction.id })}>{deleteTransaction.isPending ? "Suppression…" : "Supprimer définitivement"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></div>)}</div>}
              </CardContent>
            </Card>
          </>
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">Cet outil sert au suivi interne de Sdyoga. Il ne remplace pas un logiciel comptable ni la vérification d’un professionnel pour vos obligations comptables et fiscales.</p>
      </div>
    </div>
  );
}

export default function FinancialManagement() {
  return <DashboardLayout><FinancialManagementContent /></DashboardLayout>;
}


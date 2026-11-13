import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const adminBookingsSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/AdminBookings.tsx"),
  "utf8",
);
const homeSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/Home.tsx"),
  "utf8",
);

describe("export des demandes vers Google Sheets", () => {
  it("propose un export CSV encodé pour une copie indépendante", () => {
    expect(adminBookingsSource).toContain("Exporter toutes les réservations (CSV)");
    expect(adminBookingsSource).toContain("même si une vue filtrée est active");
    expect(adminBookingsSource).toContain("bookingsQuery.data ?? []");
    expect(adminBookingsSource).toContain("function buildBookingsCsv");
    expect(adminBookingsSource).toContain("\\uFEFF");
    expect(adminBookingsSource).toContain("Demande reçue le");
    expect(adminBookingsSource).toContain("link.download = `sdyoga-demandes-");
  });
});

describe("saisie manuelle des demandes téléphoniques", () => {
  it("propose les champs nécessaires sans envoyer d’e-mail automatique", () => {
    expect(adminBookingsSource).toContain("Ajouter une demande reçue par téléphone");
    expect(adminBookingsSource).toContain("createManualBooking");
    expect(adminBookingsSource).toContain("Cette saisie reste privée dans l’administration");
    expect(adminBookingsSource).toContain("message: manualForm.message || undefined");
    expect(adminBookingsSource).toContain("(facultatif)");
    expect(adminBookingsSource).toContain("E-mail non renseigné");
    expect(adminBookingsSource).toContain("Modifier les coordonnées");
    expect(adminBookingsSource).toContain("updateBookingContact");
    expect(adminBookingsSource).toContain("Note interne privée");
    expect(adminBookingsSource).toContain("Ajouter une note interne");
    expect(adminBookingsSource).toContain("updateBookingInternalNote");
    expect(adminBookingsSource).toContain("Aucune note interne.");
    expect(adminBookingsSource).toContain("buildConfirmationSmsUrl");
    expect(adminBookingsSource).toContain("Préparer le SMS de confirmation");
    expect(adminBookingsSource).toContain("booking.status === \"confirmed\"");
    expect(adminBookingsSource).toContain("votre cours d’essai chez Sdyoga est confirmé");
    expect(adminBookingsSource).toContain("buildReminderSmsUrl");
    expect(adminBookingsSource).toContain("Préparer le SMS de rappel");
    expect(adminBookingsSource).toContain("Petit rappel pour votre cours d’essai demain à");
    expect(adminBookingsSource).toContain("22 bis Rue René Dumont, 13410 Lambesc");
    expect(adminBookingsSource).toContain("N’hésitez pas si vous avez d’autres questions.");
    expect(adminBookingsSource).toContain("Je vous dis à demain.");
    expect(adminBookingsSource).toContain("sms:${booking.phone}?body=${encodeURIComponent(message)}");
    expect(adminBookingsSource).toContain("Ajouter la demande");
    expect(adminBookingsSource).toContain("1 h — 50 €");
    expect(adminBookingsSource).toContain("1 h 30 — 70 €");
    expect(adminBookingsSource).toContain("collectiveAvailability");
    expect(adminBookingsSource).toContain("Places restantes");
    expect(adminBookingsSource).toContain("isFull");
    expect(adminBookingsSource).toContain("remainingPlaces");
    expect(adminBookingsSource).toContain("collectiveClassRosters");
    expect(adminBookingsSource).toContain("Élèves confirmés par cours");
    expect(adminBookingsSource).toContain("Aucun élève confirmé pour le moment.");
    expect(adminBookingsSource).toContain("student.phone");
    expect(adminBookingsSource).toContain("student.email");
  });

  it("ne rend la liste des élèves confirmés disponible que dans l’administration", () => {
    expect(adminBookingsSource).toContain("trpc.admin.collectiveClassRosters.useQuery");
    expect(homeSource).not.toContain("collectiveClassRosters");
    expect(homeSource).not.toContain("Élèves confirmés par cours");
  });
});

describe("recherche rapide des élèves", () => {
  it("filtre les demandes privées par nom, téléphone ou e-mail", () => {
    expect(adminBookingsSource).toContain("Recherche rapide des élèves");
    expect(adminBookingsSource).toContain('id="admin-student-search"');
    expect(adminBookingsSource).toContain("Nom, téléphone ou e-mail");
    expect(adminBookingsSource).toContain("normalizeSearchValue");
    expect(adminBookingsSource).toContain("name.includes(term) || email.includes(term) || phone.includes(compactTerm)");
    expect(adminBookingsSource).toContain("Aucun élève trouvé");
    expect(adminBookingsSource).toContain("Essayez un autre nom, téléphone ou e-mail.");
  });
});

describe("connexion Google Agenda dans l’administration", () => {
  it("cible le compte de David et affiche la synchronisation après confirmation", () => {
    expect(adminBookingsSource).toContain("googleCalendarStatus");
    expect(adminBookingsSource).toContain("/api/google-calendar/connect");
    expect(adminBookingsSource).toContain("shanti.sdyoga@gmail.com");
    expect(adminBookingsSource).toContain("Événement ajouté dans Google Agenda");
    expect(adminBookingsSource).toContain("booking.googleCalendarSyncError");
  });
});

describe("réponse e-mail depuis l’administration", () => {
  it("propose un bouton accessible qui ouvre la messagerie de David", () => {
    expect(adminBookingsSource).toContain("Répondre par e-mail");
    expect(adminBookingsSource).toContain("Note interne :");
    expect(adminBookingsSource).toContain('aria-label={`Répondre par e-mail à ${booking.name}`}');
    expect(adminBookingsSource).toContain("<Button asChild");
    expect(adminBookingsSource).toContain("<Reply");
  });

  it("affiche une suppression protégée par une confirmation explicite", () => {
    expect(adminBookingsSource).toContain("<AlertDialog");
    expect(adminBookingsSource).toContain("Supprimer");
    expect(adminBookingsSource).toContain("Supprimer définitivement");
    expect(adminBookingsSource).toContain("Cours individuel");
    expect(adminBookingsSource).toContain("preferredTime");
    expect(adminBookingsSource).toContain("durationMinutes");
    expect(adminBookingsSource).toContain("phone_call");
    expect(adminBookingsSource).toContain("Gérer les indisponibilités");
    expect(adminBookingsSource).toContain("bookingType");
    expect(adminBookingsSource).toContain("Date entière");
    expect(adminBookingsSource).toContain('event.target.value === "ALL" ? null');
    expect(homeSource).toContain("individualBlockedSlots");
    expect(homeSource).toContain("blockedIndividualDates");
    expect(adminBookingsSource).toContain("listAvailabilityBlocks");
    expect(adminBookingsSource).toContain("Cette action ne peut pas être annulée.");
    expect(adminBookingsSource).toContain("deleteBooking.mutate({ id: booking.id })");
  });

  it("préremplit un lien mailto avec un contexte Sdyoga et encode son contenu", () => {
    expect(adminBookingsSource).toContain("function buildReplyGmailUrl");
    expect(adminBookingsSource).toContain("Sdyoga — votre demande de cours d'essai");
    expect(adminBookingsSource).toContain("Merci pour votre demande de ${isPhoneCall ?");
    expect(adminBookingsSource).toContain("Sdyoga — votre demande de cours individuel");
    expect(adminBookingsSource).toContain("Je vais revenir vers vous rapidement");
    expect(adminBookingsSource).toContain('target="_blank"');
    expect(adminBookingsSource).toContain("encodeURIComponent(subject)");
    expect(adminBookingsSource).toContain("encodeURIComponent(body)");
    expect(adminBookingsSource).toContain("https://mail.google.com/mail/?view=cm");
    expect(adminBookingsSource).toContain("&to=${encodeURIComponent(booking.email ?? \"\")}");
    expect(adminBookingsSource).toContain("&su=${encodeURIComponent(subject)}");
  });
});


describe("lisibilité mobile des cartes de réservation", () => {
  it("met en avant le créneau et regroupe les détails dans une section repliable", () => {
    expect(adminBookingsSource).toContain('className="flex flex-col gap-4 p-4 sm:p-5"');
    expect(adminBookingsSource).toContain('rounded-lg border border-accent/20 bg-background px-3 py-2.5 shadow-sm');
    expect(adminBookingsSource).toContain("Coordonnées et détails");
    expect(adminBookingsSource).toContain("group-open:hidden");
    expect(adminBookingsSource).toContain("Actions de gestion");
    expect(adminBookingsSource).toContain("order-1 gap-1.5 border-emerald-200 bg-emerald-50");
    expect(adminBookingsSource).toContain("order-2 gap-1.5 border-slate-200");
  });
});


describe("message rassurant sur la souplesse", () => {
  it("rassure les visiteurs avant la présentation détaillée de l’approche", async () => {
    const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(homeSource).toContain("Quel que soit votre niveau de souplesse, les cours sont faits pour vous.");
    expect(homeSource).toContain("tel que vous êtes, vous êtes déjà au bon endroit.");
    expect(homeSource).toContain('className="mb-8 border-accent/20 bg-accent/5 p-5 text-center shadow-sm sm:p-6"');
  });
});


describe("accès rapide aux informations pratiques", () => {
  it("propose des ancres flottantes vers les horaires, tarifs et studio", async () => {
    const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(homeSource).toContain("Accès rapide aux informations pratiques");
    expect(homeSource).toContain('href="#schedule"');
    expect(homeSource).toContain('href="#pricing"');
    expect(homeSource).toContain('href="#studio"');
    expect(homeSource).toContain("aria-expanded={quickMenuOpen}");
    expect(homeSource).toContain("Informations pratiques");
    expect(homeSource).toContain('id="schedule"');
    expect(homeSource).toContain('id="pricing"');
    expect(homeSource).toContain('id="studio"');
  });
});


describe("confidentialité de la capacité des cours collectifs", () => {
  it("conserve le compteur dans l’admin mais ne l’affiche plus sur la page publique", () => {
    expect(adminBookingsSource).toContain("Places restantes — cours collectifs");
    expect(homeSource).not.toContain("Places restantes pour les prochains cours collectifs");
    expect(homeSource).not.toContain("collectiveAvailabilityQuery");
  });
});


describe("clarification du planning public", () => {
  it("sépare les horaires collectifs et individuels dans deux blocs distincts", () => {
    expect(homeSource).toContain('id="schedule"');
    expect(homeSource).toContain(">Cours collectifs</h4>");
    expect(homeSource).toContain(">Cours individuels</h4>");
    expect(homeSource).toContain("Une pratique en petit groupe, le soir.");
    expect(homeSource).toContain("Un accompagnement personnalisé, selon vos disponibilités.");
    expect(homeSource).toContain("Mardi et jeudi");
    expect(homeSource).toContain("Samedi");
  });
});


describe("clarification des tarifs publics", () => {
  it("présente les nouvelles formules collectives et conserve les tarifs individuels", () => {
    expect(homeSource).toContain('id="pricing"');
    expect(homeSource).toContain(">Cours collectifs</h4>");
    expect(homeSource).toContain(">Cours individuels</h4>");
    expect(homeSource).toContain("Annuel Solo");
    expect(homeSource).toContain("Annuel Duo / Couple");
    expect(homeSource).toContain("Mensuel Solo");
    expect(homeSource).toContain("Mensuel Duo / Couple");
    expect(homeSource).toContain("Carnet 20 cours Duo");
    expect(homeSource).toContain("Carnet 10 cours Duo");
    expect(homeSource).toContain("Carte 5 cours");
    expect(homeSource).toContain("sans engagement");
    expect(homeSource).toContain("règlement complet dans les trois premiers mois");
    expect(homeSource).toContain('{ type: \'1 h\', price: \'50€\' }');
    expect(homeSource).toContain('{ type: \'1 h 30\', price: \'70€\' }');
  });
});


describe("appel à l’action du cours individuel", () => {
  it("conduit au formulaire et présélectionne le cours individuel", () => {
    expect(homeSource).toContain("Réserver un cours individuel");
    expect(homeSource).toContain('href="#booking"');
    expect(homeSource).toContain('requestType: "individual_course"');
    expect(homeSource).toContain('preferredSlot: "saturday"');
  });
});


describe("interaction du bouton de réservation individuelle", () => {
  it("prévoit un retour visuel au survol et respecte la réduction des mouvements", () => {
    expect(homeSource).toContain("hover:-translate-y-0.5");
    expect(homeSource).toContain("hover:shadow-md");
    expect(homeSource).toContain("active:scale-[0.98]");
    expect(homeSource).toContain("motion-reduce:transition-none");
  });
});


describe("défilement doux du menu flottant", () => {
  it("utilise un défilement doux vers les tarifs avec un mode réduit accessible", () => {
    expect(homeSource).toContain('handleQuickMenuNavigation("#pricing")');
    expect(homeSource).toContain('scrollIntoView({');
    expect(homeSource).toContain('behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"');
    expect(homeSource).toContain('block: "start"');
  });
});


describe("repère visuel après défilement", () => {
  it("prévoit une surbrillance temporaire pour les horaires, tarifs et studio", () => {
    expect(homeSource).toContain("highlightedTarget");
    expect(homeSource).toContain("ring-accent/35");
    expect(homeSource).toContain("setHighlightedTarget(null), 1600");
    expect(homeSource).toContain('highlightedTarget === "#schedule"');
    expect(homeSource).toContain('highlightedTarget === "#pricing"');
    expect(homeSource).toContain('highlightedTarget === "#studio"');
  });
});


describe("menu flottant sur mobile", () => {
  it("limite sa largeur et la hauteur de son panneau pour ne pas masquer la page", () => {
    expect(homeSource).toContain("max-w-[calc(100vw-1.5rem)]");
    expect(homeSource).toContain("max-h-[min(55vh,22rem)]");
    expect(homeSource).toContain("overflow-y-auto");
    expect(homeSource).toContain("env(safe-area-inset-bottom)");
    expect(homeSource).toContain("sm:bottom-6 sm:right-6");
  });
});


describe("locale des calendriers de réservation", () => {
  it("configure les calendriers publics en français", () => {
    expect(homeSource).toContain('import { fr } from "date-fns/locale"');
    expect(homeSource.match(/locale=\{fr\}/g)?.length).toBe(3);
  });
});


describe("appel à l’action du cours collectif", () => {
  it("conduit au formulaire et présélectionne le premier cours d’essai", () => {
    expect(homeSource).toContain("Réserver un cours d’essai");
    expect(homeSource).toContain('requestType: "first_course"');
    expect(homeSource).toContain('preferredSlot: "either"');
  });
});


describe("précision sur l’appel préparatoire", () => {
  it("conseille l’appel avant le cours individuel sans le rendre obligatoire", () => {
    expect(homeSource).toContain("un appel téléphonique préparatoire de 20 minutes est conseillé avant toute réservation");
    expect(homeSource).toContain("La réservation directe d’un cours individuel reste bien entendu possible.");
  });
});


describe("appel à l’action de l’appel préparatoire", () => {
  it("ouvre le formulaire avec l’appel de 20 minutes présélectionné", () => {
    expect(homeSource).toContain("Réserver un appel préparatoire");
    expect(homeSource).toContain('requestType: "phone_call"');
    expect(homeSource).toContain('durationMinutes: 20');
  });
});


describe("chargement analytics", () => {
  it("évite les requêtes analytics sur les hôtes locaux et de prévisualisation", () => {
    const indexSource = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
    expect(indexSource).toContain('window.location.hostname.endsWith(".manus.computer")');
    expect(indexSource).toContain('analyticsScript.src = "%VITE_ANALYTICS_ENDPOINT%/umami"');
    expect(indexSource).toContain('analyticsScript.dataset.websiteId = "%VITE_ANALYTICS_WEBSITE_ID%"');
  });
});


describe("ajout d’une note interne", () => {
  it("ouvre automatiquement les détails lorsque l’administrateur lance l’édition", () => {
    expect(adminBookingsSource).toContain('open={editingNoteBookingId === booking.id ? true : undefined}');
    expect(adminBookingsSource).toContain('setEditingNoteBookingId(booking.id)');
    expect(adminBookingsSource).toContain("Enregistrer la note");
  });
});

describe("suivi des présences et déduction des carnets", () => {
  it("affiche toujours les compteurs et permet de valider le cours passé", () => {
    expect(adminBookingsSource).toContain("Suivi des présences");
    expect(adminBookingsSource).toContain("attendanceWithoutDeduction");
    expect(adminBookingsSource).toContain("cours passé");
    expect(adminBookingsSource).toContain("Présent — débiter");
    expect(adminBookingsSource).toContain("Après chaque cours confirmé passé");
    expect(adminBookingsSource).toContain("Revenez après le cours du mercredi ou du vendredi");
  });
});


describe("mention de prudence médicale", () => {
  it("rappelle que le yoga ne remplace pas un avis médical", () => {
    expect(homeSource).toContain("le yoga accompagne votre bien-être, mais ne remplace pas un avis médical");
    expect(homeSource).toContain("En cas de douleur inhabituelle, persistante ou préoccupante");
    expect(homeSource).toContain('role="note"');
  });
});

describe("repères publics de présentation", () => {
  it("affiche l’année de début et ne publie pas la capacité des cours", () => {
    expect(homeSource).toContain(">2019</div>");
    expect(homeSource).toContain("Enseignement depuis");
    expect(homeSource).not.toContain("Années d'enseignement");
    expect(homeSource).not.toContain("Élèves par cours");
    expect(homeSource).not.toContain("Cours collectifs de 10 élèves maximum.");
    expect(adminBookingsSource).toContain("capacité de 10 élèves par cours");
  });
});

describe("gestion administrative des formules élèves", () => {
  it("reste privée et reprend les tarifs convenus", () => {
    const subscriptionsSource = readFileSync(resolve(process.cwd(), "client/src/pages/SubscriptionManagement.tsx"), "utf8");
    const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    const layoutSource = readFileSync(resolve(process.cwd(), "client/src/components/DashboardLayout.tsx"), "utf8");
    expect(appSource).toContain('path={"/admin/formules"}');
    expect(layoutSource).toContain('label: "Formules"');
    expect(subscriptionsSource).toContain("Carte 5 cours");
    expect(subscriptionsSource).toContain("amount: 7000");
    expect(subscriptionsSource).toContain("amount: 12000");
    expect(subscriptionsSource).toContain("amount: 28000");
    expect(subscriptionsSource).toContain("− Réduire");
    expect(subscriptionsSource).toContain("+ Restaurer");
    expect(subscriptionsSource).toContain("trpc.admin.listStudentPlans.useQuery");
    expect(subscriptionsSource).toContain('annual_duo: "Annuel Duo / Couple — 490 €"');
    expect(subscriptionsSource).toContain('monthly_duo: "Mensuel Duo / Couple — 70 € / mois"');
    expect(subscriptionsSource).toContain('ten_duo: "Carnet 10 cours Duo — 3 mois"');
    expect(subscriptionsSource).toContain('twenty_duo: "Carnet 20 cours Duo — 6 mois"');
    expect(subscriptionsSource).toContain("duoPlanTypes.has(form.planType)");
    expect(subscriptionsSource).toContain("installmentPlanTypes.has(form.planType)");
    expect(subscriptionsSource).toContain("secondaryStudentName");
    expect(subscriptionsSource).toContain("installmentLabel(form.amount, 2)");
    expect(subscriptionsSource).toContain("installmentLabel(form.amount, 3)");
    expect(subscriptionsSource).toContain("Enregistrer un versement");
    expect(subscriptionsSource).toContain("Reçu :");
    expect(subscriptionsSource).toContain("Solde :");
    expect(subscriptionsSource).toContain("trpc.admin.createStudentPlanPayment.useMutation");
    expect(subscriptionsSource).toContain("trpc.admin.deleteStudentPlanPayment.useMutation");
    expect(subscriptionsSource).toContain("Cette page n’est accessible qu’à l’administration");
    expect(subscriptionsSource).toContain("if (value instanceof Date) return value;");
    expect(subscriptionsSource).toContain("Date invalide");
  });
});


describe("student portal", () => {
  it("keeps the student portal private and exposes only the expected dashboard fields", async () => {
    const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    const portalSource = readFileSync(resolve(process.cwd(), "client/src/pages/StudentPortal.tsx"), "utf8");
    const subscriptionsSource = readFileSync(resolve(process.cwd(), "client/src/pages/SubscriptionManagement.tsx"), "utf8");
    expect(appSource).toContain('path={"/espace-eleve"}');
    expect(portalSource).toContain("trpc.studentPortal.exchangeToken");
    expect(portalSource).toContain("trpc.studentPortal.me");
    expect(portalSource).toContain("Historique des paiements");
    expect(portalSource).not.toContain("internalNote");
    expect(subscriptionsSource).toContain("trpc.admin.createStudentPortalInvite");
    expect(subscriptionsSource).toContain("Lien élève");
  });
});


describe("student payment receipts", () => {
  it("exposes receipt download only through the authenticated student portal", () => {
    const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    const portalSource = readFileSync(resolve(process.cwd(), "client/src/pages/StudentPortal.tsx"), "utf8");
    const routerSource = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    expect(appSource).toContain('path={"/espace-eleve"}');
    expect(portalSource).toContain("Télécharger");
    expect(portalSource).toContain("trpc.studentPortal.receipt");
    expect(routerSource).toContain("studentPortal: router");
    expect(routerSource).toContain("receipt: publicProcedure");
    expect(routerSource).toContain("payment.studentPlanId === plan.id");
  });
});


describe("gestion du solde des carnets", () => {
  it("réduit ou restaure le nombre de cours restants dans le bon sens", () => {
    const subscriptionsSource = readFileSync(resolve(process.cwd(), "client/src/pages/SubscriptionManagement.tsx"), "utf8");
    expect(subscriptionsSource).toContain('delta: 1 })} disabled={periodPlanTypes.has(plan.planType) || plan.usedCourses >= plan.totalCourses');
    expect(subscriptionsSource).toContain('>− Réduire</Button>');
    expect(subscriptionsSource).toContain('delta: -1 })} disabled={periodPlanTypes.has(plan.planType) || plan.usedCourses <= 0');
    expect(subscriptionsSource).toContain('>+ Restaurer</Button>');
  });
});


describe("historique des carnets", () => {
  it("affiche les réductions et restaurations détaillées par formule", () => {
    const subscriptionsSource = readFileSync(resolve(process.cwd(), "client/src/pages/SubscriptionManagement.tsx"), "utf8");
    expect(subscriptionsSource).toContain("listStudentPlanCourseAdjustments.useQuery");
    expect(subscriptionsSource).toContain("Historique du solde");
    expect(subscriptionsSource).toContain("Aucune réduction ou restauration enregistrée.");
    expect(subscriptionsSource).toContain("Cours utilisés :");
    expect(subscriptionsSource).toContain("Solde restant :");
    expect(subscriptionsSource).toContain('adjustment.action === "reduce" ? "Réduction" : "Restauration"');
    expect(subscriptionsSource).toContain('adjustment.action === "reduce" ? "− 1 cours" : "+ 1 cours"');
  });
});


describe("regroupement des carnets 10 cours", () => {
  it("place tous les carnets 10 cours ensemble avant les autres formules", () => {
    const subscriptionsSource = readFileSync(resolve(process.cwd(), "client/src/pages/SubscriptionManagement.tsx"), "utf8");
    expect(subscriptionsSource).toContain("tenCoursePlanTypes");
    expect(subscriptionsSource).toContain("const orderedPlans = useMemo");
    expect(subscriptionsSource).toContain("Carnets 10 cours");
    expect(subscriptionsSource).toContain("Tous les carnets de 10 cours sont regroupés ici");
    expect(subscriptionsSource).toContain("Autres formules");
    expect(subscriptionsSource).toContain("orderedPlans.map((plan, index)");
  });
});


describe("liste d’attente administrateur", () => {
  it("reste privée et affiche les inscriptions aux ateliers", () => {
    const subscriptionsSource = readFileSync(resolve(process.cwd(), "client/src/pages/SubscriptionManagement.tsx"), "utf8");
    const routersSource = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    expect(subscriptionsSource).toContain("listWorkshopWaitlist.useQuery");
    expect(subscriptionsSource).toContain("Liste d’attente des ateliers");
    expect(subscriptionsSource).toContain("adresses visibles uniquement dans cet espace administrateur");
    expect(routersSource).toContain("listWorkshopWaitlist: adminProcedure.query");
  });
});


describe("communication administrateur", () => {
  it("propose un onglet séparé avec les groupes rapides et la préparation Gmail", () => {
    const communicationSource = readFileSync(resolve(process.cwd(), "client/src/pages/Communication.tsx"), "utf8");
    const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    const layoutSource = readFileSync(resolve(process.cwd(), "client/src/components/DashboardLayout.tsx"), "utf8");
    const subscriptionsSource = readFileSync(resolve(process.cwd(), "client/src/pages/SubscriptionManagement.tsx"), "utf8");
    expect(appSource).toContain('path={"/admin/communication"}');
    expect(layoutSource).toContain('label: "Communication"');
    expect(communicationSource).toContain("Élèves actifs");
    expect(communicationSource).toContain("Liste d’attente");
    expect(communicationSource).toContain("activeMailRecipientIds");
    expect(communicationSource).toContain("waitlistMailRecipientIds");
    expect(communicationSource).toContain("Tout sélectionner");
    expect(communicationSource).toContain("Ouvrir Gmail");
    expect(communicationSource).toContain("Copier pour Gmail");
    expect(communicationSource).toContain("mailto:");
    expect(communicationSource).toContain("mail-copy-toast");
    expect(subscriptionsSource).not.toContain("Préparer un e-mail groupé");
  });
});

describe("alerte des présences à traiter", () => {
  it("repère les cours passés et permet de les classer sans les reproposer", () => {
    const adminSource = readFileSync(resolve(process.cwd(), "client/src/pages/AdminBookings.tsx"), "utf8");
    const schemaSource = readFileSync(resolve(process.cwd(), "drizzle/schema.ts"), "utf8");
    const routerSource = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    expect(schemaSource).toContain('attendanceStatus: mysqlEnum("attendance_status", ["pending", "present", "absent_excused", "absent_unexcused"])');
    expect(adminSource).toContain("attendanceToProcess");
    expect(adminSource).toContain("bookingDateKey(booking.preferredDate) < today");
    expect(adminSource).toContain("attendanceToProcess.length > 0");
    expect(adminSource).toContain("Présent");
    expect(adminSource).toContain("Absent excusé");
    expect(adminSource).toContain("Non prévenu");
    expect(adminSource).toContain("updateBookingAttendanceStatus");
    expect(routerSource).toContain("updateBookingAttendanceStatus: adminProcedure");
    expect(routerSource).toContain('z.enum(["pending", "present", "absent_excused", "absent_unexcused"])');
  });
});


describe("déduction automatique du carnet après validation de présence", () => {
  it("explique la déduction, affiche son état et permet la restauration", () => {
    expect(adminBookingsSource).toContain("recordBookingAttendancePresent");
    expect(adminBookingsSource).toContain("attendanceCourseDeducted");
    expect(adminBookingsSource).toContain("1 cours déduit");
    expect(adminBookingsSource).toContain("Restaurer le cours déduit");
    expect(adminBookingsSource).toContain("Le bouton « Présent » débite automatiquement un cours");
  });
});

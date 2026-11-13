import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("booking.request", () => {
  it("rejects an invalid email and phone before touching persistence", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.booking.request({
        name: "Camille",
        email: "email-invalide",
        phone: "12",
        requestType: "first_course",
        preferredSlot: "either",
        preferredDate: "2026-08-19",
        message: "Je souhaite découvrir un cours.",
      }),
    ).rejects.toThrow();
  });

  it("rejects a course date that is not a Wednesday or Friday", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.booking.request({
        name: "Camille",
        email: "camille@example.com",
        phone: "06 12 34 56 78",
        requestType: "first_course",
        preferredSlot: "either",
        preferredDate: "2026-08-18",
        message: "Je souhaite découvrir un cours.",
      }),
    ).rejects.toThrow();
  });

  it("rejects an unsupported schedule value", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.booking.request({
        name: "Camille",
        email: "camille@example.com",
        phone: "06 12 34 56 78",
        requestType: "first_course",
        preferredSlot: "saturday" as "wednesday",
        preferredDate: "2026-08-19",
        message: "Je souhaite découvrir un cours.",
      }),
    ).rejects.toThrow();
  });
});

  it("rejects an incomplete request before touching persistence", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.booking.request({
        name: "C",
        email: "camille@example.com",
        phone: "06 12 34 56 78",
        requestType: "first_course",
        preferredSlot: "either",
        preferredDate: "2026-08-19",
        message: "Je souhaite découvrir un cours.",
      }),
    ).rejects.toThrow();
  });

  it("rejects a request without a preferred slot", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.booking.request({
        name: "Camille",
        email: "camille@example.com",
        phone: "06 12 34 56 78",
        requestType: "first_course",
        preferredSlot: undefined as "wednesday",
        preferredDate: "2026-08-19",
        message: "Je souhaite découvrir un cours.",
      }),
    ).rejects.toThrow();
  });

describe("booking.request — appels téléphoniques", () => {
  it("rejette un appel un lundi", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.booking.request({
      name: "Camille",
      email: "camille@example.com",
      phone: "06 12 34 56 78",
      requestType: "phone_call",
      preferredSlot: "tuesday",
      preferredDate: "2026-08-31",
      preferredTime: "18:30",
      durationMinutes: 20,
    })).rejects.toThrow();
  });

  it("rejette un horaire d’appel hors de la plage dédiée", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.booking.request({
      name: "Camille",
      email: "camille@example.com",
      phone: "06 12 34 56 78",
      requestType: "phone_call",
      preferredSlot: "tuesday",
      preferredDate: "2026-09-01",
      preferredTime: "17:30",
      durationMinutes: 20,
    })).rejects.toThrow();
  });
});

describe("booking.request — cours individuels", () => {
  it("rejette un horaire du samedi qui dépasse la plage pour 1 h 30", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.booking.request({
        name: "Camille",
        email: "camille@example.com",
        phone: "06 12 34 56 78",
        requestType: "individual_course",
        preferredSlot: "saturday",
        preferredDate: "2026-08-29",
        preferredTime: "18:00",
        durationMinutes: 90,
        message: "Je souhaite réserver un cours individuel.",
      }),
    ).rejects.toThrow();
  });

  it("rejette une date qui ne correspond pas aux jours individuels", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.booking.request({
        name: "Camille",
        email: "camille@example.com",
        phone: "06 12 34 56 78",
        requestType: "individual_course",
        preferredSlot: "saturday",
        preferredDate: "2026-08-28",
        preferredTime: "17:30",
        durationMinutes: 60,
        message: "Je souhaite réserver un cours individuel.",
      }),
    ).rejects.toThrow();
  });
});


describe("workshopWaitlist.join", () => {
  it("rejette une adresse e-mail invalide avant toute écriture", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.workshopWaitlist.join({ email: "adresse-invalide" })).rejects.toThrow();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  createBookingRequest: vi.fn(),
  findDuplicateCollectiveBooking: vi.fn(),
  listConfirmedCollectiveBookingsBetween: vi.fn(),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(),
}));

vi.mock("./email", () => ({
  sendBookingRequestEmail: vi.fn(),
}));

import { createBookingRequest, findDuplicateCollectiveBooking, listConfirmedCollectiveBookingsBetween } from "./db";
import { notifyOwner } from "./_core/notification";
import { sendBookingRequestEmail } from "./email";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: undefined,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "David",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("booking.request flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(findDuplicateCollectiveBooking).mockResolvedValue(undefined);
    vi.mocked(listConfirmedCollectiveBookingsBetween).mockResolvedValue([]);
    vi.mocked(createBookingRequest).mockResolvedValue({
      id: 42,
      name: "Camille",
      email: "camille@example.com",
      phone: "06 12 34 56 78",
      requestType: "first_course",
      preferredSlot: "either",
      preferredDate: new Date("2026-08-19T12:00:00.000Z"),
      message: "Je souhaite découvrir un cours.",
      status: "pending",
      createdAt: new Date("2026-08-15T10:00:00.000Z"),
    });
    vi.mocked(notifyOwner).mockResolvedValue(true);
    vi.mocked(sendBookingRequestEmail).mockResolvedValue(false);
  });

  it("expose les places restantes uniquement à l’administration", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const availability = await caller.admin.collectiveAvailability();

    expect(availability.length).toBeGreaterThan(0);
    expect(availability[0]).toEqual(expect.objectContaining({ date: expect.any(String), slot: expect.stringMatching(/^(wednesday|friday)$/), confirmedCount: 0, remainingPlaces: 10, isFull: false }));
    expect(listConfirmedCollectiveBookingsBetween).toHaveBeenCalledOnce();
  });

  it("persists and notifies a valid first-course request", async () => {
    const caller = appRouter.createCaller(createContext());

    const result = await caller.booking.request({
      name: "Camille",
      email: "camille@example.com",
      phone: "06 12 34 56 78",
      requestType: "first_course",
      preferredSlot: "either",
      preferredDate: "2026-08-19",
      message: "Je souhaite découvrir un cours.",
    });

    expect(result).toEqual({
      success: true,
      notified: true,
      message: "Votre demande est bien enregistrée. David vous recontactera pour confirmer la disponibilité.",
    });
    expect(createBookingRequest).toHaveBeenCalledOnce();
    expect(notifyOwner).toHaveBeenCalledOnce();
    expect(sendBookingRequestEmail).toHaveBeenCalledOnce();
  });

  it("autorise un autre élève sur le même créneau collectif", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.booking.request({
      name: "Nora",
      email: "nora@example.com",
      phone: "06 99 88 77 66",
      requestType: "first_course",
      preferredSlot: "friday",
      preferredDate: "2026-08-21",
      message: "Je souhaite découvrir le yoga.",
    })).resolves.toMatchObject({ success: true });
    expect(findDuplicateCollectiveBooking).toHaveBeenCalledWith(expect.objectContaining({ preferredSlot: "friday", email: "nora@example.com" }));
  });

  it("refuse le doublon public d’une même personne sur un cours collectif", async () => {
    vi.mocked(findDuplicateCollectiveBooking).mockResolvedValue({ id: 42 } as never);
    const caller = appRouter.createCaller(createContext());

    await expect(caller.booking.request({
      name: "Camille",
      email: "camille@example.com",
      phone: "06 12 34 56 78",
      requestType: "first_course",
      preferredSlot: "friday",
      preferredDate: "2026-08-21",
      message: "Je souhaite découvrir un cours.",
    })).rejects.toMatchObject({ code: "CONFLICT" });
    expect(createBookingRequest).not.toHaveBeenCalled();
  });

  it("returns a generic error when persistence fails", async () => {
    vi.mocked(createBookingRequest).mockRejectedValueOnce(new Error("database details must stay private"));
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.booking.request({
        name: "Camille",
        email: "camille@example.com",
        phone: "06 12 34 56 78",
        requestType: "first_course",
        preferredSlot: "either",
        preferredDate: "2026-08-19",
        message: "Je souhaite découvrir un cours.",
      }),
    ).rejects.toThrow("Impossible d'enregistrer votre demande pour le moment.");

    expect(notifyOwner).not.toHaveBeenCalled();
  });
});


describe("confidentialité de la disponibilité collective", () => {
  it("refuse l’accès aux visiteurs non authentifiés", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.admin.collectiveAvailability()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

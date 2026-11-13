export type CalendarSlot = "wednesday" | "friday" | "either" | "tuesday" | "thursday" | "saturday";

const PARIS_TIME_ZONE = "Europe/Paris";
const CLASS_HOUR = 19;
const CLASS_DURATION_HOURS = 1;

const slotWeekdays: Record<Exclude<CalendarSlot, "either">, number> = {
  wednesday: 3,
  friday: 5,
  tuesday: 2,
  thursday: 4,
  saturday: 6,
};

export const calendarSlotLabels: Record<CalendarSlot, string> = {
  wednesday: "mercredi de 19h à 20h",
  friday: "vendredi de 19h à 20h",
  either: "mercredi ou vendredi de 19h à 20h",
  tuesday: "mardi",
  thursday: "jeudi",
  saturday: "samedi",
};

const pad = (value: number) => String(value).padStart(2, "0");

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getNextWeekdayDate(weekday: number, referenceDate: Date) {
  const candidate = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    CLASS_HOUR,
    0,
    0,
    0,
  );
  const daysUntilWeekday = (weekday - candidate.getDay() + 7) % 7;
  const eventDate = addDays(candidate, daysUntilWeekday);

  if (eventDate < referenceDate) {
    return addDays(eventDate, 7);
  }

  return eventDate;
}

export function getNextClassDate(slot: CalendarSlot, referenceDate = new Date()) {
  if (slot === "either") {
    const wednesday = getNextWeekdayDate(slotWeekdays.wednesday, referenceDate);
    const friday = getNextWeekdayDate(slotWeekdays.friday, referenceDate);
    return wednesday < friday ? wednesday : friday;
  }

  return getNextWeekdayDate(slotWeekdays[slot], referenceDate);
}

function formatLocalDate(date: Date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function formatDateOnly(date: Date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

function formatUtcDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function getClassDateForSelection(selectedDate: string, selectedTime = "19:00") {
  const [year, month, day] = selectedDate.split("-").map(Number);
  const [hours, minutes] = selectedTime.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function createCalendarEvent(slot: CalendarSlot, selectedDateOrReferenceDate?: string | Date, referenceDate = new Date(), selectedTime = "19:00", durationMinutes = 60) {
  const selectedDate = typeof selectedDateOrReferenceDate === "string" ? selectedDateOrReferenceDate : undefined;
  const effectiveReferenceDate = selectedDateOrReferenceDate instanceof Date ? selectedDateOrReferenceDate : referenceDate;
  const start = selectedDate ? getClassDateForSelection(selectedDate, selectedTime) : getNextClassDate(slot, effectiveReferenceDate);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + durationMinutes);
  const label = calendarSlotLabels[slot];
  const uid = `sdyoga-${formatLocalDate(start)}-${slot}@sdyoga.fr`;
  const description = [
    "Demande de cours envoyée à Sdyoga.",
    `Créneau souhaité : ${label}.`,
    "Ce rappel est provisoire et reste soumis à la confirmation de David.",
    "Contact : contact@sdyoga-postural.fr — 06 51 59 21 08.",
  ].join("\n");
  const location = "Espace Maitai, 22 bis René Dumont, 13410 Lambesc";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sdyoga//Demande de cours//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Sdyoga",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatUtcDate(effectiveReferenceDate)}`,
    `DTSTART;TZID=${PARIS_TIME_ZONE}:${formatLocalDate(start)}`,
    `DTEND;TZID=${PARIS_TIME_ZONE}:${formatLocalDate(end)}`,
    "STATUS:TENTATIVE",
    "TRANSP:TRANSPARENT",
    `SUMMARY:${escapeIcsText("Sdyoga — créneau souhaité (à confirmer)")}`,
    `DESCRIPTION:${escapeIcsText(`${description}\nDurée : ${durationMinutes === 20 ? "20 minutes" : durationMinutes === 90 ? "1 h 30" : "1 h"}.`)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function downloadCalendarEvent(slot: CalendarSlot, selectedDateOrReferenceDate?: string | Date, referenceDate = new Date(), selectedTime = "19:00", durationMinutes = 60) {
  const selectedDate = typeof selectedDateOrReferenceDate === "string" ? selectedDateOrReferenceDate : undefined;
  const effectiveReferenceDate = selectedDateOrReferenceDate instanceof Date ? selectedDateOrReferenceDate : referenceDate;
  const icsContent = createCalendarEvent(slot, selectedDate, effectiveReferenceDate, selectedTime, durationMinutes);
  const eventDate = selectedDate ? getClassDateForSelection(selectedDate, selectedTime) : getNextClassDate(slot, effectiveReferenceDate);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `sdyoga-${formatDateOnly(eventDate)}.ics`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const MEXICO_OFFSET = "-06:00";
const BLOCKED_HOURS = ["14:00"];

export function getDayOfWeekFromDateString(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
}

export function getBusinessHours(date: string) {
  const day = getDayOfWeekFromDateString(date);

  if (day === 0) {
    return null;
  }

  if (day >= 1 && day <= 5) {
    return { startHour: 10, endHour: 19 };
  }

  if (day === 6) {
    return { startHour: 10, endHour: 16 };
  }

  return null;
}

export function buildSlotStrings(date: string): string[] {
  const hours = getBusinessHours(date);
  if (!hours) return [];

  const slots: string[] = [];

  for (let hour = hours.startHour; hour < hours.endHour; hour++) {
    const slot = `${String(hour).padStart(2, "0")}:00`;

    if (BLOCKED_HOURS.includes(slot)) {
      continue;
    }

    slots.push(slot);
  }

  return slots;
}

export function buildAppointmentDate(date: string, time: string): Date {
  return new Date(`${date}T${time}:00${MEXICO_OFFSET}`);
}

export function getDayRange(date: string) {
  const start = new Date(`${date}T00:00:00${MEXICO_OFFSET}`);
  const end = new Date(`${date}T23:59:59${MEXICO_OFFSET}`);
  return { start, end };
}

export function isValidSlot(date: string, time: string): boolean {
  const slots = buildSlotStrings(date);
  return slots.includes(time);
}

export function isHourAligned(time: string): boolean {
  return /^\d{2}:00$/.test(time);
}

export function formatAppointmentDateTime(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(date);
}

export function isTodayInMexico(date: string): boolean {
  const now = new Date();

  const todayMx = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  return date === todayMx;
}

export function getCurrentHourInMexico(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  if (minute > 0) {
    return hour + 1;
  }

  return hour;
}

export function filterPastSlotsForToday(date: string, slots: string[]): string[] {
  if (!isTodayInMexico(date)) {
    return slots;
  }

  const currentHour = getCurrentHourInMexico();

  return slots.filter((slot) => {
    const hour = Number(slot.split(":")[0]);
    return hour >= currentHour;
  });
}

export function isPastSlotForToday(date: string, time: string): boolean {
  if (!isTodayInMexico(date)) {
    return false;
  }

  const currentHour = getCurrentHourInMexico();
  const hour = Number(time.split(":")[0]);

  return hour < currentHour;
}
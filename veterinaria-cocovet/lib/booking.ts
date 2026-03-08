const MEXICO_OFFSET = "-06:00";

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
    slots.push(`${String(hour).padStart(2, "0")}:00`);
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
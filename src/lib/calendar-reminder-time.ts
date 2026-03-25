type DayName =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado"
  | "domingo";

const dayMap: Record<DayName, number> = {
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
  domingo: 0,
};

function getStartOfCurrentWeek(date = new Date()) {
  const current = new Date(date);
  const day = current.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  current.setDate(current.getDate() + diff);
  current.setHours(0, 0, 0, 0);
  return current;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getCurrentWeekRange(date = new Date()) {
  const start = getStartOfCurrentWeek(date);
  const end = addDays(start, 7);
  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

export function buildReminderDate(dayOfWeek: DayName, hour = 10, minute = 0) {
  const weekStart = getStartOfCurrentWeek();
  const target = addDays(weekStart, dayMap[dayOfWeek] - 1);
  target.setHours(hour, minute, 0, 0);
  return target.toISOString();
}

export function getDefaultReminderType(contentType: string) {
  const normalized = contentType.toLowerCase();

  if (
    normalized.includes("reel") ||
    normalized.includes("video") ||
    normalized.includes("short")
  ) {
    return "gravar";
  }

  if (normalized.includes("story")) {
    return "postar";
  }

  if (normalized.includes("carrossel") || normalized.includes("post")) {
    return "roteirizar";
  }

  return "postar";
}

export function getDefaultReminderHour(contentType: string) {
  const normalized = contentType.toLowerCase();

  if (
    normalized.includes("reel") ||
    normalized.includes("video") ||
    normalized.includes("short")
  ) {
    return 9;
  }

  if (normalized.includes("carrossel")) {
    return 10;
  }

  if (normalized.includes("story")) {
    return 11;
  }

  if (normalized.includes("live")) {
    return 18;
  }

  return 10;
}

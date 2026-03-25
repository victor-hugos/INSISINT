import { describe, expect, it } from "vitest";

import {
  buildReminderDate,
  getCurrentWeekRange,
  getDefaultReminderHour,
  getDefaultReminderType,
} from "../calendar-reminder-time";

describe("calendar-reminder-time", () => {
  it("retorna o tipo padrao correto por formato", () => {
    expect(getDefaultReminderType("Reel educativo")).toBe("gravar");
    expect(getDefaultReminderType("Story de bastidores")).toBe("postar");
    expect(getDefaultReminderType("Carrossel de autoridade")).toBe("roteirizar");
  });

  it("retorna a hora padrao correta por formato", () => {
    expect(getDefaultReminderHour("Reel")).toBe(9);
    expect(getDefaultReminderHour("Carrossel")).toBe(10);
    expect(getDefaultReminderHour("Story")).toBe(11);
    expect(getDefaultReminderHour("Live")).toBe(18);
  });

  it("gera uma data valida para domingo dentro da semana atual", () => {
    const sundayIso = buildReminderDate("domingo", 15, 30);
    const sunday = new Date(sundayIso);

    expect(Number.isNaN(sunday.getTime())).toBe(false);
    expect(sunday.getHours()).toBe(15);
    expect(sunday.getMinutes()).toBe(30);
  });

  it("gera um range semanal de 7 dias", () => {
    const { startIso, endIso } = getCurrentWeekRange(new Date("2026-03-25T12:00:00Z"));
    const diffInDays =
      (new Date(endIso).getTime() - new Date(startIso).getTime()) / 86400000;

    expect(diffInDays).toBe(7);
  });
});

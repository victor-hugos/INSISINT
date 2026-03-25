import { describe, expect, it } from "vitest";

import { getCurrentWeekKey } from "../week-key";

describe("getCurrentWeekKey", () => {
  it("gera a mesma chave para dias da mesma semana ISO", () => {
    expect(getCurrentWeekKey(new Date("2026-03-23T10:00:00Z"))).toBe("2026-W13");
    expect(getCurrentWeekKey(new Date("2026-03-29T23:59:59Z"))).toBe("2026-W13");
  });

  it("avanca para a semana seguinte corretamente", () => {
    expect(getCurrentWeekKey(new Date("2026-03-30T10:00:00Z"))).toBe("2026-W14");
  });
});

import { describe, expect, it } from "vitest";

import {
  getAutomationStatusLabel,
  getIdeaStatusLabel,
  getReminderStatusLabel,
} from "../labels";

describe("labels", () => {
  it("traduz status de ideia", () => {
    expect(getIdeaStatusLabel("approved")).toBe("Aprovada");
    expect(getIdeaStatusLabel("rejected")).toBe("Rejeitada");
    expect(getIdeaStatusLabel("generated")).toBe("Gerada");
  });

  it("traduz status de automacao", () => {
    expect(getAutomationStatusLabel("pending")).toBe("Pendente");
    expect(getAutomationStatusLabel("sent")).toBe("Enviada");
    expect(getAutomationStatusLabel("failed")).toBe("Falhou");
  });

  it("traduz status de lembrete", () => {
    expect(getReminderStatusLabel("pending")).toBe("Pendente");
    expect(getReminderStatusLabel("completed")).toBe("Concluido");
    expect(getReminderStatusLabel("cancelled")).toBe("Cancelado");
  });
});

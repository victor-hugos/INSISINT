import type { IdeaStatus } from "@/types/ideas";
import type { ReminderStatus } from "@/types/reminders";

export function getIdeaStatusLabel(status?: IdeaStatus) {
  if (status === "approved") return "Aprovada";
  if (status === "rejected") return "Rejeitada";
  return "Gerada";
}

export function getAutomationStatusLabel(status?: string) {
  if (status === "sent") return "Enviada";
  if (status === "failed") return "Falhou";
  if (status === "pending") return "Pendente";
  return "Desconhecido";
}

export function getReminderStatusLabel(status?: ReminderStatus | string) {
  if (status === "completed") return "Concluido";
  if (status === "pending") return "Pendente";
  if (status === "cancelled") return "Cancelado";
  return "Desconhecido";
}

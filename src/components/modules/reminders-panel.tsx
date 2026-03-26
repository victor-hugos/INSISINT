"use client";

import { useCallback, useEffect, useState } from "react";
import { useActiveProfile } from "@/components/profile/profile-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { FeedbackBanner } from "@/components/ui/feedback-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { getReminderStatusLabel } from "@/lib/utils/labels";
import {
  completeReminderRequest,
  createReminderRequest,
  listReminders,
  type ReminderApiItem,
} from "@/lib/services/reminders-service";
type Reminder = ReminderApiItem;

const shellStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  display: "grid",
  gap: 24,
};

const cardStyle: React.CSSProperties = {
  padding: 24,
  borderRadius: 24,
  border: "1px solid var(--border)",
  background: "var(--bg-elevated)",
  boxShadow: "var(--shadow)",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid var(--border)",
  background: "var(--surface-strong)",
  color: "var(--text)",
  padding: "14px 16px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  color: "var(--muted)",
  fontSize: "0.95rem",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "15px 18px",
  borderRadius: 16,
  border: "none",
  background: "var(--accent)",
  color: "#f8f5ff",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "15px 18px",
  borderRadius: 16,
  border: "1px solid var(--border)",
  background: "var(--surface-strong)",
  color: "var(--text)",
  fontWeight: 700,
  cursor: "pointer",
};

export function RemindersPanel() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { activeProfileId, profile } = useActiveProfile();
  const [form, setForm] = useState({
    title: "",
    description: "",
    reminderType: "postar",
    scheduledFor: "",
  });

  async function createReminder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeProfileId || !profile) {
      setError("Ative um perfil antes de criar lembretes.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createReminderRequest({
          profileId: activeProfileId,
          title: form.title,
          description: form.description,
          reminderType: form.reminderType,
          scheduledFor: form.scheduledFor,
      });

      setSuccess("Lembrete criado com sucesso.");
      setForm({
        title: "",
        description: "",
        reminderType: "postar",
        scheduledFor: "",
      });
    } catch (creationError) {
      setError(getErrorMessage(creationError));
    } finally {
      setLoading(false);
    }
  }

  const loadReminders = useCallback(async () => {
    if (!activeProfileId) {
      setError("Ative um perfil antes de listar lembretes.");
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const data = await listReminders(activeProfileId);
      setReminders(data.reminders || []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setFetching(false);
    }
  }, [activeProfileId]);

  async function completeReminder(reminderId: string) {
    if (!activeProfileId) {
      setError("Ative um perfil antes de concluir lembretes.");
      return;
    }

    setCompletingId(reminderId);
    setError(null);
    setSuccess(null);

    try {
      const data = await completeReminderRequest({
        reminderId,
        profileId: activeProfileId,
      });

      setReminders((current) =>
        current.map((reminder) =>
          reminder.id === reminderId
            ? {
                ...reminder,
                status: "completed",
                completed_at:
                  data.reminder?.completed_at || new Date().toISOString(),
              }
            : reminder
        )
      );
      setSuccess("Lembrete marcado como concluido.");
    } catch (completionError) {
      setError(getErrorMessage(completionError));
    } finally {
      setCompletingId(null);
    }
  }

  useEffect(() => {
    if (activeProfileId && profile) {
      void loadReminders();
      return;
    }

    setReminders([]);
    setError(null);
    setSuccess(null);
  }, [activeProfileId, loadReminders, profile]);

  return (
    !profile ? (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil para criar e acompanhar lembretes da execucao."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    ) : (
    <div style={shellStyle}>

      <form onSubmit={createReminder} style={cardStyle}>
        <div style={{ display: "grid", gap: 6, marginBottom: 18 }}>
          <p style={{ margin: 0, color: "var(--muted)" }}>Execucao da semana</p>
          <strong>Crie lembretes manuais ou acompanhe os que vieram do calendario.</strong>
        </div>
        <div style={gridStyle}>
          <label style={labelStyle}>
            Titulo do lembrete
            <input
              style={fieldStyle}
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Ex.: revisar metricas de sexta"
            />
          </label>

          <label style={labelStyle}>
            Tipo
            <select
              style={fieldStyle}
              value={form.reminderType}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  reminderType: event.target.value,
                }))
              }
            >
              <option value="postar">Postar</option>
              <option value="gravar">Gravar</option>
              <option value="revisar">Revisar</option>
              <option value="roteirizar">Roteirizar</option>
              <option value="geral">Geral</option>
            </select>
          </label>

          <label style={labelStyle}>
            Agendado para
            <input
              type="datetime-local"
              style={fieldStyle}
              value={form.scheduledFor}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  scheduledFor: event.target.value,
                }))
              }
            />
          </label>
        </div>

        <label style={{ ...labelStyle, marginTop: 14 }}>
          Descricao
          <textarea
            rows={4}
            style={{ ...fieldStyle, resize: "vertical" }}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Ex.: separar 3 ganchos, revisar CTA e deixar thumbnail pronta"
          />
        </label>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
            marginTop: 18,
          }}
        >
          <button
            type="submit"
            disabled={loading}
            style={primaryButtonStyle}
          >
            {loading ? "Salvando..." : "Criar lembrete no perfil ativo"}
          </button>
          <button
            type="button"
            onClick={loadReminders}
            disabled={fetching}
            style={secondaryButtonStyle}
          >
            {fetching ? "Carregando..." : "Listar lembretes do perfil ativo"}
          </button>
        </div>

        {error ? <FeedbackBanner message={error} tone="error" /> : null}
        {success ? <FeedbackBanner message={success} tone="success" /> : null}
      </form>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Lembretes salvos</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {reminders.length === 0 ? (
            <p style={{ color: "var(--muted)", margin: 0 }}>
              Nenhum lembrete carregado ainda.
            </p>
          ) : fetching ? (
            <div className="skeleton" style={{ height: 220, borderRadius: 20 }} />
          ) : (
            reminders.map((reminder) => (
              <article
                key={reminder.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 18,
                  background: "var(--surface-soft)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>{reminder.title}</h3>
                  <StatusBadge
                    tone={
                      reminder.status === "completed"
                        ? "success"
                        : reminder.status === "pending"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {getReminderStatusLabel(reminder.status)}
                  </StatusBadge>
                </div>
                <p>
                  <strong>Tipo:</strong> {reminder.reminder_type}
                </p>
                <p>
                  <strong>Descricao:</strong> {reminder.description || "-"}
                </p>
                <p>
                  <strong>Origem:</strong>{" "}
                  {reminder.calendar_item_id ? "Calendario" : "Manual"}
                </p>
                <p>
                  <strong>Agendado para:</strong> {reminder.scheduled_for}
                </p>
                {reminder.completed_at ? (
                  <p>
                    <strong>Concluido em:</strong> {reminder.completed_at}
                  </p>
                ) : null}
                <div style={{ marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => completeReminder(reminder.id)}
                    disabled={
                      reminder.status === "completed" || completingId === reminder.id
                    }
                    style={secondaryButtonStyle}
                  >
                    {reminder.status === "completed"
                      ? "Concluido"
                      : completingId === reminder.id
                        ? "Salvando..."
                        : "Marcar como feito"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
    )
  );
}

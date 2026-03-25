"use client";

import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { getErrorMessage } from "@/lib/get-error-message";
import { getReminderStatusLabel } from "@/lib/labels";
import {
  completeReminderRequest,
  createReminderRequest,
  listReminders,
  type ReminderApiItem,
} from "@/lib/services/reminders-service";
import { useActiveProfile } from "@/components/profile-provider";

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
  background: "rgba(255,255,255,0.8)",
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
  color: "#fff8f2",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "15px 18px",
  borderRadius: 16,
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.75)",
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
  const { userId, activeProfileId, profile } = useActiveProfile();
  const [form, setForm] = useState({
    title: "",
    description: "",
    reminderType: "postar",
    scheduledFor: "",
  });

  async function createReminder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeProfileId || !profile || !userId) {
      setError("Ative um perfil antes de criar lembretes.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createReminderRequest({
          userId,
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

  async function loadReminders() {
    if (!activeProfileId || !userId) {
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
  }

  async function completeReminder(reminderId: string) {
    if (!activeProfileId || !userId) {
      setError("Ative um perfil antes de concluir lembretes.");
      return;
    }

    setCompletingId(reminderId);
    setError(null);
    setSuccess(null);

    try {
      const data = await completeReminderRequest({
        reminderId,
        userId,
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

  return (
    !profile || !userId ? (
      <EmptyState
        title="Nenhum perfil ativo"
        description="Ative um perfil para criar e acompanhar lembretes da execucao."
        ctaLabel="Ir para onboarding"
        ctaHref="/onboarding"
      />
    ) : (
    <div style={shellStyle}>

      <form onSubmit={createReminder} style={cardStyle}>
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

        {error ? <p style={{ color: "#8a2f12", marginTop: 16 }}>{error}</p> : null}
        {success ? (
          <p style={{ color: "#2f6f3e", marginTop: 16 }}>{success}</p>
        ) : null}
      </form>

      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Lembretes salvos</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {reminders.length === 0 ? (
            <p style={{ color: "var(--muted)", margin: 0 }}>
              Nenhum lembrete carregado ainda.
            </p>
          ) : (
            reminders.map((reminder) => (
              <article
                key={reminder.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: 18,
                  background: "rgba(255,255,255,0.65)",
                }}
              >
                <h3 style={{ marginTop: 0 }}>{reminder.title}</h3>
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
                <p style={{ marginBottom: 0 }}>
                  <strong>Status:</strong> {getReminderStatusLabel(reminder.status)}
                </p>
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

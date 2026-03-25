import { NextResponse } from "next/server";

import { sendInstagramPrivateReply } from "@/lib/instagram/send-private-reply";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function POST() {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "INSTAGRAM_ACCESS_TOKEN nao configurado." },
        { status: 500 }
      );
    }

    const supabaseServer = getSupabaseServer();
    const { data: pendingActions, error } = await supabaseServer
      .from("automation_actions")
      .select(
        `
        *,
        event:automation_events(*),
        rule:automation_rules(*)
      `
      )
      .eq("status", "pending")
      .limit(20);

    if (error) {
      return NextResponse.json(
        { error: "Erro ao buscar acoes pendentes.", details: error.message },
        { status: 500 }
      );
    }

    let processed = 0;

    for (const action of pendingActions || []) {
      try {
        const commentId = action.event?.external_comment_id;
        const replyMessage = action.rule?.reply_message;

        if (!commentId || !replyMessage) {
          throw new Error("Dados insuficientes para enviar resposta.");
        }

        const result = await sendInstagramPrivateReply({
          accessToken,
          commentId,
          message: replyMessage,
        });

        await supabaseServer
          .from("automation_actions")
          .update({
            status: "sent",
            response_payload: result,
            external_message_id: result?.message_id || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", action.id);

        processed += 1;
      } catch (actionError) {
        await supabaseServer
          .from("automation_actions")
          .update({
            status: "failed",
            error_message:
              actionError instanceof Error
                ? actionError.message
                : "Erro desconhecido",
            updated_at: new Date().toISOString(),
          })
          .eq("id", action.id);
      }
    }

    return NextResponse.json({ success: true, processed });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao executar acoes automaticas.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

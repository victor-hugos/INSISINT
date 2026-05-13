import { NextResponse } from "next/server";

import { getAdminEmails, getOptionalPublicEnv } from "@/lib/config/env";

export async function GET() {
  const publicEnv = getOptionalPublicEnv();

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    checks: {
      supabasePublicEnv: Boolean(publicEnv),
      supabaseServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      groq: Boolean(process.env.GROQ_API_KEY),
      instagramWebhook: Boolean(process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN),
      instagramAccessToken: Boolean(process.env.INSTAGRAM_ACCESS_TOKEN),
      adminEmailsConfigured: getAdminEmails().length > 0,
    },
  });
}

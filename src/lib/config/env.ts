function getEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getOptionalEnv(name: string) {
  return process.env[name] || null;
}

function getFirstEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name];

    if (value) {
      return value;
    }
  }

  throw new Error(`Missing environment variable: one of ${names.join(", ")}`);
}

function getOptionalFirstEnv(names: string[]) {
  for (const name of names) {
    const value = process.env[name];

    if (value) {
      return value;
    }
  }

  return null;
}

export function getOptionalPublicEnv() {
  const supabaseUrl = getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = getOptionalFirstEnv([
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
  ]);

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

export function getPublicEnv() {
  const env = getOptionalPublicEnv();

  if (!env) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL and public Supabase key are required"
    );
  }

  return env;
}

export function getServerEnv() {
  return {
    ...getPublicEnv(),
    supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    openaiApiKey: getEnv("OPENAI_API_KEY"),
  };
}

export function getAdminEmails() {
  const rawValue = process.env.ADMIN_EMAILS || process.env.PILOT_LEADS_ADMIN_EMAILS || "";

  return rawValue
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

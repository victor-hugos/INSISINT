function getEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
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

export function getPublicEnv() {
  return {
    supabaseUrl: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: getFirstEnv([
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
    ]),
  };
}

export function getServerEnv() {
  return {
    ...getPublicEnv(),
    supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    openaiApiKey: getEnv("OPENAI_API_KEY"),
  };
}

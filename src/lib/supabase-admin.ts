import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing env var ${name}`);
  }
  return value;
}

export const supabaseAdmin = () =>
  createClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

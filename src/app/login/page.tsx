import { SiteHeader } from "@/components/site-header";
import { getCopy } from "@/translations";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { signAdminJwt } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

type LoginState = {
  error?: string;
};

async function authenticate(_: LoginState, formData: FormData): Promise<LoginState> {
  "use server";
  const username = (formData.get("username") as string | null)?.trim();
  const password = (formData.get("password") as string | null)?.trim();

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("id, username, password_hash, role")
    .eq("username", username)
    .single();

  if (error || !data?.password_hash) {
    return { error: "Invalid credentials." };
  }

  const valid = await bcrypt.compare(password, data.password_hash);
  if (!valid) {
    return { error: "Invalid credentials." };
  }

  const token = await signAdminJwt({
    sub: data.id,
    username: data.username,
    role: data.role,
  });

  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/admin");
}

export default function LoginPage({ searchParams }: { searchParams: { lang?: string } }) {
  const { lang, text } = getCopy(searchParams?.lang);

  return (
    <div className="min-h-screen bg-linear-to-b from-(--bg-gradient-from) to-(--bg-gradient-to) text-foreground">
      <SiteHeader lang={lang} labels={text.nav} />
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-12">
        <header className="w-full rounded-3xl bg-(--surface)/90 p-8 shadow-sm ring-1 ring-(--border)">
          <p className="text-xs uppercase tracking-[0.25em] text-(--text-secondary)">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Sign in</h1>
          <p className="mt-2 text-(--text-secondary)">
            Enter your admin username and password to manage the dashboard.
          </p>
        </header>

        <section className="w-full rounded-3xl border border-(--border) bg-(--surface) p-6 shadow-sm">
          <LoginForm action={authenticate} />
        </section>
      </main>
    </div>
  );
}

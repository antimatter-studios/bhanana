import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

async function createUser(formData: FormData) {
  "use server";
  const supabase = supabaseAdmin();
  const username = (formData.get("username") as string | null)?.trim();
  const displayName = (formData.get("display_name") as string | null)?.trim();
  const role = (formData.get("role") as string | null)?.trim();
  const password = (formData.get("password") as string | null)?.trim();

  if (!username || !displayName || !role || !password) {
    throw new Error("All fields are required");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("users").insert({
    username,
    display_name: displayName,
    role,
    password_hash: passwordHash,
  });
  if (error) throw error;
  redirect("/admin/users");
}

export default function NewUserPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)]">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">New user</h1>
          <p className="text-sm text-[var(--text-secondary)]">Create an admin account.</p>
        </div>
        <Link
          href="/admin/users"
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
        >
          Back
        </Link>
      </div>

      <form
        action={createUser}
        className="mt-8 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">
            Username
          </label>
          <input
            name="username"
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--text-primary)]"
            placeholder="admin"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">
            Display name
          </label>
          <input
            name="display_name"
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--text-primary)]"
            placeholder="Admin"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">
            Role
          </label>
          <input
            name="role"
            required
            defaultValue="admin"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--text-primary)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--text-primary)]"
            placeholder="••••••••"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--accent-strong)]"
          >
            Create user
          </button>
          <Link
            href="/admin/users"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

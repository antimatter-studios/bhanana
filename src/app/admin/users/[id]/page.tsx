import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import bcrypt from "bcryptjs";

type Params = { params: { id: string } };

async function loadUser(id: string) {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("id, username, display_name, role")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

async function updateUser(formData: FormData, id: string) {
  "use server";
  const supabase = supabaseAdmin();
  const displayName = (formData.get("display_name") as string | null)?.trim();
  const role = (formData.get("role") as string | null)?.trim();
  const password = (formData.get("password") as string | null)?.trim();

  if (!displayName || !role) {
    throw new Error("Display name and role are required");
  }

  const updates: Record<string, string> = {
    display_name: displayName,
    role,
  };

  if (password) {
    const hash = await bcrypt.hash(password, 10);
    updates.password_hash = hash;
  }

  const { error } = await supabase.from("users").update(updates).eq("id", id);
  if (error) throw error;
  redirect("/admin/users");
}

export default async function UserEditPage({ params }: Params) {
  const user = await loadUser(params.id).catch(() => null);
  if (!user) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)]">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Edit user</h1>
          <p className="text-sm text-[var(--text-secondary)]">{user.username}</p>
        </div>
        <Link
          href="/admin/users"
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
        >
          Back
        </Link>
      </div>

      <form
        action={async (formData) => updateUser(formData, user.id)}
        className="mt-8 space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">
            Display name
          </label>
          <input
            name="display_name"
            defaultValue={user.display_name}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--text-primary)]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">
            Role
          </label>
          <input
            name="role"
            defaultValue={user.role}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--text-primary)]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">
            Password (leave blank to keep unchanged)
          </label>
          <input
            name="password"
            type="password"
            placeholder="New password"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-[var(--text-primary)]"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--accent-strong)]"
          >
            Save changes
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

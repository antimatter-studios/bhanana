import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const revalidate = 0;

type UserRow = {
  id: string;
  username: string;
  display_name: string;
  role: string;
  created_at: string;
  updated_at: string;
};

async function loadUsers(): Promise<UserRow[]> {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("id, username, display_name, role, created_at, updated_at")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export default async function AdminUsersPage() {
  const users = await loadUsers();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)]">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Users</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage accounts for the admin panel.
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--accent-strong)]"
        >
          + New user
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--surface-soft)] text-[var(--text-secondary)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Username</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Updated</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {users.map((user) => (
              <tr key={user.id} className="text-[var(--text-primary)]">
                <td className="px-4 py-3 font-mono text-xs">{user.username}</td>
                <td className="px-4 py-3">{user.display_name}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  {new Date(user.updated_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-[var(--text-secondary)]"
                >
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

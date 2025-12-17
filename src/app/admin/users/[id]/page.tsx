import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SiteHeader } from "@/components/site-header";
import { getCopy } from "@/translations";
import { UserService } from "@/services/user-service";
import { AvatarEditor } from "@/components/avatar-editor";

export const revalidate = 0;

async function loadUser(id: string) {
  try {
    return await UserService.get(id);
  } catch {
    return null;
  }
}

async function updateUser(id: string, formData: FormData) {
  "use server";
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

  await UserService.update(id, updates);
  redirect("/admin/users");
}

export default async function UserEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: { lang?: string };
}) {
  const { id } = await params;
  const user = await loadUser(id);
  if (!user) notFound();
  const { lang, text } = getCopy(searchParams?.lang);

  return (
    <div className="min-h-screen bg-linear-to-b from-(--bg-gradient-from) to-(--bg-gradient-to) text-foreground">
      <SiteHeader lang={lang} labels={text.nav} />
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <nav className="rounded-2xl border border-(--border) bg-[color-mix(in_srgb,var(--surface) 92%,transparent)] p-3 shadow-sm ring-1 ring-(--border)">
            <div className="mb-2 px-3 text-xs uppercase tracking-[0.2em] text-(--text-secondary)">Menu</div>
            <div className="flex flex-col divide-y divide-(--border)">
              <Link
                href="/admin"
                className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-foreground transition hover:bg-(--surface-soft)"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-(--border)" />
                  <span>Admin hub</span>
                </div>
                <span className="text-(--text-secondary) transition group-hover:text-(--accent)">→</span>
              </Link>
              <Link
                href="/admin/users"
                className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-foreground transition hover:bg-(--surface-soft)"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-(--accent)" />
                  <span>Users</span>
                </div>
                <span className="text-(--text-secondary) transition group-hover:text-(--accent)">→</span>
              </Link>
              <Link
                href="/admin/blog"
                className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-foreground transition hover:bg-(--surface-soft)"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-(--border)" />
                  <span>Blog</span>
                </div>
                <span className="text-(--text-secondary) transition group-hover:text-(--accent)">→</span>
              </Link>
            </div>
          </nav>

          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-(--text-secondary)">Admin</p>
                <h1 className="text-3xl font-bold text-foreground">Edit user</h1>
                <p className="text-sm text-(--text-secondary)">{user.username}</p>
              </div>
              <Link
                href="/admin/users"
                className="rounded-full border border-(--border) px-4 py-2 text-sm font-semibold text-foreground hover:bg-(--surface-soft)"
              >
                Back
              </Link>
            </div>

            <div className="space-y-6">
              <AvatarEditor userId={user.id} value={user.avatar_url} />

              <form
                action={updateUser.bind(null, user.id)}
                className="space-y-6 rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-sm ring-1 ring-(--border)"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Display name</label>
                  <input
                    name="display_name"
                    defaultValue={user.display_name}
                    className="w-full rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Role</label>
                  <input
                    name="role"
                    defaultValue={user.role}
                    className="w-full rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Password (leave blank to keep unchanged)
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="New password"
                    className="w-full rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-foreground"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="rounded-full bg-(--accent) px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-(--accent-strong)"
                  >
                    Save changes
                  </button>
                  <Link
                    href="/admin/users"
                    className="rounded-full border border-(--border) px-4 py-2 text-sm font-semibold text-foreground hover:bg-(--surface-soft)"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

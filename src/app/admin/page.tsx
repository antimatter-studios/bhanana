import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getCopy } from "@/translations";

export default function AdminHub({ searchParams }: { searchParams: { lang?: string } }) {
  const { lang, text } = getCopy(searchParams?.lang);

  return (
    <div className="min-h-screen bg-linear-to-b from-(--bg-gradient-from) to-(--bg-gradient-to) text-(--text-primary)">
      <SiteHeader lang={lang} labels={text.nav} />

      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.25em] text-(--text-secondary)">Admin</p>
          <h1 className="text-3xl font-bold">{text.admin.title}</h1>
          <p className="max-w-3xl text-(--text-secondary)">{text.admin.body}</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <nav className="rounded-2xl border border-(--border) bg-[color-mix(in_srgb,var(--surface) 92%,transparent)] p-3 shadow-sm ring-1 ring-(--border)">
            <div className="mb-2 px-3 text-xs uppercase tracking-[0.2em] text-(--text-secondary)">Menu</div>
            <div className="flex flex-col divide-y divide-(--border)">
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
              <div className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-(--text-secondary)">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-(--border)" />
                  <span>Programs</span>
                </div>
                <span className="rounded-full bg-(--surface-soft) px-2 py-0.5 text-[11px] font-semibold">
                  Soon
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-(--text-secondary)">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-(--border)" />
                  <span>Content</span>
                </div>
                <span className="rounded-full bg-(--surface-soft) px-2 py-0.5 text-[11px] font-semibold">
                  Soon
                </span>
              </div>
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

          <div className="flex flex-col gap-3 text-(--text-secondary)">
            <h2 className="text-lg font-semibold text-foreground">Welcome back</h2>
            <p>
              Use the menu to jump directly into management tasks. We removed the heavy cards to keep the panel light and direct.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>Users: manage admin accounts, roles, and credentials.</li>
              <li>Programs (coming soon): organize initiatives and updates.</li>
              <li>Content (coming soon): publish blog and site updates.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

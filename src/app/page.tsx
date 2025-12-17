import { getCopy, languages } from "../translations";
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";

function Stat({ label }: { label: string }) {
  return (
    <div className="rounded-xl bg-white/70 px-4 py-3 shadow-sm ring-1 ring-amber-200/80">
      <p className="text-sm font-semibold text-amber-900">{label}</p>
    </div>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const { lang, text } = getCopy(searchParams?.lang);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-gradient-from)] to-[var(--bg-gradient-to)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-10 backdrop-blur bg-[color-mix(in_srgb,var(--surface) 85%,transparent)] border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="text-lg font-semibold tracking-tight">
            Bhanana
          </div>
          <nav className="hidden gap-6 text-sm font-medium text-[var(--text-primary)] md:flex">
            <a href="#home" className="hover:text-[var(--accent)]">
              {text.nav.home}
            </a>
            <a href="#about" className="hover:text-[var(--accent)]">
              {text.nav.about}
            </a>
            <a href="#blog" className="hover:text-[var(--accent)]">
              {text.nav.blog}
            </a>
            <a href="#contact" className="hover:text-[var(--accent)]">
              {text.nav.contact}
            </a>
            <a href="#admin" className="hover:text-[var(--accent)]">
              {text.nav.admin}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="flex items-center gap-1 rounded-full bg-[var(--surface)]/80 px-2 py-1 ring-1 ring-[var(--border)]">
              {languages.map((l) => (
                <Link
                  key={l}
                  href={`/?lang=${l}`}
                  className={`px-2 py-1 text-xs font-semibold uppercase tracking-wide ${
                    lang === l
                      ? "rounded-full bg-[var(--accent)]/15 text-[var(--accent-strong)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {l}
                </Link>
              ))}
            </div>
            <a
              href="#donate"
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--accent-strong)]"
            >
              {text.cta.donate}
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12" id="home">
        <section className="grid gap-8 rounded-3xl bg-[var(--surface)]/90 p-8 shadow-sm ring-1 ring-[var(--border)] md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
              Bhanana • Nepal
            </p>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              {text.hero.title}
            </h1>
            <p className="text-lg leading-8 text-[var(--text-secondary)]">
              {text.hero.subtitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-[var(--pill)] px-3 py-1 text-sm font-semibold text-[var(--accent-strong)] ring-1 ring-[var(--border)]">
                {text.hero.impact}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                id="donate"
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--accent-strong)]"
                href="#contact"
              >
                {text.cta.donate}
              </a>
              <a
                className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-soft)]"
                href="#contact"
              >
                {text.cta.volunteer}
              </a>
            </div>
          </div>
          <div className="grid gap-3">
            <Stat label={text.stats.confidence} />
            <Stat label={text.stats.belonging} />
            <Stat label={text.stats.continuation} />
            <Stat label={text.stats.girls} />
          </div>
        </section>

        <section
          id="about"
          className="grid gap-8 rounded-3xl bg-[var(--surface)]/90 p-8 shadow-sm ring-1 ring-[var(--border)] md:grid-cols-2"
        >
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">{text.mission.title}</h2>
            <p className="leading-7 text-[var(--text-secondary)]">{text.mission.body}</p>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">{text.approach.title}</h2>
            <p className="leading-7 text-[var(--text-secondary)]">{text.approach.body}</p>
          </div>
        </section>

        <section
          id="blog"
          className="rounded-3xl bg-[var(--surface)]/90 p-8 shadow-sm ring-1 ring-[var(--border)]"
        >
          <h2 className="text-2xl font-bold">{text.blog.title}</h2>
          <p className="mt-2 leading-7 text-[var(--text-secondary)]">{text.blog.body}</p>
          <div className="mt-4 grid gap-3 text-sm text-[var(--text-primary)]">
            {text.impactTiers.items.map((item) => (
              <div
                key={item.amount}
                className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3"
              >
                <span className="min-w-[64px] rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {item.amount}
                </span>
                <p className="leading-6 text-[var(--text-secondary)]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="rounded-3xl bg-[var(--surface)]/90 p-8 shadow-sm ring-1 ring-[var(--border)]"
        >
          <h2 className="text-2xl font-bold">{text.contact.title}</h2>
          <p className="mt-2 leading-7 text-[var(--text-secondary)]">{text.contact.body}</p>
          <div className="mt-4 inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
            {text.contact.email}
          </div>
        </section>

        <section
          id="admin"
          className="rounded-3xl bg-[var(--surface)]/90 p-8 shadow-sm ring-1 ring-[var(--border)]"
        >
          <h2 className="text-2xl font-bold">{text.admin.title}</h2>
          <p className="mt-2 leading-7 text-[var(--text-secondary)]">{text.admin.body}</p>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface) 90%,transparent)] py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 text-sm text-[var(--text-secondary)] md:flex-row md:items-center md:justify-between">
          <p>Bhanana • Nepal • Holistic play, mental health, and safe spaces</p>
          <p className="text-xs text-[var(--text-secondary)]">Built with Next.js, Tailwind, Supabase-ready.</p>
        </div>
      </footer>
    </div>
  );
}

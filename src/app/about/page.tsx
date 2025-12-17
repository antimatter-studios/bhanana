import { getCopy } from "@/translations";
import { SiteHeader } from "@/components/site-header";
import Image from "next/image";

export default function AboutPage({ searchParams }: { searchParams: { lang?: string } }) {
  const { lang, text } = getCopy(searchParams?.lang);

  return (
    <div className="min-h-screen bg-linear-to-b from-(--bg-gradient-from) to-(--bg-gradient-to) text-foreground">
      <SiteHeader lang={lang} labels={text.nav} />

      <section className="relative isolate w-full overflow-hidden bg-black">
        <div className="relative min-h-[360px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=2000&q=80"
            alt="Children playing together in a community space"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/35 to-black/15" />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] items-center px-6 py-12">
            <div className="max-w-2xl space-y-3 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">About</p>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">{text.nav.about}</h1>
              <p className="text-lg leading-8 text-white/85">{text.hero.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-12 px-6 py-12">
        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-strong)">Mission</p>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">Creating safe, playful spaces</h2>
          <p className="text-lg leading-8 text-(--text-secondary) max-w-3xl">{text.hero.subtitle}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              className="rounded-md bg-(--accent) px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--accent-strong)"
              href="/contact"
            >
              {text.cta.donate}
            </a>
            <a
              className="rounded-md border border-(--border) px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-(--surface-soft)"
              href="/contact"
            >
              {text.cta.volunteer}
            </a>
          </div>
        </section>

        <section className="grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{text.mission.title}</h2>
            <p className="leading-7 text-(--text-secondary)">{text.mission.body}</p>
            <p className="leading-7 text-(--text-secondary)">
              We focus on safe spaces, emotional wellbeing, and access to playful learning so every child feels seen,
              heard, and supported.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{text.approach.title}</h2>
            <p className="leading-7 text-(--text-secondary)">{text.approach.body}</p>
            <p className="leading-7 text-(--text-secondary)">
              Our approach blends play-based learning, mental health awareness, and community participation to build
              confidence and belonging.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">What we’re working on</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Play-based programs that nurture social-emotional growth.",
              "Mentor-led sessions to build confidence and resilience.",
              "Community events that celebrate inclusion and belonging.",
            ].map((item) => (
              <div key={item} className="space-y-2">
                <div className="h-1 w-10 rounded-full bg-(--accent)" />
                <p className="leading-7 text-(--text-secondary)">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

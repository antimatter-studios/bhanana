import { getCopy } from "@/translations";
import { SiteHeader } from "@/components/site-header";
import Image from "next/image";

export default function ContactPage({ searchParams }: { searchParams: { lang?: string } }) {
  const { lang, text } = getCopy(searchParams?.lang);

  return (
    <div className="min-h-screen bg-linear-to-b from-(--bg-gradient-from) to-(--bg-gradient-to) text-foreground">
      <SiteHeader lang={lang} labels={text.nav} />
      <section className="relative isolate w-full overflow-hidden bg-black">
        <div className="relative min-h-[320px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1509099836639-18ba02e1c5c9?auto=format&fit=crop&w=2000&q=80"
            alt="Children enjoying activities"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/35 to-black/15" />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] items-center px-6 py-12">
            <div className="max-w-2xl space-y-3 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Contact</p>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">{text.contact.title}</h1>
              <p className="text-lg leading-8 text-white/85">{text.contact.body}</p>
            </div>
          </div>
        </div>
      </section>
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-6 py-12">
        <section className="space-y-5">
          <h2 className="text-2xl font-bold">Ways to reach us</h2>
          <p className="text-(--text-secondary) leading-7">
            For the fastest reply, email us at <strong className="text-foreground">{text.contact.email}</strong>. We welcome collaboration on programs and events, joint impact initiatives, and partnerships that help create safe, playful spaces for children.
          </p>
          <p className="text-(--text-secondary) leading-7">
            If you’re looking to volunteer, mentor, or support on-site activities, tell us about your interests and availability—we’ll match you to sessions that fit. For media and press, we’re happy to share stories, interviews, and coverage about wellbeing, inclusion, and play.
          </p>
          <p className="text-(--text-secondary) leading-7">
            Prefer a deeper collaboration? We also co-create workshops, sponsor safe-space kits, and explore joint research or pilot programs. Let us know your goals and we’ll shape something meaningful together.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              className="rounded-md bg-(--accent) px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--accent-strong)"
              href={`mailto:${text.contact.email}`}
            >
              Email us
            </a>
            <a
              className="rounded-md border border-(--border) px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-(--surface-soft)"
              href="/about"
            >
              Learn about our work
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

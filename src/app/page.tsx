import { getCopy } from "../translations";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { HeroSlider } from "@/components/hero-slider";

export default function Home({ searchParams }: { searchParams: { lang?: string } }) {
  const { lang, text } = getCopy(searchParams?.lang);

  const heroSlides = [
    {
      kicker: "Bhanana • Nepal",
      title: text.hero.title,
      subtitle: text.hero.subtitle,
      cta: { label: text.cta.donate, href: "/contact" },
      secondaryCta: { label: text.cta.volunteer, href: "/contact" },
      stats: [
        text.stats.confidence,
        text.stats.belonging,
        text.stats.continuation,
        text.stats.girls,
      ],
      imageUrl: "https://images.unsplash.com/photo-1509099836639-18ba02e1c5c9?auto=format&fit=crop&w=2000&q=80",
      imageAlt: "Happy children enjoying activities outdoors",
    },
    {
      kicker: "Community impact",
      title: "Safe spaces for every child",
      subtitle: "Warm, inclusive environments that nurture play, learning, and wellbeing.",
      cta: { label: "Join our programs", href: "/contact" },
      stats: [text.stats.confidence, text.stats.belonging],
      imageUrl: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=2000&q=80",
      imageAlt: "Children playing together in a community space",
    },
    {
      kicker: "Learning together",
      title: "Moments of discovery",
      subtitle: "Hands-on activities that spark curiosity and teamwork.",
      cta: { label: "Explore programs", href: "/about" },
      imageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=2000&q=80",
      imageAlt: "Kids learning together at a table",
    },
    {
      kicker: "Creative play",
      title: "Art, crafts, and imagination",
      subtitle: "Spaces where children express themselves through color and shape.",
      cta: { label: "See workshops", href: "/contact" },
      imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
      imageAlt: "Children painting and drawing",
    },
    {
      kicker: "Healthy movement",
      title: "Active days, happy kids",
      subtitle: "Playgrounds and activities that build confidence and resilience.",
      cta: { label: "Join a session", href: "/contact" },
      imageUrl: "https://images.unsplash.com/photo-1495305379050-64540d6ee95d?auto=format&fit=crop&w=2000&q=80",
      imageAlt: "Kids running outdoors",
    },
    {
      kicker: "Community smiles",
      title: "Joy in every gathering",
      subtitle: "Moments that celebrate belonging and togetherness.",
      cta: { label: "Volunteer with us", href: "/contact" },
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=2000&q=80",
      imageAlt: "Smiling child portrait",
    },
    {
      kicker: "Outdoor fun",
      title: "Nature and play",
      subtitle: "Time outside to explore, laugh, and grow.",
      cta: { label: "Plan a visit", href: "/contact" },
      imageUrl: "https://images.unsplash.com/photo-1492724441997-5dc8650f734b?auto=format&fit=crop&w=2000&q=80",
      imageAlt: "Children playing on grass",
    },
    {
      kicker: "Safe spaces",
      title: "Inclusive environments",
      subtitle: "Everyone is welcome and supported.",
      cta: { label: "Support the mission", href: "/contact" },
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2000&q=80",
      imageAlt: "Children in a friendly classroom",
    },
    {
      kicker: "Bright futures",
      title: "Confidence for tomorrow",
      subtitle: "Building self-belief through play and learning.",
      cta: { label: "Donate now", href: "/contact" },
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=80",
      imageAlt: "Smiling child looking at camera",
    },
    {
      kicker: "Shared stories",
      title: "Listening and learning",
      subtitle: "Moments of connection between mentors and kids.",
      cta: { label: "Get involved", href: "/contact" },
      imageUrl: "https://images.unsplash.com/photo-1520854221050-0f4caff449fb?auto=format&fit=crop&w=2000&q=80",
      imageAlt: "Mentor and children reading together",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-(--bg-gradient-from) to-(--bg-gradient-to) text-foreground">
      <SiteHeader lang={lang} labels={text.nav} />

      <main className="flex flex-col gap-12">
        <HeroSlider slides={heroSlides} />

        <section className="mx-auto w-full max-w-[1400px] rounded-2xl bg-(--surface)/90 p-8 shadow-sm ring-1 ring-(--border)">
          <h2 className="text-2xl font-bold">{text.blog.title}</h2>
          <p className="mt-2 leading-7 text-[var(--text-secondary)]">{text.blog.body}</p>
          <div className="mt-4">
            <Link
              className="rounded-md border border-(--border) px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-(--surface-soft)"
              href="/blog"
            >
              Go to blog
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}


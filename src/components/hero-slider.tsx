"use client";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

type HeroSlide = {
  kicker?: string | null;
  title?: string | null;
  subtitle?: string | null;
  cta?: { label: string; href: string } | null;
  secondaryCta?: { label: string; href: string } | null;
  stats?: string[] | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

type Props = {
  slides: HeroSlide[];
};

export function HeroSlider({ slides }: Props) {
  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative isolate w-full overflow-hidden bg-black">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{ clickable: true }}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        spaceBetween={0}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative min-h-[70vh] w-full">
              {slide.imageUrl ? (
                <Image
                  src={slide.imageUrl}
                  alt={slide.imageAlt || slide.title || "Hero image"}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={idx === 0}
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-(--surface) to-(--surface-soft)" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/10" />
              <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] items-center px-6 py-12">
                <div className="max-w-2xl space-y-4 text-white">
                  {slide.kicker ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">{slide.kicker}</p>
                  ) : null}
                  {slide.title ? (
                    <h1 className="text-4xl font-bold leading-tight md:text-5xl">{slide.title}</h1>
                  ) : null}
                  {slide.subtitle ? (
                    <p className="text-lg leading-8 text-white/85">{slide.subtitle}</p>
                  ) : null}
                  {(slide.cta || slide.secondaryCta) && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {slide.cta ? (
                        <a
                          className="rounded-md bg-white/90 px-5 py-3 text-sm font-semibold text-(--accent-strong) shadow-sm transition hover:bg-white"
                          href={slide.cta.href}
                        >
                          {slide.cta.label}
                        </a>
                      ) : null}
                      {slide.secondaryCta ? (
                        <a
                          className="rounded-md border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                          href={slide.secondaryCta.href}
                        >
                          {slide.secondaryCta.label}
                        </a>
                      ) : null}
                    </div>
                  )}
                  {slide.stats && slide.stats.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {slide.stats.map((stat) => (
                        <div
                          key={stat}
                          className="rounded-md bg-white/15 px-4 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-white/15"
                        >
                          {stat}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

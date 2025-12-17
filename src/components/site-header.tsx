"use client";

import Link from "next/link";
import { Lang } from "@/translations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  lang: Lang;
  labels: { home: string; about: string; blog: string; contact: string; admin: string };
};

const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ne", label: "नेपाली" },
];

export function SiteHeader({ lang, labels }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState<{ display_name?: string; username?: string; avatar_url?: string | null } | null>(null);

  const navQuery = useMemo(() => {
    const params = new URLSearchParams(searchParams ?? undefined);
    params.set("lang", lang);
    return `?${params.toString()}`;
  }, [lang, searchParams]);

  const changeLang = (code: Lang) => {
    const params = new URLSearchParams(searchParams ?? undefined);
    params.set("lang", code);
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const selected = LANG_OPTIONS.find((l) => l.code === lang) ?? LANG_OPTIONS[0];

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/current-admin");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setAdmin(data);
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface) 85%,transparent)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4">
        <Link href={`/${navQuery}`} className="text-lg font-semibold tracking-tight hover:text-(--accent)">
          Bhanana
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-[var(--text-primary)] md:flex">
          <Link href={`/${navQuery}`} className="hover:text-(--accent)">
            {labels.home}
          </Link>
          <Link href={`/about${navQuery}`} className="hover:text-(--accent)">
            {labels.about}
          </Link>
          <Link href={`/blog${navQuery}`} className="hover:text-(--accent)">
            {labels.blog}
          </Link>
          <Link href={`/contact${navQuery}`} className="hover:text-(--accent)">
            {labels.contact}
          </Link>
          <Link href={`/admin${navQuery}`} className="hover:text-(--accent)">
            {labels.admin}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-foreground transition hover:text-(--accent)"
            >
              {selected.label}
              <svg
                aria-hidden
                focusable="false"
                className="h-3 w-3 text-(--text-secondary) transition group-data-[open=true]:-rotate-180"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 7.5 10 12l5-4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-(--border) bg-(--surface) shadow-lg">
                <ul className="divide-y divide-(--border) text-sm">
                  {LANG_OPTIONS.map((option) => (
                    <li key={option.code}>
                      <button
                        type="button"
                        onClick={() => changeLang(option.code)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-foreground hover:bg-(--surface-soft)"
                      >
                        <span>{option.label}</span>
                        {option.code === lang && (
                          <span className="h-2 w-2 rounded-full bg-(--accent)" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {admin ? (
            <div className="flex items-center gap-2 text-sm">
              <Avatar className="h-8 w-8 border border-(--border) shadow-sm">
                {admin.avatar_url ? (
                  <AvatarImage src={admin.avatar_url} alt={admin.display_name || admin.username || "Admin"} />
                ) : (
                  <AvatarFallback>{(admin.display_name || admin.username || "?").slice(0, 2).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <div className="leading-tight">
                <div className="font-semibold text-foreground">
                  {admin.display_name || admin.username}
                </div>
                <div className="text-[11px] text-(--text-secondary)">Logged in</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

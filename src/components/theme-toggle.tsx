"use client";

import { useEffect, useState } from "react";

type Theme = "neutral" | "warm" | "pro";

const THEMES: Theme[] = ["neutral", "warm", "pro"];
const STORAGE_KEY = "bhanana-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("neutral");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Read saved theme after mount to keep server/client render in sync
    const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const next = saved && THEMES.includes(saved) ? saved : "neutral";
    if (next !== theme) setTheme(next);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const handleSet = (next: Theme) => {
    setTheme(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-(--text-secondary)">
        <span>Theme</span>
        <span className="opacity-70">…</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 text-xs font-semibold text-foreground">
      <span className="text-(--text-secondary)">Theme</span>
      <select
        value={theme}
        onChange={(e) => handleSet(e.target.value as Theme)}
        className="bg-transparent text-foreground text-xs font-semibold focus:outline-none focus:ring-0"
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}

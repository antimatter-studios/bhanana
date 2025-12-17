"use client";

import { useEffect, useState } from "react";

type Theme = "neutral" | "warm";

const THEMES: Theme[] = ["neutral", "warm"];
const STORAGE_KEY = "bhanana-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "neutral";
    const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    return saved && THEMES.includes(saved) ? saved : "neutral";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const handleSet = (next: Theme) => {
    setTheme(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-xs font-semibold ring-1 ring-[var(--border)]">
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => handleSet(t)}
          className={`rounded-full px-2 py-1 uppercase tracking-wide transition ${
            theme === t
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

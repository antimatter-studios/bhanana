"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export function SiteFooter() {
  return (
    <footer className="border-t border-(--border) bg-(--surface)">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4 text-xs text-(--text-secondary)">
        <span>© {new Date().getFullYear()} Bhanana</span>
        <ThemeToggle />
      </div>
    </footer>
  );
}

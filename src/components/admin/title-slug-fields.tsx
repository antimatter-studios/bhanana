"use client";

import { useMemo, useState } from "react";

type Props = {
  initialTitle?: string;
  initialSlug?: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function TitleSlugFields({ initialTitle = "", initialSlug }: Props) {
  const [title, setTitle] = useState(initialTitle);

  const derivedSlug = useMemo(() => {
    if (title.trim().length > 0) return slugify(title);
    if (initialSlug) return initialSlug;
    return "";
  }, [title, initialSlug]);

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Title</label>
        <input
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-foreground"
          placeholder="Post title"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-foreground">Slug</label>
        <input
          value={derivedSlug || "Will be generated from title"}
          readOnly
          disabled={!derivedSlug}
          className="w-full rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-(--text-secondary)"
        />
        <p className="text-xs text-(--text-secondary)">Slug updates automatically as you edit the title.</p>
      </div>
    </>
  );
}

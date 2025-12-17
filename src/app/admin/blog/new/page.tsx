import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BlogService } from "@/services/blog-service";
import { UserService } from "@/services/user-service";
import { verifyAdminJwt } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { getCopy } from "@/translations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TitleSlugFields } from "@/components/admin/title-slug-fields";

async function createPost(formData: FormData) {
  "use server";
  const title = (formData.get("title") as string | null)?.trim();
  const author = (formData.get("author") as string | null)?.trim();
  const published = (formData.get("published_at") as string | null)?.trim();
  const body = (formData.get("body") as string | null)?.trim();
  const tagsRaw = (formData.get("tags") as string | null)?.trim();

  if (!title || !author || !published || !body) {
    throw new Error("All fields except tags are required");
  }

  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  await BlogService.create({
    title,
    author,
    published_at: published,
    body,
    tags,
  });
  redirect("/admin/blog");
}

export default async function AdminBlogNewPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const users = await UserService.list();
  const authorOptions = users.map((u) => ({
    value: u.username,
    label: u.display_name || u.username,
    avatar_url: u.avatar_url,
  }));

  const token = (await cookies()).get("admin_token")?.value;
  let currentAuthor = authorOptions[0]?.value ?? "";
  if (token) {
    try {
      const payload = await verifyAdminJwt(token);
      const match = authorOptions.find((opt) => opt.value === payload.username);
      currentAuthor = match?.value ?? payload.username ?? currentAuthor;
      if (!match && payload.username) {
        authorOptions.unshift({ value: payload.username, label: payload.username, avatar_url: null });
      }
    } catch {
      // token invalid; fallback to first option
    }
  }

  const { lang, text } = getCopy(searchParams?.lang);
  const selectedAuthor = authorOptions.find((a) => a.value === currentAuthor) ?? authorOptions[0];

  return (
    <div className="min-h-screen bg-linear-to-b from-(--bg-gradient-from) to-(--bg-gradient-to) text-foreground">
      <SiteHeader lang={lang} labels={text.nav} />
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <nav className="rounded-2xl border border-(--border) bg-[color-mix(in_srgb,var(--surface) 92%,transparent)] p-3 shadow-sm ring-1 ring-(--border)">
            <div className="mb-2 px-3 text-xs uppercase tracking-[0.2em] text-(--text-secondary)">Menu</div>
            <div className="flex flex-col divide-y divide-(--border)">
              <Link
                href="/admin"
                className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-foreground transition hover:bg-(--surface-soft)"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-(--border)" />
                  <span>Admin hub</span>
                </div>
                <span className="text-(--text-secondary) transition group-hover:text-(--accent)">→</span>
              </Link>
              <Link
                href="/admin/users"
                className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-foreground transition hover:bg-(--surface-soft)"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-(--border)" />
                  <span>Users</span>
                </div>
                <span className="text-(--text-secondary) transition group-hover:text-(--accent)">→</span>
              </Link>
              <Link
                href="/admin/blog"
                className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-foreground transition hover:bg-(--surface-soft)"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-(--accent)" />
                  <span>Blog</span>
                </div>
                <span className="text-(--text-secondary) transition group-hover:text-(--accent)">→</span>
              </Link>
            </div>
          </nav>

          <div className="flex flex-col gap-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-(--text-secondary)">Admin</p>
                <h1 className="text-3xl font-bold">New post</h1>
                <p className="text-sm text-(--text-secondary)">Create and publish a blog entry.</p>
              </div>
              <Link
                href="/admin/blog"
                className="rounded-full border border-(--border) px-4 py-2 text-sm font-semibold text-foreground hover:bg-(--surface-soft)"
              >
                Back
              </Link>
            </header>

            <form
              action={createPost}
              className="space-y-6 rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-sm ring-1 ring-(--border)"
            >
              <TitleSlugFields />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Author</label>
                  {selectedAuthor ? (
                    <div className="flex items-center gap-2 rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-sm text-(--text-secondary)">
                      <Avatar className="h-8 w-8 border border-(--border)">
                        {selectedAuthor.avatar_url ? (
                          <AvatarImage src={selectedAuthor.avatar_url} alt={selectedAuthor.label} />
                        ) : (
                          <AvatarFallback>
                            {selectedAuthor.label.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-foreground">{selectedAuthor.label}</span>
                    </div>
                  ) : null}
                  <select
                    name="author"
                    required
                    className="w-full rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-foreground"
                    defaultValue={currentAuthor}
                  >
                    {authorOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Published date</label>
                  <input
                    name="published_at"
                    type="datetime-local"
                    required
                    className="w-full rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Tags (comma separated)</label>
                <input
                  name="tags"
                  className="w-full rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-foreground"
                  placeholder="education, programs, impact"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Body</label>
                <textarea
                  name="body"
                  required
                  rows={10}
                  className="w-full rounded-xl border border-(--border) bg-(--surface-soft) px-3 py-2 text-foreground"
                  placeholder="Write your post content..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-(--accent) px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-(--accent-strong)"
                >
                  Publish post
                </button>
                <Link
                  href="/admin/blog"
                  className="rounded-full border border-(--border) px-4 py-2 text-sm font-semibold text-foreground hover:bg-(--surface-soft)"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

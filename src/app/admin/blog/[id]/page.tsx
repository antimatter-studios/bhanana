import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogService } from "@/services/blog-service";
import { UserService } from "@/services/user-service";
import { SiteHeader } from "@/components/site-header";
import { getCopy } from "@/translations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TitleSlugFields } from "@/components/admin/title-slug-fields";

function formatDateTimeLocal(value: string) {
  try {
    return new Date(value).toISOString().slice(0, 16);
  } catch {
    return "";
  }
}

async function updatePost(formData: FormData) {
  "use server";
  const id = (formData.get("id") as string | null)?.trim();
  const title = (formData.get("title") as string | null)?.trim();
  const author = (formData.get("author") as string | null)?.trim();
  const published = (formData.get("published_at") as string | null)?.trim();
  const body = (formData.get("body") as string | null)?.trim();
  const tagsRaw = (formData.get("tags") as string | null)?.trim();

  if (!id || !title || !author || !published || !body) {
    throw new Error("All fields except tags are required");
  }

  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  await BlogService.update(id, {
    title,
    author,
    published_at: published,
    body,
    tags,
  });
}

export default async function AdminBlogEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const { lang: searchLang } = (await searchParams) || {};
  const [post, users] = await Promise.all([BlogService.get(id), UserService.list()]);
  if (!post) return notFound();
  const { lang, text } = getCopy(searchLang);
  const authorOptions = users.map((u) => ({
    value: u.display_name || u.username,
    label: u.display_name || u.username,
    avatar_url: u.avatar_url,
  }));
  const selectedAuthor = authorOptions.find((a) => a.value === post.author) ?? authorOptions[0];

  return (
    <div className="min-h-screen bg-linear-to-b from-(--bg-gradient-from) to-(--bg-gradient-to) text-foreground">
      <SiteHeader lang={lang} labels={text.nav} />
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-(--text-secondary)">Admin</p>
            <h1 className="text-3xl font-bold">Edit post</h1>
            <p className="text-sm text-(--text-secondary)">Update the blog entry and save changes.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-2 rounded-full border border-(--border) px-3 py-1.5 text-xs font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-(--surface-soft)"
            >
              ← Back to list
            </Link>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 rounded-full bg-(--accent) px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-(--accent-strong)"
            >
              + New post
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-(--border) bg-background/80 shadow-sm ring-1 ring-(--border)">
          <div className="border-b border-(--border) px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{post.title}</p>
                <p className="text-xs text-(--text-secondary)">
                  {post.author} • {new Date(post.published_at).toLocaleString()}
                </p>
              </div>
              <div className="text-xs text-(--text-secondary)">
                Updated {new Date(post.updated_at).toLocaleString()}
              </div>
            </div>
          </div>

          <form action={updatePost} className="flex flex-col gap-4 px-5 py-5">
            <input type="hidden" name="id" value={post.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <TitleSlugFields initialTitle={post.title} initialSlug={post.slug} />
              <label className="flex flex-col gap-1 text-sm">
                Author
                {selectedAuthor ? (
                  <div className="flex items-center gap-2 rounded-xl border border-(--border) bg-background px-3 py-2 text-sm text-(--text-secondary)">
                    <Avatar className="h-8 w-8 border border-(--border)">
                      {selectedAuthor.avatar_url ? (
                        <AvatarImage src={selectedAuthor.avatar_url} alt={selectedAuthor.label} />
                      ) : (
                        <AvatarFallback>{selectedAuthor.label.slice(0, 2).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-foreground">{selectedAuthor.label}</span>
                  </div>
                ) : null}
                <select
                  name="author"
                  defaultValue={post.author}
                  className="rounded-xl border border-(--border) bg-background px-3 py-2 text-foreground shadow-inner outline-none ring-1 ring-(--border)/50 focus:ring-(--accent)"
                  required
                >
                  {authorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Published at
                <input
                  type="datetime-local"
                  name="published_at"
                  defaultValue={formatDateTimeLocal(post.published_at)}
                  className="rounded-xl border border-(--border) bg-background px-3 py-2 text-foreground shadow-inner outline-none ring-1 ring-(--border)/50 focus:ring-(--accent)"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Tags (comma separated)
                <input
                  name="tags"
                  defaultValue={post.tags?.join(", ") ?? ""}
                  className="rounded-xl border border-(--border) bg-background px-3 py-2 text-foreground shadow-inner outline-none ring-1 ring-(--border)/50 focus:ring-(--accent)"
                  placeholder="news, release, feature"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm">
              Body
              <textarea
                name="body"
                defaultValue={post.body}
                rows={10}
                className="rounded-xl border border-(--border) bg-background px-3 py-2 text-foreground shadow-inner outline-none ring-1 ring-(--border)/50 focus:ring-(--accent)"
                required
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-(--accent) px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-(--accent-strong)"
              >
                Save changes
              </button>
              <span className="text-xs text-(--text-secondary)">
                Last updated {new Date(post.updated_at).toLocaleString()}
              </span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

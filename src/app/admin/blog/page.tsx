import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getCopy } from "@/translations";
import { BlogService, type BlogPost } from "@/services/blog-service";

export const revalidate = 0;

async function loadPosts(): Promise<BlogPost[]> {
  return BlogService.list();
}

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-(--border) bg-(--surface-soft) px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
    {children}
  </span>
);

export default async function AdminBlogPage({ searchParams }: { searchParams?: { lang?: string } }) {
  const posts = await loadPosts();
  const { lang, text } = getCopy(searchParams?.lang);

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
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.25em] text-(--text-secondary)">Admin</p>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">Blog</h1>
                  <Pill>{posts.length} posts</Pill>
                </div>
                <p className="text-sm text-(--text-secondary)">Manage blog posts for the site.</p>
              </div>
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center rounded-full bg-(--accent) px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-(--accent-strong)"
              >
                + New post
              </Link>
            </header>

            <section className="rounded-2xl border border-(--border) bg-background/80 shadow-sm ring-1 ring-(--border)">
              <div className="flex flex-col gap-3 border-b border-(--border) px-4 py-3 text-sm text-(--text-secondary) sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="h-2 w-2 rounded-full bg-(--accent)" />
                  <span className="font-semibold text-foreground">Post directory</span>
                  <span className="hidden rounded-full bg-(--surface-soft) px-2 py-1 text-[11px] font-semibold sm:inline-flex">
                    {posts.length} records
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-(--surface-soft) px-3 py-1 font-semibold text-(--text-secondary)">
                    {posts.length > 0 ? "Active" : "Empty"}
                  </span>
                  <span className="rounded-full border border-(--border) px-3 py-1 font-semibold text-(--text-secondary)">
                    Sorted by published_at
                  </span>
                </div>
              </div>

              <div className="overflow-hidden">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-(--surface) text-(--text-secondary)">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Title</th>
                      <th className="px-4 py-3 text-left font-semibold">Author</th>
                      <th className="px-4 py-3 text-left font-semibold">Published</th>
                      <th className="px-4 py-3 text-left font-semibold">Tags</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--border) bg-background/50">
                    {posts.map((post) => (
                      <tr key={post.id} className="text-foreground transition hover:bg-(--surface-soft)">
                        <td className="px-4 py-3 font-semibold">{post.title}</td>
                        <td className="px-4 py-3 text-(--text-secondary)">{post.author}</td>
                        <td className="px-4 py-3 text-(--text-secondary)">
                          {new Date(post.published_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-(--text-secondary)">
                          {post.tags?.length ? post.tags.join(", ") : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="inline-flex items-center gap-2 rounded-full border border-(--border) px-3 py-1 text-xs font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-(--surface-soft)"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {posts.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-(--text-secondary)"
                        >
                          No posts yet. Create the first post above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

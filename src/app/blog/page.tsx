import Link from "next/link";
import { getCopy } from "@/translations";
import { SiteHeader } from "@/components/site-header";
import { BlogService, type BlogPost } from "@/services/blog-service";

export const revalidate = 60;

async function loadPosts(): Promise<BlogPost[]> {
  const posts = await BlogService.list();
  return posts;
}

export default async function BlogPage({ searchParams }: { searchParams: { lang?: string } }) {
  const { lang, text } = getCopy(searchParams?.lang);
  const posts = await loadPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-linear-to-b from-(--bg-gradient-from) to-(--bg-gradient-to) text-foreground">
      <SiteHeader lang={lang} labels={text.nav} />
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-4 rounded-3xl bg-(--surface)/90 p-8 shadow-sm ring-1 ring-(--border)">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-(--accent)" />
            <p className="text-xs uppercase tracking-[0.3em] text-(--text-secondary)">Blog</p>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h1 className="text-4xl font-bold">Stories & updates</h1>
              <p className="mt-2 text-lg leading-8 text-(--text-secondary)">
                {text.blog.body || "Latest insights, program highlights, and impact stories."}
              </p>
            </div>
            <span className="rounded-full border border-(--border) px-4 py-2 text-xs font-semibold text-(--text-secondary)">
              {posts.length} posts
            </span>
          </div>
        </header>

        {featured ? (
          <article className="grid gap-6 overflow-hidden rounded-3xl bg-[color-mix(in_srgb,var(--surface) 94%,transparent)] p-6 shadow-sm ring-1 ring-(--border) md:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-(--surface-soft) px-3 py-1 text-xs font-semibold text-(--text-secondary)">
                Featured • {new Date(featured.published_at).toLocaleDateString()}
              </span>
              <h2 className="text-3xl font-bold leading-tight text-foreground">{featured.title}</h2>
              <p className="text-sm font-semibold text-(--text-secondary)">By {featured.author}</p>
              <p className="line-clamp-4 text-base leading-7 text-(--text-secondary)">{featured.body}</p>
              <div className="flex flex-wrap gap-2">
                {(featured.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-(--accent)/20 bg-(--pill) px-3 py-1 text-xs font-semibold text-(--accent-strong) shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/blog/${featured.slug}`}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-(--accent-strong)"
              >
                Read more
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="relative rounded-2xl bg-linear-to-br from-(--surface-soft) to-(--surface) p-6 ring-1 ring-(--border)">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" />
              <div className="space-y-3">
                <p className="text-sm text-(--text-secondary)">Published</p>
                <p className="text-2xl font-semibold text-foreground">
                  {new Date(featured.published_at).toLocaleString()}
                </p>
                <p className="text-sm text-(--text-secondary)">Author</p>
                <p className="text-lg font-semibold text-foreground">{featured.author}</p>
              </div>
            </div>
          </article>
        ) : (
          <div className="rounded-3xl bg-(--surface)/90 p-8 text-(--text-secondary) shadow-sm ring-1 ring-(--border)">
            No posts yet. Check back soon.
          </div>
        )}

        {rest.length > 0 && (
          <section className="rounded-3xl bg-(--surface)/90 p-8 shadow-sm ring-1 ring-(--border)">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">More posts</h3>
              <span className="text-xs uppercase tracking-[0.25em] text-(--text-secondary)">Browse</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <article
                  key={post.id}
                  className="flex h-full flex-col rounded-2xl border border-(--border) bg-(--surface-soft) p-5 shadow-sm ring-1 ring-(--border) transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 text-xs text-(--text-secondary)">
                    <span className="h-2 w-2 rounded-full bg-(--accent)" />
                    {new Date(post.published_at).toLocaleDateString()}
                  </div>
                  <h4 className="mt-2 text-lg font-bold text-foreground">{post.title}</h4>
                  <p className="mt-1 text-sm font-semibold text-(--text-secondary)">By {post.author}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-(--text-secondary)">{post.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(post.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-(--accent)/20 bg-(--pill) px-3 py-1 text-[11px] font-semibold text-(--accent-strong) shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-(--border) px-3 py-2 text-xs font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-(--surface)"
                    >
                      Read more
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

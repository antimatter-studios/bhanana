import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogService } from "@/services/blog-service";
import { SiteHeader } from "@/components/site-header";
import { getCopy } from "@/translations";

export const revalidate = 60;

export default async function BlogDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: { lang?: string };
}) {
  const { id } = await params;
  const post = await BlogService.getBySlugOrId(id);
  if (!post) return notFound();
  const { lang, text } = getCopy(searchParams?.lang);
  const tags = Array.isArray(post.tags)
    ? post.tags.flatMap((t) => t.split(",").map((v) => v.trim()).filter(Boolean))
    : [];

  return (
    <div className="min-h-screen bg-linear-to-b from-(--bg-gradient-from) to-(--bg-gradient-to) text-foreground">
      <SiteHeader lang={lang} labels={text.nav} />
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-12">
        <Link
          href="/blog"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-(--border) px-3 py-1.5 text-xs font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-(--surface-soft)"
        >
          ← Back to blog
        </Link>

        <article className="space-y-6 rounded-3xl bg-(--surface)/90 p-8 shadow-sm ring-1 ring-(--border)">
          <div className="flex flex-wrap items-center gap-3 text-sm text-(--text-secondary)">
            <span className="h-2 w-2 rounded-full bg-(--accent)" />
            <span>{new Date(post.published_at).toLocaleString()}</span>
            <span>•</span>
            <span>{post.author}</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight text-foreground">{post.title}</h1>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-(--border) bg-(--surface-soft) px-3 py-1 text-xs font-semibold text-(--text-secondary)"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="prose max-w-none text-(--text-secondary) prose-headings:text-foreground prose-a:text-(--accent)">
            <p className="whitespace-pre-line text-base leading-8">{post.body}</p>
          </div>
        </article>
      </main>
    </div>
  );
}

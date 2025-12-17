import { supabaseAdmin } from "@/lib/supabase-admin";

export type BlogPost = {
  id: string;
  title: string;
  author: string;
  slug: string | null;
  published_at: string;
  body: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type BlogPostInput = {
  title: string;
  author: string;
  published_at: string;
  body: string;
  tags?: string[];
};

export class BlogService {
  private static client = supabaseAdmin();
  private static slugify(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  }

  private static async ensureSlug(post: BlogPost): Promise<BlogPost> {
    if (post.slug) return post;
    const slug = this.slugify(post.title);
    await this.client.from("blog_posts").update({ slug }).eq("id", post.id);
    return { ...post, slug };
  }

  static async list(): Promise<BlogPost[]> {
    const { data, error } = await this.client
      .from("blog_posts")
      .select("id, title, author, slug, published_at, body, tags, created_at, updated_at")
      .order("published_at", { ascending: false });
    if (error) throw error;
    const posts = data ?? [];
    return Promise.all(posts.map((p) => this.ensureSlug(p)));
  }

  static async get(id: string): Promise<BlogPost | null> {
    const { data, error } = await this.client
      .from("blog_posts")
      .select("id, title, author, slug, published_at, body, tags, created_at, updated_at")
      .eq("id", id)
      .single();
    if (error) {
      if ("code" in error && error.code === "PGRST116") return null;
      throw error;
    }
    if (!data) return null;
    return this.ensureSlug(data);
  }

  static async getBySlugOrId(identifier: string): Promise<BlogPost | null> {
    const { data, error } = await this.client
      .from("blog_posts")
      .select("id, title, author, slug, published_at, body, tags, created_at, updated_at")
      .eq("slug", identifier)
      .single();
    if (error) {
      if ("code" in error && error.code === "PGRST116") {
        // Not found by slug; try by id for legacy URLs.
        return this.get(identifier);
      }
      throw error;
    }
    if (!data) return null;
    return this.ensureSlug(data);
  }

  static async create(input: BlogPostInput) {
    const slug = this.slugify(input.title);
    const { error } = await this.client.from("blog_posts").insert({
      title: input.title,
      author: input.author,
      slug,
      published_at: new Date(input.published_at).toISOString(),
      body: input.body,
      tags: input.tags ?? [],
    });
    if (error) throw error;
  }

  static async update(id: string, input: Partial<BlogPostInput>) {
    const slug = input.title ? this.slugify(input.title) : undefined;
    const { error } = await this.client
      .from("blog_posts")
      .update({
        ...(input.title ? { title: input.title } : {}),
        ...(slug ? { slug } : {}),
        ...(input.author ? { author: input.author } : {}),
        ...(input.published_at ? { published_at: new Date(input.published_at).toISOString() } : {}),
        ...(input.body ? { body: input.body } : {}),
        ...(input.tags ? { tags: input.tags } : {}),
      })
      .eq("id", id);
    if (error) throw error;
  }
}

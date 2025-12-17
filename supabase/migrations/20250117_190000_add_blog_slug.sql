-- Add slug column to blog_posts for SEO-friendly URLs (managed in application code)
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Uniqueness when present
CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_key ON blog_posts (slug) WHERE slug IS NOT NULL;

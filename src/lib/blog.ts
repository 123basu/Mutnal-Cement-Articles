import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogFrontmatter, BlogPost } from "@/lib/types";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export function getBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as BlogFrontmatter;
  if (fm.draft) return null;

  return {
    slug,
    frontmatter: fm,
    content,
    readingTimeMin: Math.ceil(readingTime(content).minutes),
  };
}

export function getAllBlogPosts(): BlogPost[] {
  return getBlogSlugs()
    .map((s) => getBlogPost(s))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

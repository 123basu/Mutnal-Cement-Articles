import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogFrontmatter, BlogPost, AdminBlog } from "@/lib/types";

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

function getAdminBlogsRaw(): AdminBlog[] {
  const filePath = path.join(process.cwd(), "src/data/blogs.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as { blogs: AdminBlog[] };
    return data.blogs || [];
  } catch {
    return [];
  }
}

export function getAdminBlogSlugs(): string[] {
  return getAdminBlogsRaw().map((b) => b.slug).filter(Boolean);
}

export function getAdminBlogs(): AdminBlog[] {
  return getAdminBlogsRaw().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAdminBlogBySlug(slug: string): AdminBlog | null {
  return getAdminBlogsRaw().find((b) => b.slug === slug) || null;
}

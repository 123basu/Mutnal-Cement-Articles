import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllBlogPosts } from "@/lib/blog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

const staticPaths = ["", "/about", "/products", "/contact", "/deliveries", "/blog"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${BASE}/${l}${path}`])
          ),
        },
      });
    }
  }

  for (const post of getAllBlogPosts()) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${BASE}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.frontmatter.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}

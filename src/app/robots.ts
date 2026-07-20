import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE = process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
    : "http://localhost:3000";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}

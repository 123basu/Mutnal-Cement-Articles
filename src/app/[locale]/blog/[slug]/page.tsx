import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAdminBlogSlugs, getAdminBlogBySlug } from "@/lib/blog";
import { Link } from "@/i18n/navigation";

function formatDate(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleDateString(locale);
  } catch {
    return iso;
  }
}

export function generateStaticParams() {
  return getAdminBlogSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const blog = getAdminBlogBySlug(slug);
  if (!blog) return {};
  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      type: "article" as const,
      title: blog.title,
      description: blog.description,
      publishedTime: blog.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const blog = getAdminBlogBySlug(slug);
  if (!blog) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/blog"
        className="text-sm font-medium text-brick-600 hover:underline"
      >
        ← Back to blog
      </Link>

      <p className="mt-6 text-xs uppercase tracking-wide text-brick-500">
        {blog.category}
      </p>
      <h1 className="mt-2 text-4xl font-bold text-stone-900">
        {blog.title}
      </h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-stone-400">
        <span>{blog.author}</span>
        <span>·</span>
        <span>{formatDate(blog.date, locale)}</span>
        <span>·</span>
        <span>{blog.readingTime} min</span>
      </div>

      <div className="mt-8">
        {(blog.content || "").split("\n").map((line, i) => {
          if (line.startsWith("## ")) {
            return (
              <h2 key={i} className="mt-8 text-2xl font-bold text-stone-900">
                {line.slice(3)}
              </h2>
            );
          }
          if (line.startsWith("### ")) {
            return (
              <h3 key={i} className="mt-6 text-xl font-semibold text-stone-800">
                {line.slice(4)}
              </h3>
            );
          }
          if (line.startsWith("**") && line.endsWith("**")) {
            return (
              <p key={i} className="mt-4 font-semibold text-stone-800">
                {line.slice(2, -2)}
              </p>
            );
          }
          if (line.startsWith("> ")) {
            return (
              <blockquote key={i} className="mt-4 border-l-4 border-brick-500 pl-4 italic text-stone-600">
                {line.slice(2)}
              </blockquote>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <li key={i} className="ml-6 list-disc text-stone-700">{line.slice(2)}</li>
            );
          }
          if (line.trim() === "") return <div key={i} className="h-4" />;
          return (
            <p key={i} className="mt-4 text-stone-700 leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    </article>
  );
}

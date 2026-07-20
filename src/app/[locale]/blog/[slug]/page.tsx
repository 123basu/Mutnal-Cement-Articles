import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlogSlugs, getBlogPost } from "@/lib/blog";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      publishedTime: post.frontmatter.date,
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

  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link
        href="/blog"
        className="text-sm font-medium text-brick-600 hover:underline"
      >
        ← Back to blog
      </Link>

      <p className="mt-6 text-xs uppercase tracking-wide text-brick-500">
        {post.frontmatter.tags.join(" · ")}
      </p>
      <h1 className="mt-2 text-4xl font-bold text-stone-900">
        {post.frontmatter.title}
      </h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-stone-400">
        <span>{post.frontmatter.author}</span>
        <span>·</span>
        <span>{new Date(post.frontmatter.date).toLocaleDateString(locale)}</span>
        <span>·</span>
        <span>{post.readingTimeMin} min read</span>
      </div>

      <div className="mt-8">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}

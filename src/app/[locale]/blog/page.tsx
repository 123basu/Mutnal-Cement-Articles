import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getAllBlogPosts } from "@/lib/blog";
import { PostCard } from "@/components/blog/PostCard";

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("Nav");

  const posts = getAllBlogPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold text-stone-900">{nav("blog")}</h1>
      <p className="mt-4 text-lg text-stone-600">
        News, guides and updates from our team.
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 text-stone-500">No posts yet.</p>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}

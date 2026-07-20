import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/types";

function formatDate(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleDateString(locale);
  } catch {
    return iso;
  }
}

export function PostCard({
  post,
  locale,
}: {
  post: BlogPost;
  locale: string;
}) {
  const t = useTranslations("Nav");
  const fm = post.frontmatter;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <p className="text-xs uppercase tracking-wide text-brick-500">
        {fm.tags.join(" · ")}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-stone-900 group-hover:text-brick-600">
        {fm.title}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm text-stone-600">
        {fm.description}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-stone-400">
        <span>{fm.author}</span>
        <span>·</span>
        <span>{formatDate(fm.date, locale)}</span>
        <span>·</span>
        <span>
          {post.readingTimeMin} {t("blog").toLowerCase() === "blog" ? "min" : "min"}
        </span>
      </div>
    </Link>
  );
}

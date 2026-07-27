import { Link } from "@/i18n/navigation";
import type { AdminBlog } from "@/lib/types";

function formatDate(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleDateString(locale);
  } catch {
    return iso;
  }
}

export function AdminBlogCard({
  blog,
  locale,
}: {
  blog: AdminBlog;
  locale: string;
}) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <p className="text-xs uppercase tracking-wide text-brick-500">
        {blog.category}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-stone-900 group-hover:text-brick-600">
        {blog.title}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm text-stone-600">
        {blog.description}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-stone-400">
        <span>{blog.author}</span>
        <span>·</span>
        <span>{formatDate(blog.date, locale)}</span>
        <span>·</span>
        <span>{blog.readingTime} min</span>
      </div>
    </Link>
  );
}

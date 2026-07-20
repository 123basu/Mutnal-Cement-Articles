import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mb-4 mt-2 text-3xl font-bold text-stone-900">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-8 text-2xl font-semibold text-stone-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-6 text-xl font-semibold text-stone-800">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="my-4 leading-7 text-stone-700">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="my-4 list-disc space-y-1 pl-6 text-stone-700">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 list-decimal space-y-1 pl-6 text-stone-700">{children}</ol>
    ),
    a: ({ children, href }) => (
      <a href={href} className="text-brick-600 underline hover:text-brick-700">
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-brick-300 pl-4 italic text-stone-600">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm text-brick-700">
        {children}
      </code>
    ),
    ...components,
  };
}

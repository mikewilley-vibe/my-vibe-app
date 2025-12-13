// app/vibes/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { vibePosts, getVibeBySlug } from "@/app/data/vibes";

type Params = { slug: string };

export async function generateStaticParams() {
  return vibePosts.map((post) => ({ slug: post.slug }));
}

export default async function VibePostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const post = getVibeBySlug(slug);
  if (!post) notFound();

  const related = vibePosts
    .filter((p) => {
      if (p.slug === post.slug) return false;
      if (!post.tags?.length) return false;
      return p.tags?.some((tag) => post.tags.includes(tag));
    })
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/vibes" className="text-sm text-blue-600 hover:underline">
        ← Back to Vibe Log
      </Link>

      <article className="mt-6 prose prose-slate dark:prose-invert">
        <header className="mb-6 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{post.emoji}</span>

            <div>
              <p className="text-xs font-medium text-slate-500">{post.date}</p>
              <h1 className="text-3xl font-bold">{post.title}</h1>

              {post.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <p className="whitespace-pre-line text-slate-700 leading-relaxed">
          {post.message}
        </p>
      </article>

      {/* Related Posts */}
      {related.length ? (
        <div className="mt-12 border-t border-slate-200 pt-6 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Related vibes
          </h2>

          <ul className="mt-4 space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/vibes/${r.slug}`}
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  {r.emoji} {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </main>
  );
}
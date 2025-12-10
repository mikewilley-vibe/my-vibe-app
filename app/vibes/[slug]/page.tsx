// app/vibes/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { vibePosts, getVibeBySlug } from "../../data/vibes";

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  return vibePosts.map((post) => ({
    slug: post.slug,
  }));
}

// 👇 note: async + params is a Promise<Params>
export default async function VibePostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  // unwrap the promise
  const { slug } = await params;

  const post = getVibeBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/vibes" className="text-sm text-blue-600 hover:underline">
        ← Back to Vibe Log
      </Link>

      <article className="mt-6 prose prose-slate dark:prose-invert">
        <header className="mb-6 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{post.emoji}</span>
            <div>
              <p className="text-xs font-medium text-slate-500">
                {post.date}
              </p>
              <h1 className="text-3xl font-bold">{post.title}</h1>
              {post.tags && (
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
)}
            </div>
          </div>
        </header>

        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
          {post.message}
        </p>
      </article>
      {/* Related Posts */}
<div className="mt-12 border-t border-slate-200 pt-6 dark:border-slate-700">
  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
    Related vibes
  </h2>

  <ul className="mt-4 space-y-2">
    {vibePosts
      .filter((p) => p.slug !== post.slug && p.tags.some(tag => post.tags.includes(tag)))
      .slice(0, 3)
      .map((related) => (
        <li key={related.slug}>
          <Link
            href={`/vibes/${related.slug}`}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            {related.emoji} {related.title}
          </Link>
        </li>
      ))}
  </ul>
</div>
    </main>
  );
}
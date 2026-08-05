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
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-14">
        <Link
          href="/vibes"
          className="text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--harbor)] transition-colors"
        >
          ← Back to Vibe Log
        </Link>

        <article className="mt-6">
          <header className="mb-8 border-b border-[var(--fog)] pb-6">
            <p className="label-xs mb-3">{post.date}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--ink)]">
              {post.title}
            </h1>
            <div className="accent-rule" />

            {post.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-lg border border-[var(--fog)] bg-white/80 px-2.5 py-1 text-xs font-medium text-[var(--ink-muted)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </header>

          <p className="whitespace-pre-line text-[var(--ink-muted)] leading-relaxed text-base sm:text-lg">
            {post.message}
          </p>
        </article>

        {related.length ? (
          <div className="mt-12 border-t border-[var(--fog)] pt-6">
            <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Related vibes</h2>
            <ul className="mt-4 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/vibes/${r.slug}`}
                    className="text-sm font-medium text-[var(--harbor)] hover:underline"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

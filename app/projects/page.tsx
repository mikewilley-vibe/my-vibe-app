import Link from "next/link";
import { Card, CardDescription, CardFooter, CardHeader,CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import FadeIn from "@/app/components/motion/FadeIn";
import { projects } from "@/app/data/projects";
import TwoColumnSection from "@/app/components/ui/TwoColumnSection";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Projects &amp; Experience 🚀</h1>
          <p className="mt-2 text-slate-600">
            A snapshot of real work behind Mike&apos;s Vibe Coder HQ.
          </p>
        </header>

       <TwoColumnSection>
  {projects.map((p, index) => (
    <FadeIn key={p.slug} delay={index * 0.05}>
      <Card className="flex h-full flex-col transition-all hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{p.emoji ?? "📁"}</span>
            <span>{p.title}</span>
          </CardTitle>
          <CardDescription>{p.message}</CardDescription>
        </CardHeader>

        <div className="flex-1" />

        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/projects/${p.slug}`}>View project</Link>
          </Button>
        </CardFooter>
      </Card>
    </FadeIn>
  ))}
</TwoColumnSection>
      </div>
    </main>
  );
}
import Link from "next/link";
import { Card, CardDescription, CardFooter, CardHeader,CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import FadeIn from "@/app/components/motion/FadeIn";
import { projects } from "@/app/data/projects";
import TwoColumnSection from "@/app/components/ui/TwoColumnSection";

export default function ProjectsPage() {
  // Color mapping for projects
  const getProjectColor = (index: number) => {
    const colors = [
      "from-blue-50 to-blue-50/50",
      "from-purple-50 to-purple-50/50",
      "from-emerald-50 to-emerald-50/50",
      "from-orange-50 to-orange-50/50",
      "from-pink-50 to-pink-50/50",
      "from-cyan-50 to-cyan-50/50",
      "from-amber-50 to-amber-50/50",
      "from-rose-50 to-rose-50/50",
      "from-indigo-50 to-indigo-50/50",
      "from-teal-50 to-teal-50/50",
      "from-violet-50 to-violet-50/50",
      "from-lime-50 to-lime-50/50",
    ];
    return colors[index % colors.length];
  };

  const getBorderColor = (index: number) => {
    const colors = [
      "border-blue-200 hover:border-blue-400",
      "border-purple-200 hover:border-purple-400",
      "border-emerald-200 hover:border-emerald-400",
      "border-orange-200 hover:border-orange-400",
      "border-pink-200 hover:border-pink-400",
      "border-cyan-200 hover:border-cyan-400",
      "border-amber-200 hover:border-amber-400",
      "border-rose-200 hover:border-rose-400",
      "border-indigo-200 hover:border-indigo-400",
      "border-teal-200 hover:border-teal-400",
      "border-violet-200 hover:border-violet-400",
      "border-lime-200 hover:border-lime-400",
    ];
    return colors[index % colors.length];
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white px-4 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-12 text-center space-y-3">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900">
            Projects &amp; Experience 🚀
          </h1>
          <p className="mt-3 text-slate-600 text-lg max-w-2xl mx-auto">
            A snapshot of real work behind Mike&apos;s Vibe Coder HQ.
          </p>
        </header>

       <TwoColumnSection>
  {projects.map((p, index) => (
    <FadeIn key={p.slug} delay={index * 0.05}>
      <Card className={`flex h-full flex-col transition-all duration-300 border-2 ${getBorderColor(index)} bg-gradient-to-br ${getProjectColor(index)} hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-200/20 group`}>
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 group-hover:text-blue-700 transition-colors">
            <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
              {p.emoji ?? "📁"}
            </span>
            <span>{p.title}</span>
          </CardTitle>
          <CardDescription className="text-slate-600 group-hover:text-slate-700 transition-colors">
            {p.message}
          </CardDescription>
        </CardHeader>

        <div className="flex-1" />

        <CardFooter>
          <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 text-white font-semibold">
            <Link href={`/projects/${p.slug}`}>View project →</Link>
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

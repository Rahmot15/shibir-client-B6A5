import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarRange, Dot, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { footerInfoPages, getFooterInfoPage } from "@/lib/footer-info-pages";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return footerInfoPages.map((page) => ({ slug: page.slug }));
}

export default async function FooterInfoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = getFooterInfoPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050f08] px-[clamp(20px,6vw,80px)] pb-16 pt-30 text-[#f0fff4]">
      <div className="pointer-events-none absolute -left-16 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,200,83,0.16),transparent_65%)]" />
      <div className="pointer-events-none absolute -right-20 top-56 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(200,162,39,0.14),transparent_65%)]" />

      <section className="mx-auto w-full max-w-275 rounded-3xl border border-emerald-500/15 bg-[#071310]/80 p-6 backdrop-blur-sm sm:p-8 lg:p-10">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] tracking-[2px] text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" />
          {page.category}
        </div>

        <h1 className="max-w-4xl text-[clamp(30px,5vw,56px)] font-bold leading-tight tracking-[-0.4px] text-[#f0fff4]">
          {page.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50/65 sm:text-base">
          {page.subtitle}
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {page.highlights.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-[#050f08]/70 px-3 py-2 text-sm text-emerald-100/85"
            >
              <Dot className="h-5 w-5 text-amber-300" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-6 grid w-full max-w-275 gap-4 lg:grid-cols-3">
        {page.sections.map((section, index) => (
          <article
            key={section.heading}
            className="rounded-2xl border border-emerald-500/12 bg-[#071310] p-5 transition-colors hover:border-emerald-400/30"
          >
            <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] text-amber-200/80">
              <CalendarRange className="h-3.5 w-3.5" />
              ধাপ {index + 1}
            </div>
            <h2 className="mb-2 text-xl font-semibold text-emerald-50">{section.heading}</h2>
            <p className="text-sm leading-7 text-emerald-100/70">{section.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-6 w-full max-w-275 rounded-2xl border border-amber-300/20 bg-[linear-gradient(120deg,rgba(0,200,83,0.08),rgba(200,162,39,0.12))] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[2px] text-amber-200/90">পরবর্তী ধাপ</p>
            <h3 className="mt-1 text-lg font-semibold text-[#f0fff4]">আরও জানতে রিপোর্ট ও নোট সেকশন ব্যবহার করুন</h3>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 rounded-lg bg-[#00c853] px-4 py-2.5 text-sm font-semibold text-[#05250f] transition-all hover:-translate-y-0.5 hover:bg-[#00e676]"
            >
              রিপোর্ট
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/note"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/35 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition-all hover:-translate-y-0.5 hover:border-emerald-300"
            >
              নোট
              <BookOpenText className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

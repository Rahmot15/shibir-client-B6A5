import { notFound } from "next/navigation";
import KisorkonthoDetailsClient from "@/components/pages/kisorkontho/KisorkonthoDetailsClient";
import { KISORKONTHO_ISSUES, getKisorkonthoIssueBySlug } from "@/components/pages/kisorkontho/data";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return KISORKONTHO_ISSUES.map((issue) => ({ slug: issue.slug }));
}

export default async function KisorkonthoDetailsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const issue = getKisorkonthoIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  const related = KISORKONTHO_ISSUES.filter((item) => item.slug !== slug).slice(0, 3);

  return <KisorkonthoDetailsClient issue={issue} related={related} />;
}
